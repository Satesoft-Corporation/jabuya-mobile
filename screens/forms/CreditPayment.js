import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useContext, useRef, useEffect } from "react";
import TopHeader from "../../components/TopHeader";
import AppStatusBar from "../../components/AppStatusBar";
import Colors from "../../constants/Colors";
import MyInput from "../../components/MyInput";
import ChipButton from "../../components/buttons/ChipButton";
import { UserContext } from "../../context/UserContext";
import { convertToServerDate, formatNumberWithCommas } from "../../utils/Utils";
import Loader from "../../components/Loader";
import { BaseApiService } from "../../utils/BaseApiService";
import Snackbar from "../../components/Snackbar";
import DataRow from "../../components/cardComponents/DataRow";
import PrimaryButton from "../../components/buttons/PrimaryButton";

const CreditPayment = ({ navigation, route }) => {
  const sale = { ...route.params };

  let balance = sale?.amountLoaned - sale?.amountRepaid;

  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amount, setAmount] = useState("0");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const snackRef = useRef(null);

  const { reload, setReload } = useContext(UserContext);

  const clearForm = () => {
    setAmount("0");
    setRemarks("");
  };

  const savePayment = async () => {
    // setSubmitted(true);
    let payLoad = {
      id: 0,
      creditSaleId: sale?.sale?.id,
      amount: Number(amount),
      paymentDate: convertToServerDate(paymentDate),
    };

    const isValidSubmision = Number(amount) <= balance;

    if (isValidSubmision) {
      setLoading(true);

      new BaseApiService(`/credit-sales/${sale?.id}/payments`)
        .saveRequestWithJsonResponse(payLoad, false)
        .then(async (response) => {
          setLoading(false);
          clearForm();
          setReload(true);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          snackRef.current.show(error?.message, 5000);
        });
    } else {
      snackRef.current.show(
        `Amount should not exceed UGX ${formatNumberWithCommas(balance)}`,
        5000
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.light,
      }}
    >
      <AppStatusBar />
      <TopHeader title={`Credit payment for ${sale?.shopClient?.fullName}`} />
      <Loader loading={loading} />
      <View
        style={{
          marginHorizontal: 5,
          marginVertical: 10,
          paddingHorizontal: 12,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <View style={{ gap: 5, marginBottom: 5, paddingHorizontal: 2 }}>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Credit Payment
            </Text>
          </View>

          <DataRow
            label={"Balance "}
            labelTextStyle={{ fontSize: 15, paddingHorizontal: 4 }}
            valueTextStyle={{ fontSize: 15 }}
            value={
              <>
                <Text style={{ fontSize: 10 }}>UGX</Text>
                <Text style={{ fontWeight: 600 }}>
                  {formatNumberWithCommas(balance)}
                </Text>
              </>
            }
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <MyInput
              label="Client name"
              value={sale?.shopClient?.fullName}
              style={{ flex: 1 }}
              editable={false}
            />
            <MyInput
              label="Id number"
              value={sale?.serialNumber}
              style={{ flex: 1 }}
              editable={false}
              // onValueChange={(text) => setFirstName(text)}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <MyInput
              label="Payment date"
              dateValue={paymentDate}
              isDateInput
              onDateChange={(date) => setPaymentDate(date)}
              style={{ flex: 1 }}
            />

            <MyInput
              label="Amount"
              value={amount}
              style={{ flex: 1 }}
              onValueChange={(text) => setAmount(text)}
              inputMode="numeric"
            />
          </View>

          <MyInput
            label="Remarks"
            numberOfLines={4}
            value={remarks}
            onValueChange={(text) => setRemarks(text)}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <PrimaryButton title={"Save"} onPress={savePayment} />
        </View>
      </View>

      <Snackbar ref={snackRef} />
    </SafeAreaView>
  );
};

export default CreditPayment;

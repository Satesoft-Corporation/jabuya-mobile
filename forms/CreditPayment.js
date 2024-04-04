import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useContext, useRef, useEffect } from "react";
import TopHeader from "../components/TopHeader";
import AppStatusBar from "../components/AppStatusBar";
import Colors from "../constants/Colors";
import MyInput from "../components/MyInput";
import ChipButton from "../components/buttons/ChipButton";
import { UserContext } from "../context/UserContext";
import { convertToServerDate, formatNumberWithCommas } from "../utils/Utils";
import Loader from "../components/Loader";
import { BaseApiService } from "../utils/BaseApiService";
import Snackbar from "../components/Snackbar";
import DataRow from "../components/stocking/DataRow";
const CreditPayment = ({ navigation, route }) => {
  const sale = { ...route.params };

  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const { selectedShop } = useContext(UserContext);

  const snackRef = useRef(null);

  const clearForm = () => {
    setAmount("");
    setRemarks("");
  };

  const savePayment = async () => {
    // setSubmitted(true);
    setLoading(true);
    let payLoad = {
      id: 0,
      creditSaleId: sale?.sale?.id,
      amount: Number(amount),
      paymentDate: convertToServerDate(paymentDate),
    };

    const isValidSubmision = true;

    if (isValidSubmision) {
      setLoading(true);

      new BaseApiService(`/credit-sales/${sale?.id}/payments`)
        .postRequest(payLoad)
        .then((d) => d.json())
        .then(async (response) => {
          setLoading(false);
          clearForm();
          snackRef.current.show("Payment saved succesfully");
        })
        .catch((error) => {
          snackRef.current.show(error?.message);
        });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title={`Credit payment for ${sale?.shopClient?.fullName}`} />
      <Loader loading={loading} />
      <View
        style={{
          marginHorizontal: 5,
          paddingHorizontal: 12,
          marginVertical: 10,
          backgroundColor: Colors.light,
          elevation: 1,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          borderRadius: 8,
        }}
      >
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
                {formatNumberWithCommas(
                  sale?.amountLoaned - sale?.amountRepaid
                )}
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
            value={paymentDate}
            isDateInput
            onValueChange={(date) => setPaymentDate(date)}
            mt={-10}
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

        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            marginBottom: 10,
          }}
        >
          <ChipButton darkMode title={"Save"} onPress={savePayment} />
        </View>
      </View>

      <Snackbar ref={snackRef} />
    </SafeAreaView>
  );
};

export default CreditPayment;

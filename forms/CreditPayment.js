import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useRef } from "react";
import { convertToServerDate, formatNumberWithCommas } from "@utils/Utils";
import { BaseApiService } from "@utils/BaseApiService";
import AppStatusBar from "@components/AppStatusBar";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import DataRow from "@components/card_components/DataRow";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Snackbar from "@components/Snackbar";
import { saveClientSalesOnDevice } from "@controllers/OfflineControllers";
import { useDispatch, useSelector } from "react-redux";
import { getClientSales, getOfflineParams } from "reducers/selectors";
import { setClientSales } from "actions/shopActions";

const CreditPayment = ({ route }) => {
  const sale = { ...route.params };

  const offlineParams = useSelector(getOfflineParams);

  const creditSales = useSelector(getClientSales);

  const dispatch = useDispatch();

  let balance = sale?.amountLoaned - sale?.amountRepaid;

  const [paymentDate, setPaymentDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const snackRef = useRef(null);
  const clearForm = () => {
    setAmount("");
    setRemarks("");
  };

  const savePayment = async () => {
    // setSubmitted(true);
    let payLoad = {
      id: 0,
      creditSaleId: sale?.creditSaleId,
      amount: Number(amount),
      paymentDate: convertToServerDate(paymentDate),
    };

    const isValidSubmision = Number(amount) <= balance && Number(amount) > 0;

    if (isValidSubmision) {
      setLoading(true);

      await new BaseApiService(`/credit-sales/${sale?.id}/payments`)
        .saveRequestWithJsonResponse(payLoad, false)
        .then(async (response) => {
          const newList = await saveClientSalesOnDevice(
            offlineParams,
            creditSales
          );

          dispatch(setClientSales(newList));
          setLoading(false);
          clearForm();
          snackRef.current.show(`Payment saved successfully`, 5000);
        })
        .catch((error) => {
          setLoading(false);
          snackRef.current.show(error?.message, 5000);
        });
    } else {
      snackRef.current.show(
        `Enter valid amount, amount should not exceed ${
          sale?.currency
        }${formatNumberWithCommas(balance)}`,
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
      <TopHeader title={`Credit payment for ${sale?.client_name}`} />
      <Loader loading={loading} />
      <View
        style={{
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
            currency={sale?.currency}
            value={balance}
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <MyInput
              label="Client name"
              value={sale?.client_name}
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

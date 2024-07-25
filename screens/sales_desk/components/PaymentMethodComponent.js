import { View, Text, FlatList } from "react-native";
import React, { useContext, useEffect } from "react";
import { SaleEntryContext } from "context/SaleEntryContext";
import MyInput from "@components/MyInput";
import { paymentMethods } from "@constants/Constants";
import { MyDropDown } from "@components/DropdownComponents";
import Colors from "@constants/Colors";
import ChipButton from "@components/buttons/ChipButton";

const PaymentMethodComponent = ({
  soldOnDate,
  setSoldOnDate,
  amountPaid,
  setAmountPaid,
  clients = [],
  selectedClient,
  setSelectedClient,
  visible,
}) => {
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    recievedAmount,
    setRecievedAmount,
    totalCost,
  } = useContext(SaleEntryContext);

  const isValidAmount = Number(recievedAmount) >= totalCost;

  const SoldOnDateComponent = () => {
    return (
      <MyInput
        isDateInput
        dateValue={soldOnDate}
        label="Sold on"
        onDateChange={(date) => setSoldOnDate(date)}
      />
    );
  };

  const handleInput = (text) => {
    if (selectedPaymentMethod?.id === 0) {
      setRecievedAmount(text);
    } else {
      setAmountPaid(text);
    }
  };

  useEffect(() => {
    if (!isValidAmount) {
      setSelectedPaymentMethod(paymentMethods[1]);
      setAmountPaid(recievedAmount);
    }
  }, [visible]);

  return (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          fontWeight: "600",
        }}
      >
        Payment method
      </Text>
      <View
        style={{
          height: 1,
          backgroundColor: Colors.dark,
          opacity: 0.2,
          marginVertical: 5,
        }}
      />
      <FlatList
        data={paymentMethods}
        renderItem={({ item }) => (
          <ChipButton
            title={item?.name}
            isSelected={item?.id === selectedPaymentMethod?.id}
            onPress={() => setSelectedPaymentMethod(item)}
          />
        )}
        keyExtractor={(item) => item?.name.toString()}
        numColumns={3}
      />

      <View>
        {selectedPaymentMethod?.id === 1 && (
          <MyDropDown
            style={{
              backgroundColor: Colors.light,
              borderColor: Colors.dark,
              marginTop: 5,
            }}
            data={clients}
            onChange={(e) => setSelectedClient(e)}
            value={selectedClient}
            placeholder="Select client"
            labelField="fullName"
            valueField="id"
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <MyInput
              label={
                selectedPaymentMethod?.id === 0
                  ? "Recieved amount"
                  : "Amount paid"
              }
              value={
                selectedPaymentMethod?.id === 0 ? recievedAmount : amountPaid
              }
              onValueChange={(text) => handleInput(text)}
              cursorColor={Colors.dark}
              inputMode="numeric"
            />
          </View>

          <View style={{ flex: 1 }}>
            <SoldOnDateComponent />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentMethodComponent;

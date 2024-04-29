import { View, Text, FlatList, TextInput } from "react-native";
import React, { useContext } from "react";
import Colors from "../../../constants/Colors";
import { paymentMethods } from "../../../constants/Constants";
import { SaleEntryContext } from "../../../context/SaleEntryContext";
import ChipButton from "../../../components/buttons/ChipButton";
import { DatePickerInput } from "react-native-paper-dates";
import { MyDropDown } from "../../../components/DropdownComponents";
import MyInput from "../../../components/MyInput";

const PaymentMethodComponent = ({
  soldOnDate,
  setSoldOnDate,
  amountPaid,
  setAmountPaid,
  clients = [],
  selectedClient,
  setSelectedClient,
}) => {
  const { selectedPaymentMethod, setSelectedPaymentMethod } =
    useContext(SaleEntryContext);

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

      {selectedPaymentMethod?.id === 0 && <SoldOnDateComponent />}

      {selectedPaymentMethod?.id === 1 && (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View style={{ flex: 1, marginTop: 5 }}>
              <MyDropDown
                style={{
                  backgroundColor: Colors.light,
                  borderColor: Colors.dark,
                }}
                data={clients}
                onChange={(e) => setSelectedClient(e)}
                value={selectedClient}
                placeholder="Select client"
                labelField="fullName"
                valueField="id"
                search={false}
              />
            </View>
          </View>

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
                label="Amount paid"
                value={amountPaid}
                onValueChange={(text) => setAmountPaid(text)}
                cursorColor={Colors.dark}
                inputMode="numeric"
              />
            </View>

            <View style={{ flex: 1 }}>
              <SoldOnDateComponent />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PaymentMethodComponent;

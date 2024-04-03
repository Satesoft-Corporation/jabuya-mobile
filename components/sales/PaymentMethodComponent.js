import { View, Text, FlatList, TextInput } from "react-native";
import React, { useContext } from "react";
import Colors from "../../constants/Colors";
import { paymentMethods } from "../../constants/Constants";
import { SaleEntryContext } from "../../context/SaleEntryContext";
import ChipButton from "../buttons/ChipButton";
import { DatePickerInput } from "react-native-paper-dates";
import { MyDropDown } from "../DropdownComponents";

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
      <DatePickerInput
        locale="en"
        value={soldOnDate}
        withModal={true}
        withDateFormatInLabel={false}
        placeholder="MM-DD-YYYY"
        onChange={(d) => setSoldOnDate(d)}
        inputMode="start"
        style={{
          height: 35,
        }}
        mode="outlined"
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

      {selectedPaymentMethod?.id === 0 && (
        <View
          style={{
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <Text>Sold on</Text>
          <SoldOnDateComponent />
        </View>
      )}

      {selectedPaymentMethod?.id === 1 && (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View style={{ flex: 1 }}>
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
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Amount paid
              </Text>
              <TextInput
                value={amountPaid}
                onChangeText={(text) => setAmountPaid(text)}
                cursorColor={Colors.dark}
                inputMode="numeric"
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 0.6,
                  borderColor: Colors.dark,
                  paddingHorizontal: 10,
                  textAlign: "right",
                  height: 35,
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Sold on
              </Text>

              <SoldOnDateComponent />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PaymentMethodComponent;

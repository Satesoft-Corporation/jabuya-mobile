import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import MyInput from "@components/MyInput";
import { paymentMethods } from "@constants/Constants";
import { MyDropDown } from "@components/DropdownComponents";
import Colors from "@constants/Colors";
import ChipButton from "@components/buttons/ChipButton";
import { getCart, getCollectClientInfo, getOffersDebt, getShopClients } from "duqactStore/selectors";
import { useDispatch, useSelector } from "react-redux";
import { updateRecievedAmount } from "actions/shopActions";
import { Switch } from "react-native-paper";

const PaymentMethodComponent = ({
  soldOnDate,
  setSoldOnDate,
  amountPaid,
  setAmountPaid,
  selectedClient,
  setSelectedClient,
  visible,
  clientName,
  setClientName,
  clientNumber,
  setClientNumber,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const offersDebt = useSelector(getOffersDebt);
  const collectInfo = useSelector(getCollectClientInfo);
  const clients = useSelector(getShopClients) ?? [];
  const cart = useSelector(getCart);

  const [existingClient, setExistingClient] = useState(false);

  const onToggleSwitch = () => {
    setClientName("");
    setClientNumber("");
    setSelectedClient(null);
    setExistingClient(!existingClient);
  };

  const dispatch = useDispatch();
  const { totalCartCost, recievedAmount } = cart;

  const SoldOnDateComponent = () => {
    return (
      <MyInput isDateInput dateValue={soldOnDate} label="Sold on" onDateChange={(date) => setSoldOnDate(date)} maximumDate style={{ flex: 0.5 }} />
    );
  };

  const handleInput = (text) => {
    if (selectedPaymentMethod?.id === 0) {
      dispatch(updateRecievedAmount(text));
    } else {
      setAmountPaid(text);
    }
  };

  useEffect(() => {
    if (recievedAmount < totalCartCost) {
      setAmountPaid(String(recievedAmount));
    }
  }, [visible]);

  return (
    <View style={{ marginTop: 10 }}>
      {offersDebt && <Text style={{ fontWeight: "600" }}>Payment method</Text>}
      <View style={{ height: 1, backgroundColor: Colors.dark, opacity: 0.2, marginVertical: 5 }} />

      {offersDebt && (
        <FlatList
          data={paymentMethods}
          renderItem={({ item }) => (
            <ChipButton title={item?.name} isSelected={item?.id === selectedPaymentMethod?.id} onPress={() => setSelectedPaymentMethod(item)} />
          )}
          keyExtractor={(item) => item?.name.toString()}
          numColumns={3}
        />
      )}

      {collectInfo == true && selectedPaymentMethod?.id === 0 && (
        <View style={{ flexDirection: "row", gap: 10, marginVertical: 5, alignItems: "center" }}>
          <Text style={{ fontSize: 15 }}>Existing client</Text>
          <Switch value={existingClient} onValueChange={onToggleSwitch} color="#000" style={{ height: 25 }} />
        </View>
      )}

      <View>
        {selectedPaymentMethod?.id === 0 && collectInfo === true && (
          <View>
            {!existingClient && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 5 }}>
                <MyInput label={"Client Name"} value={clientName} onValueChange={(text) => setClientName(text)} style={{ flex: 0.5 }} />

                <MyInput
                  label={"Phone Number"}
                  value={clientNumber}
                  onValueChange={(text) => setClientNumber(text)}
                  inputMode="numeric"
                  style={{ flex: 0.5 }}
                />
              </View>
            )}

            {existingClient && (
              <MyDropDown
                style={{ backgroundColor: Colors.light, borderColor: Colors.dark, marginTop: 5 }}
                data={clients}
                onChange={(e) => setSelectedClient(e)}
                value={selectedClient}
                placeholder="Select client"
                labelField="fullName"
                valueField="id"
              />
            )}
          </View>
        )}

        {selectedPaymentMethod?.id === 1 && offersDebt === true && (
          <MyDropDown
            style={{ backgroundColor: Colors.light, borderColor: Colors.dark, marginTop: 5 }}
            data={clients}
            onChange={(e) => setSelectedClient(e)}
            value={selectedClient}
            placeholder="Select client"
            labelField="fullName"
            valueField="id"
          />
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, marginTop: 5 }}>
          <MyInput
            label={selectedPaymentMethod?.id === 0 ? "Recieved amount" : "Amount paid"}
            value={selectedPaymentMethod?.id === 0 ? String(recievedAmount) : amountPaid}
            onValueChange={(text) => handleInput(text)}
            cursorColor={Colors.dark}
            inputMode="numeric"
            style={{ flex: 0.5 }}
          />

          <SoldOnDateComponent />
        </View>
      </View>
    </View>
  );
};

export default PaymentMethodComponent;

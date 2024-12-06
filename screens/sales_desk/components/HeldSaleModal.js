import { View, Text } from "react-native";
import React, { useState } from "react";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, holdSale } from "actions/shopActions";
import { getCart } from "reducers/selectors";
import ModalContent from "@components/ModalContent";
import SalesTable from "./SalesTable";
import Colors from "@constants/Colors";

const HeldSaleModal = ({ visible = false, setVisible }) => {
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [error, setError] = useState(null);

  const hide = () => {
    setVisible(false);
    setClientName("");
    setClientNumber("");
  };
  const cart = useSelector(getCart);

  const { cartItems } = cart;

  const dispatch = useDispatch();

  const hold = () => {
    if (clientName === "") {
      setError(true);
    } else {
      dispatch(
        holdSale({
          items: cartItems,
          clientName,
          clientNumber,
          label: clientName + " " + clientNumber,
        })
      );
      setError(false);
      dispatch(clearCart());
      hide();
    }
  };
  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <View
        style={{
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Enter client infomation
        </Text>

        {error && (
          <Text
            style={{
              color: Colors.error,
            }}
          >
            Client name is required
          </Text>
        )}
      </View>

      <SalesTable sales={cartItems} fixHeight={false} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 5,
        }}
      >
        <MyInput label={"Client Name"} value={clientName} onValueChange={(text) => setClientName(text)} />

        <MyInput label={"Client Phone Number"} value={clientNumber} onValueChange={(text) => setClientNumber(text)} inputMode="numeric" />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 10,
          marginBottom: 10,
        }}
      >
        <PrimaryButton darkMode={false} title={"Cancel"} onPress={hide} />
        <PrimaryButton title={"Hold"} onPress={hold} />
      </View>
    </ModalContent>
  );
};

export default HeldSaleModal;

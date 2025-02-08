import { View, Text } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Icon from "./Icon";
import Colors from "@constants/Colors";
import PrimaryButton from "./buttons/PrimaryButton";
import { STOCK_LEVELS } from "@navigation/ScreenNames";
import { StackActions, useNavigation } from "@react-navigation/native";

const SuccessDialog = ({ hide, visible }) => {
  const navigation = useNavigation();
  return (
    <Modal isVisible={visible}>
      <View
        style={{ backgroundColor: "#fff", minHeight: 100, justifyContent: "center", alignItems: "center", padding: 15, borderRadius: 5, gap: 15 }}
      >
        <Icon name="check-circle" groupName="Feather" size={100} color={Colors.green} />

        <Text style={{ fontSize: 20, textAlign: "center" }}>Product information has been saved successfully</Text>

        <View style={{ flexDirection: "row", gap: 5 }}>
          <PrimaryButton title={"List new product"} style={{ flex: 0.5 }} onPress={hide} />
          <PrimaryButton
            title={"Go to products"}
            darkMode
            style={{ flex: 0.5 }}
            onPress={() => navigation.dispatch(StackActions.replace(STOCK_LEVELS))}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SuccessDialog;

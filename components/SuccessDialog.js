import { View, Text } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Icon from "./Icon";
import Colors from "@constants/Colors";
import PrimaryButton from "./buttons/PrimaryButton";
import { StackActions, useNavigation } from "@react-navigation/native";

const SuccessDialog = ({ hide, visible, text, onAgree = () => {}, agreeText, cancelText }) => {
  const navigation = useNavigation();

  if (text) {
    return (
      <Modal isVisible={visible} onBackButtonPress={hide}>
        <View
          style={{ backgroundColor: "#fff", minHeight: 100, justifyContent: "center", alignItems: "center", padding: 15, borderRadius: 5, gap: 15 }}
        >
          <Icon name="check-circle" groupName="Feather" size={100} color={Colors.green} />

          <Text style={{ fontSize: 20, textAlign: "center" }}>{text}</Text>

          <View style={{ flexDirection: "row", gap: 5 }}>
            <PrimaryButton title={cancelText} style={{ flex: 0.5 }} onPress={hide} />
            <PrimaryButton title={agreeText} darkMode style={{ flex: 0.5 }} onPress={onAgree} />
          </View>
        </View>
      </Modal>
    );
  }
};

export default SuccessDialog;

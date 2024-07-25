import React from "react";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import Surface from "./Surface";

export default function ({ children, onBackDropPress, visible = true, style }) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View
        style={{
          backgroundColor: "rgba(52, 52, 52, 0.8)",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <TouchableWithoutFeedback onPress={onBackDropPress}>
          <View style={{ flex: 1 }}>{/*<Text>qwe</Text>*/}</View>
        </TouchableWithoutFeedback>
        <View style={[{ padding: 20 }, style]}>
          <Surface
            style={{ borderRadius: 9, paddingHorizontal: 15, paddingBottom: 5 }}
          >
            {children}
          </Surface>
        </View>
        <TouchableWithoutFeedback onPress={onBackDropPress}>
          <View style={{ flex: 1 }}>{/*<Text>qwe</Text>*/}</View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

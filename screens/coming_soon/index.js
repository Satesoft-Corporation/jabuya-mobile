import { View, Text } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";

const ComingSoon = ({ route }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title={route?.params} />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20 }}>Feature is coming soon.</Text>
      </View>
    </View>
  );
};

export default ComingSoon;

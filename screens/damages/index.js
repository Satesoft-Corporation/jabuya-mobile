import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import TopHeader from "@components/TopHeader";

const Damages = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Shop damages" />

      <View style={{ paddingHorizontal: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Damages</Text>
      </View>
    </SafeAreaView>
  );
};

export default Damages;

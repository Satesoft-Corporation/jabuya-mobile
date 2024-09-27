import { View, Text } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";

const Leads = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <TopHeader title="Leads" showShopName={false} />{" "}
      <Text>Leads</Text>
    </SafeAreaView>
  );
};

export default Leads;

import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import TopHeader from "../../../components/TopHeader";
import { useNavigation } from "@react-navigation/native";
import AppStatusBar from "../../../components/AppStatusBar";
import { BaseStyle } from "../../../utils/BaseStyle";

const UpdatePrice = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar/>

      <TopHeader title="Update "/>

      <View style={BaseStyle.shadowedContainer}>

      </View>
    </SafeAreaView>
  );
};

export default UpdatePrice;

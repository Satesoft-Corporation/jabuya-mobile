import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import { useNavigation } from "@react-navigation/native";

const LockSettings = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />

      <TopHeader title="Applock settings" />
      <Text>LockSettings</Text>
    </SafeAreaView>
  );
};

export default LockSettings;

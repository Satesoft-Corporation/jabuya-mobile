import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const NoAuth = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "400", textAlign: "center" }}>You do not have permission to access this screen.</Text>
    </SafeAreaView>
  );
};

export default NoAuth;

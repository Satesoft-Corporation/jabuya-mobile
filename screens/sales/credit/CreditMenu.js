import { View, Text, FlatList, SafeAreaView } from "react-native";
import React from "react";
import TopHeader from "../../../components/TopHeader";
import AppStatusBar from "../../../components/AppStatusBar";
import Colors from "../../../constants/Colors";
import { Icon } from "../../../components/Icon";

const CreditMenu = ({ navigation }) => {
  const menuItems = [
    {
      id: 1,
      icon: require("../../../assets/icons/icons8-cash-register-50.png"),
      title: "Credit Records",
      target: "credit_records",
    },
    {
      id: 2,
      icon: require("../../../assets/icons/icons8-report-50.png"),
      title: "Add Client",
      target: "new_client",
    },
    {
      id: 3,
      icon: require("../../../assets/icons/icons8-box-50.png"),
      title: "Register",
      target: "client_register",
    },
    {
      id: 4,
      icon: require("../../../assets/icons/icons8-chat-50.png"),
      title: "Suppliers",
    },
  ];

  const handleIconPress = (item) => {
    if (item.target) {
      navigation.navigate(item.target);
      return null;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title="Credit/Debt" />
      <View>
        <FlatList
          style={{ marginTop: 10 }}
          data={menuItems}
          renderItem={({ item }) => (
            <Icon icon={item} onPress={() => handleIconPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreditMenu;

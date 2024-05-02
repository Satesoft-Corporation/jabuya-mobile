import { View, Text, FlatList, SafeAreaView } from "react-native";
import React from "react";
import TopHeader from "../../components/TopHeader";
import AppStatusBar from "../../components/AppStatusBar";
import { MenuIcon } from "../../components/MenuIcon";
import {
  CLIENT_FORM,
  CLIENT_REGISTER,
  CREDIT_SALES,
} from "../../navigation/ScreenNames";

const CreditMenu = ({ navigation }) => {
  const menuItems = [
    {
      id: 1,
      icon: require("../../assets/icons/open-hand.png"),
      title: "Credit Records",
      target: CREDIT_SALES,
    },
    // {
    //   id: 2,
    //   icon: require("../../../assets/icons/icons8-user-plus-48.png"),
    //   title: "Add Client",
    //   target: CLIENT_FORM,
    // },
    {
      id: 3,
      icon: require("../../assets/icons/icons8-book-48.png"),
      title: "Register",
      target: CLIENT_REGISTER,
    },
    // {
    //   id: 4,
    //   icon: require("../../../assets/icons/icons8-chat-50.png"),
    //   title: "Suppliers",
    // },
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

      <TopHeader title="Debtors" />

      <View>
        <FlatList
          style={{ marginTop: 10 }}
          data={menuItems}
          renderItem={({ item }) => (
            <MenuIcon icon={item} onPress={() => handleIconPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreditMenu;

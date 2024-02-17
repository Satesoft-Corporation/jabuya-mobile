import { View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import StockingIcon from "../components/StockingIcon";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import { Image } from "react-native";
import AppStatusBar from "../components/AppStatusBar";
import SelectShop from "../components/SelectShop";

const LandingScreen2 = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar mode="dark" />

      <BlackScreen>
        <UserProfile />

        <SelectShop />
      </BlackScreen>

      <View
        style={{
          paddingHorizontal: 10,
          marginTop:10
        }}
      >
        <Text>Dashboard</Text>
      </View>
    </View>
  );
};

export default LandingScreen2;

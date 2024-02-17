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
import { Icon } from "../components/Icon";
import { categoryIcons } from "../constants/Constants";

const LandingScreen2 = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <BlackScreen>
        <UserProfile />

        <SelectShop />
      </BlackScreen>

      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <FlatList
          style={{ marginTop: 10 }}
          data={categoryIcons}
          renderItem={({ item }) => (
            <Icon
              icon={item}
              onPress={() => navigation.navigate(item.target)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
    </View>
  );
};

export default LandingScreen2;

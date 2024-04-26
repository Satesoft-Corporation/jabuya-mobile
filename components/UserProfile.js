import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import Icon from "./Icon";
import PopUpmenu from "./PopUpMenu";

const UserProfile = ({
  renderNtnIcon = true,
  renderMenu = false,
  menuItems,
}) => {
  const [shops, setShops] = useState(null);
  const navigation = useNavigation();

  const { sessionObj } = useContext(UserContext);

  const { role, fullName, attendantShopName } = { ...sessionObj };

  useEffect(() => {
    UserSessionUtils.getShopCount().then((count) => {
      if (count) {
        setShops(count);
      }
    });
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        alignItems: "center",
        paddingHorizontal: 10,
        backgroundColor: Colors.dark,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("settings")}>
          <Image
            source={require("../assets/images/man_placeholder.jpg")}
            style={{
              width: 45,
              height: 45,
              resizeMode: "cover",
              borderRadius: 3,
              marginStart: 5,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 400,
              fontSize: 12,
            }}
          >
            {fullName}
          </Text>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 300,
              fontSize: 11,
            }}
          >
            {role}
          </Text>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 300,
              fontSize: 11,
            }}
          >
            {attendantShopName || (shops && `Shops: ${shops}`)}
          </Text>
        </View>
      </View>

      {renderNtnIcon && (
        <TouchableOpacity style={{ marginEnd: 10 }}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={Colors.primary_light}
          />
        </TouchableOpacity>
      )}
      {renderMenu && <PopUpmenu menuItems={menuItems} />}
    </View>
  );
};

export default UserProfile;

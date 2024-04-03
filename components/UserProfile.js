import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BaseApiService } from "../utils/BaseApiService";
import { useNavigation } from "@react-navigation/native";

const UserProfile = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shops, setShops] = useState(1);

  const navigation = useNavigation();

  useEffect(() => {
    UserSessionUtils.getShopCount().then((count) => {
      if (count) {
        setShops(count);
      }
    });
    UserSessionUtils.getFullSessionObject().then((data) => {
      if (data) {
        const { roles, firstName, lastName, attendantShopName } = data?.user;
        setRole(roles[0].name);
        setName(firstName + " " + lastName);
        setShopName(attendantShopName);
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
        <TouchableOpacity onPress={() => true}>
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
            {name}
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
            {shopName || `Shops: ${shops}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={{ marginEnd: 10 }}>
        <Ionicons
          name="notifications-outline"
          size={20}
          color={Colors.primary_light}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import PopUpmenu from "./PopUpMenu";
import { SETTINGS } from "../navigation/ScreenNames";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { getUserData, getUserType } from "reducers/selectors";

const UserProfile = ({
  renderNtnIcon = true,
  renderMenu = false,
  menuItems,
  showShops,
}) => {
  const [shops, setShops] = useState(null);
  const navigation = useNavigation();

  const { selectedShop } = useContext(UserContext);

  const sessionObj = useSelector(getUserData);
  const userType = useSelector(getUserType);

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
        alignItems: "center",
        padding: 10,
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
        <TouchableOpacity onPress={() => navigation.navigate(SETTINGS)}>
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
              fontSize: scale(13),
            }}
          >
            {sessionObj?.fullName}
          </Text>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 300,
              fontSize: scale(11),
            }}
          >
            {userType}
          </Text>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 300,
              fontSize: scale(11),
            }}
          >
            {selectedShop?.name || (shops?.length > 1 && `Shops: ${shops}`)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {renderNtnIcon && (
          <TouchableOpacity style={{ marginEnd: 10 }}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.primary_light}
            />
          </TouchableOpacity>
        )}
        {renderMenu && (
          <PopUpmenu menuItems={menuItems} showShops={showShops} />
        )}
      </View>
    </View>
  );
};

export default UserProfile;

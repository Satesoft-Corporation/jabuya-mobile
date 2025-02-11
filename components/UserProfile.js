import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PopUpmenu from "./PopUpMenu";
import { SETTINGS } from "../navigation/ScreenNames";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { getSelectedShop, getUserData, getUserType } from "duqactStore/selectors";
import Icon from "./Icon";

const UserProfile = ({ renderNtnIcon = true, renderMenu = false, menuItems, showShops, filter = false, setShowFilters }) => {
  const navigation = useNavigation();

  const selectedShop = useSelector(getSelectedShop);
  const sessionObj = useSelector(getUserData);
  const userType = useSelector(getUserType);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: Colors.dark }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate(SETTINGS)}>
          <Image
            source={require("../assets/images/man_placeholder.jpg")}
            style={{ width: 45, height: 45, resizeMode: "cover", borderRadius: 3, marginStart: 5 }}
          />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 5 }}>
          <Text style={{ color: Colors.primary, fontWeight: 400, fontSize: scale(13) }}>{sessionObj?.fullName}</Text>
          <Text style={{ color: Colors.primary, fontWeight: 300, fontSize: scale(11) }}>{userType}</Text>
          <Text style={{ color: Colors.primary, fontWeight: 300, fontSize: scale(11) }}>{selectedShop?.name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {filter && <Icon name="filter" groupName="Feather" color={Colors.primary} size={20} onPress={() => setShowFilters(true)} />}
        {renderNtnIcon && (
          <TouchableOpacity style={{ marginEnd: 10 }}>
            <Ionicons name="notifications-outline" size={20} color={Colors.primary_light} />
          </TouchableOpacity>
        )}
        {renderMenu && <PopUpmenu menuItems={menuItems} showShops={showShops} />}
      </View>
    </View>
  );
};

export default UserProfile;

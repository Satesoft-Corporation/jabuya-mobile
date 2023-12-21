import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { UserSessionUtils } from "../utils/UserSessionUtils";

const DrawerContent = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");

  const MENU_ITEM = [
    {
      id: "1",
      title: "Update",
    },
    { id: "2", title: "Logout" },
  ];

  useEffect(() => {
    UserSessionUtils.getFullSessionObject().then((data) => {
      const { roles, firstName, lastName, attendantShopName } = data.user;
      setRole(roles[0].name);
      setName(firstName + " " + lastName);
      setShopName(attendantShopName);
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            height: 150,
            width: "100%",
            alignItems: "center",
            backgroundColor: "gray",
          }}
        >
          <Text style={{ fontSize: 27, color: "white", marginTop: 30 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 14, color: "white", marginTop: 5 }}>
            {role}
          </Text>
        </View>
        <View
          style={{
            width: 86,
            height: 86,
            marginTop: -40,
          }}
        >
          <Image
            source={require("../assets/images/man_placeholder.jpg")}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "cover",
              borderRadius: 50,
            }}
          />
        </View>

        <View style={{ width: "100%", paddingHorizontal: 15 }}>
          <FlatList
            data={MENU_ITEM}
            renderItem={({ item }) => <ItemMenu item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
};
function ItemMenu({ item }) {
  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
        }}
      >
        <Text
          style={{ fontSize: 14, fontWeight: "bold", color: Colors.primary }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default DrawerContent;

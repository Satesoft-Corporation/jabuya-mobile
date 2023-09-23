import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { Ionicons } from "@expo/vector-icons";
import Icon from "../components/Icon";
import { UserSessionUtils } from "../utils/UserSessionUtils";

export default function LandingScreen({ navigation }) {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");

  let userName = user.firstName + " " + user.lastName;

  const categoryIcons = [
    {
      id: 1,
      icon: require("../assets/icons/icons8-cash-register-50.png"),
      title: "Sales Desk",
      target: "salesEntry",
    },
    {
      id: 2,
      icon: require("../assets/icons/icons8-report-50.png"),
      title: "Reports",
      target: "salesEntry",
    },
    {
      id: 3,
      icon: require("../assets/icons/icons8-box-50.png"),
      title: "Stocking",
      target: "salesEntry",
    },
    {
      id: 4,
      icon: require("../assets/icons/icons8-chat-50.png"),
      title: "Chat",
      target: "salesEntry",
    },
  ];
  useEffect(() => {
    UserSessionUtils.getFullSessionObject().then((d) => {
      setUser(d.user);
      setRole(d.user.roles[0].name);
    });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.dark,
        // paddingHorizontal: 15,
      }}
    >
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity>
          <Image
            source={require("../assets/icons/menu2.png")}
            style={{
              width: 30,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginStart: 75 }}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.primary_light}
          />
        </TouchableOpacity>
        {/* </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingStart: 15,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              {userName}
            </Text>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: "bold",
                alignSelf: "flex-end",
              }}
            >
              {role}
            </Text>
          </View>

          <Image
            source={require("../assets/images/profile.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "stretch",
              borderRadius: 50,
              marginStart: 5,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          paddingHorizontal: 15,
        }}
      >
        <View>
          <Text style={{ color: Colors.primary_light }}>Shop Name</Text>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>
            {user.attendantShopName}
          </Text>
        </View>
        <View>
          <Text style={{ color: Colors.primary_light }}>Shop Id</Text>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
              alignSelf: "flex-end",
            }}
          >
            {user.attendantShopId}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          paddingHorizontal: 15,
        }}
      >
        <View>
          <Text style={{ color: Colors.primary_light }}>Join Date</Text>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>
            Thu, Jul 27,2023
          </Text>
        </View>
        <View>
          <Text style={{ color: Colors.primary_light }}>Active period</Text>
          <Text
            style={{
              color: Colors.primary,
              fontSize: 16,
              alignSelf: "flex-end",
            }}
          >
            21 Days
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.light_2,
          marginTop: 10,
        }}
      >
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={categoryIcons}
          renderItem={({ item }) => (
            <Icon
              icon={item}
              onPress={() => navigation.navigate(item.target)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          // ItemSeparatorComponent={Separator}
        />
      </View>

      <View // bottom nav
        style={{
          height: 70,
          backgroundColor: Colors.dark,
          flexDirection: "row",
          alignSelf: "stretch",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setTab("cash")}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "cash" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-money-bag-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("box")}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "box" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-box-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("home")}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "home" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-home-48.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("wallet")}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "wallet" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-wallet-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("check")}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "check" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-reset-50.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

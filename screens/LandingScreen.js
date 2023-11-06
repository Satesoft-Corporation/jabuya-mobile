import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import Icon from "../components/Icon";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import BlackAndWhiteScreen from "../components/BlackAndWhiteScreen";

export default function LandingScreen({ navigation }) {
  const [tab, setTab] = useState("home");
  const [role, setRole] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [shopId, setShopId] = useState("");
  const [routeParams, setRouteParams] = useState(null);

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
      target: "viewSales",
    },
    {
      id: 3,
      icon: require("../assets/icons/icons8-box-50.png"),
      title: "Stocking",
    },
    {
      id: 4,
      icon: require("../assets/icons/icons8-chat-50.png"),
      title: "Chat",
    },
  ];
  useEffect(() => {
    UserSessionUtils.getFullSessionObject().then((data) => {
      const {
        dateCreated,
        roles,
        attendantShopName,
        firstName,
        lastName,
        attendantShopId,
      } = data.user;
      setRole(roles[0].name);
      setJoinDate(formatDate(dateCreated));
      setShopId(attendantShopId);
      setShopName(attendantShopName);
      setName(firstName + " " + lastName);
      setRouteParams(data.user);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
  }, []);
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formattedDay = dayNames[date.getUTCDay()];
    const formattedMonth = monthNames[date.getUTCMonth()];
    const formattedYear = date.getUTCFullYear();

    const formattedDate = `${formattedDay}, ${formattedMonth} ${date.getUTCDate()}, ${formattedYear}`;

    return formattedDate;
  }

  return (
    <BlackAndWhiteScreen >
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
     

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View>
          <Text style={{ color: Colors.primary_light }}>Shop Name</Text>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>
            {shopName}
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
            {shopId}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <View>
          <Text style={{ color: Colors.primary_light }}>Join Date</Text>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>
            {joinDate}
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
          marginTop: 25,
        }}
      >
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={categoryIcons}
          renderItem={({ item }) => (
            <Icon
              icon={item}
              onPress={() =>
                item.target
                  ? navigation.navigate(item.target, routeParams)
                  : null
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
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
    </BlackAndWhiteScreen>
  );
}

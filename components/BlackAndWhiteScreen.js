import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from "react-native";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

// const screenWidth = Dimensions.get('window').width;

const BlackAndWhiteScreen = ({
  children,
  flex = 1.5,
  showProfile = true,
  bgColor = Colors.light,
}) => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    UserSessionUtils.getFullSessionObject().then((data) => {
      const { roles, firstName, lastName, attendantShopName } = data.user;
      setRole(roles[0].name);
      setName(firstName + " " + lastName);
      setShopName(attendantShopName);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={{ flex: flex, backgroundColor: "black" }} />
        <View
          style={[styles.whiteThreeQuarters, { backgroundColor: bgColor }]}
        ></View>
      </View>
      <View style={styles.content}>
        {showProfile && ( //render user info if true
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
                  {shopName}
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
        )}

        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: 1,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    position: "relative",
  },

  whiteThreeQuarters: {
    flex: 3,
    padding: 10, // Add some padding to the white area
  },
});

export default BlackAndWhiteScreen;

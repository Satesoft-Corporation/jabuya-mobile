import React, { useState, useEffect } from "react";
import { View, StyleSheet,TouchableOpacity,Image ,Text} from "react-native";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";


const BlackAndWhiteScreen = ({ children, flex = 1.5, showProfile = true }) => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    UserSessionUtils.getFullSessionObject().then((data) => {
      const { roles, firstName, lastName } = data.user;
      setRole(roles[0].name);
      setName(firstName + " " + lastName);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={{ flex: flex, backgroundColor: "black" }} />
        <View style={styles.whiteThreeQuarters}></View>
      </View>
      <View style={styles.content}>

        {showProfile && ( //render user info if true
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              alignItems: "center",
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
                  {name}
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
                source={require("../assets/images/man_placeholder.jpg")}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "cover",
                  borderRadius: 50,
                  marginStart: 5,
                }}
              />
            </View>
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
    padding: 10,
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

import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import MaterialButton from "../components/MaterialButton";

export default function LandingScreen({navigation}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.dark,
        paddingHorizontal: 15,
      }}
    >
      <AppStatusBar />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop:50
          }}
        >
          <Image
            source={require("../assets/icons/yellow_transparent.png")}
            style={{
              height: 200,
              width: 200,
              resizeMode: "contain",
            }}
          />

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              // justifyContent: "space-between",
              paddingHorizontal: 5,
              alignItems: "center",
            }}
          >
            <MaterialButton
              title="Add Sale"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.primary_light,
                width: 150,
                marginVertical: 20,
              }}
              titleStyle={{
                color: Colors.primary,
                paddingHorizontal: 10,
                letterSpacing: 2,
              }}
              buttonPress={() => navigation.navigate("salesEntry")}
            />
            <MaterialButton
              title="View Sales"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.primary_light,
                width: 150,
                marginVertical: 20,
              }}
              titleStyle={{
                color: Colors.primary,
                paddingHorizontal: 10,
                letterSpacing: 2,
              }}
              buttonPress={() => navigation.navigate("salesEntry")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

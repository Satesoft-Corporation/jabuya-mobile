import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { LANDING_SCREEN } from "@navigation/ScreenNames";

const LoadingScreen = () => {
  const navigation = useNavigation();

  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);

  const logOut = async () => {
    await UserSessionUtils.clearLocalStorageAndLogout(navigation);
  };

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn) {
        navigation.dispatch(StackActions.replace(LANDING_SCREEN));
      } else {
        logOut();
      }
    }, 3000);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#000",
      }}
    >
      <Image
        source={require("../../assets/splash.png")}
        style={{
          height: 250,
          width: 250,
          resizeMode: "contain",
        }}
      />

      <View style={{ flexDirection: "row", gap: 5 }}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={{ color: Colors.primary, fontSize: scale(17) }}>
          ...in real time
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;

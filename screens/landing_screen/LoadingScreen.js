import { View, Text, SafeAreaView, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";
import { CommonActions, StackActions, useNavigation } from "@react-navigation/native";
import { LANDING_SCREEN, LOGIN } from "@navigation/ScreenNames";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadingScreen = () => {
  const navigation = useNavigation();
  const logOut = () => {
    navigation?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: LOGIN }] }));
  };

  const doLoginCheck = async () => {
    const isLoggedIn = await UserSessionUtils.isLoggedIn();
    console.log(isLoggedIn);

    if (isLoggedIn == true) {
      navigation.dispatch(StackActions.replace(LANDING_SCREEN));
    } else {
      logOut();
    }
  };

  const doFTICheck = async () => {
    const val = await UserSessionUtils.getFirstTimeInstall();
    console.log(val);
    if (val) {
      doLoginCheck();
    } else {
      AsyncStorage.clear();
      UserSessionUtils.clearLocalStorageAndLogout(navigation);
      return;
    }
  };
  useEffect(() => {
    setTimeout(() => {
      doFTICheck();
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, backgroundColor: "#000" }}>
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
        <Text style={{ color: Colors.primary, fontSize: scale(17) }}>...in real time</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;

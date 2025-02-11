import { View, Text, SafeAreaView, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";
import { CommonActions, StackActions, useNavigation } from "@react-navigation/native";
import { LANDING_SCREEN, LOGIN } from "@navigation/ScreenNames";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const LoadingScreen = () => {
  const navigation = useNavigation();
  const logOut = () => {
    navigation?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: LOGIN }] }));
  };

  useEffect(() => {
    setTimeout(() => {
      UserSessionUtils.getFirstTimeInstall().then((val) => {
        if (!val) {
          UserSessionUtils.clearLocalStorageAndLogout(navigation);
          return;
        }
      });

      UserSessionUtils.isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn == true) {
          navigation.dispatch(StackActions.replace(LANDING_SCREEN));
        } else {
          logOut();
        }
      });
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

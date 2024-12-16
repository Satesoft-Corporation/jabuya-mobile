import React, { useState } from "react";
import { Image, Text, View, SafeAreaView } from "react-native";
import Constants from "expo-constants";
import { StackActions, useNavigation } from "@react-navigation/native";
import { BaseApiService } from "@utils/BaseApiService";
import { LOGIN_END_POINT } from "@utils/EndPointUtils";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import CircularProgress from "@components/CircularProgress";
import Colors from "@constants/Colors";
import DisplayMessage from "@components/Dialogs/DisplayMessage";
import { LANDING_SCREEN } from "@navigation/ScreenNames";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { changeUser, loginAction } from "actions/userActions";
import { screenWidth } from "@constants/Constants";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const date = new Date();

  const onLogin = async () => {
    const loginInfo = { username, password };

    setDisabled(true);
    await new BaseApiService(LOGIN_END_POINT)
      .saveRequestWithJsonResponse(loginInfo, false)
      .then(async (response) => {
        if (response?.accessToken) {
          await UserSessionUtils.setLoggedIn(true);
          await UserSessionUtils.setUserDetails(response.user);
          await UserSessionUtils.setUserAuthToken(response.accessToken);
          await UserSessionUtils.setUserRefreshToken(response.refreshToken);
          await UserSessionUtils.setFullSessionObject(response);
          await UserSessionUtils.setLoginTime(String(date));
          await UserSessionUtils.resetPendingSales();
          await UserSessionUtils.setLoginDetails(loginInfo);

          dispatch(loginAction(true));
          dispatch(changeUser(response.user));
          navigation.dispatch(StackActions.replace(LANDING_SCREEN));

          setDisabled(false);
        }
      })
      .catch((error) => {
        setMessage(`Login failed!, ${error?.message}`);
        setShowModal(true);
        setDisabled(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark, paddingHorizontal: 15, justifyContent: "space-between" }}>
      <Image
        source={require("../../assets/icons/yellow_transparent.png")}
        style={{ height: 100, width: 100, resizeMode: "contain", alignSelf: "center", marginTop: screenWidth / 4 }}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }}>
        <MyInput
          label="Username"
          value={username}
          onValueChange={(text) => {
            setUsername(text);
          }}
          darkMode
          placeholder="Username,Email or Phone number"
        />

        <MyInput
          label="Password"
          isPassword
          value={password}
          onValueChange={(text) => {
            setPassword(text);
          }}
          darkMode
          placeholder="Password"
        />

        <View style={{ marginTop: 20, height: 40 }}>
          {!disabled ? (
            <PrimaryButton
              title={"Login"}
              style={{ borderColor: Colors.primary, backgroundColor: Colors.primary }}
              onPress={onLogin}
              titleStyle={{ color: Colors.dark, fontSize: 16 }}
            />
          ) : (
            <CircularProgress />
          )}
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: 200, color: Colors.primary }}>Powered by</Text>
          <Text style={{ color: Colors.primary }}>Satesoft</Text>
        </View>
      </ScrollView>
      <Text style={{ color: Colors.primary, alignSelf: "center", fontSize: 14, paddingBottom: 30 }}>v {Constants.expoConfig.version}</Text>
      <DisplayMessage showModal={showMoodal} message={message} onAgree={() => setShowModal(false)} agreeText="OK" />
    </SafeAreaView>
  );
}

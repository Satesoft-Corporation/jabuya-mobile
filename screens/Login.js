import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import MaterialInput from "../components/MaterialInput";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { BaseApiService } from "../utils/BaseApiService";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import Constants from "expo-constants";
import CircularProgress from "../components/CircularProgress";
import { CommonActions } from "@react-navigation/native";
export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  let loginInfo = {
    username,
    password,
  };

  const onLogin = () => {
    setDisabled(true);
    const { dispatch } = navigation;

    new BaseApiService("/auth/login")
      .postRequest(loginInfo)
      .then(async (response) => {
        let d = { info: await response.json(), status: response.status };
        return d;
      })
      .then(async (data) => {
        let { info, status } = data;
        if (status === 200) {
          await UserSessionUtils.setLoggedIn(true);
          await UserSessionUtils.setUserDetails(info.user);
          await UserSessionUtils.setUserAuthToken(info.accessToken);
          await UserSessionUtils.setUserRefreshToken(info.refreshToken);
          await UserSessionUtils.setFullSessionObject(info);
          await UserSessionUtils.setShopid(String(info.user.attendantShopId));
          setPassword("");
          setUsername("");
          navigation.navigate("welcome");
          setTimeout(() => setDisabled(false), 1000);
          dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "welcome" }],
            })
          );
        } else if (status === 400) {
          Alert.alert("Invalid username or password");
          setDisabled(false);
        } else {
          Alert.alert("Login failed!", info.message);
          setDisabled(false);
        }
      })
      .catch((error) => {
        Alert.alert("Login Failed!", error?.message);
        setDisabled(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.dark,
        paddingHorizontal: 15,
      }}
    >
      <AppStatusBar />

      <View
        style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icons/yellow_transparent.png")}
            style={{
              height: 100,
              width: 100,
              resizeMode: "contain",
            }}
          />
        </View>
      </View>
      <Text
        style={{
          fontWeight: "bold",
          color: Colors.primary,
          fontSize: 15,
          paddingVertical: 5,
        }}
      >
        Username
      </Text>

      <MaterialInput
        value={username}
        onChangeText={(text) => {
          setUsername(text);
        }}
        placeholder="Username,Email or Phone number"
        style={{
          borderRadius: 5,
          borderColor: Colors.primary,
          marginBottom: 5,
          color: Colors.primary,
        }}
      />

      <Text
        style={{
          fontWeight: "bold",
          color: Colors.primary,
          fontSize: 15,
          paddingVertical: 5,
        }}
      >
        Password
      </Text>

      <MaterialInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        isPassword={true}
        style={{
          borderRadius: 5,
          borderColor: Colors.primary,
          color: Colors.primary,
        }}
      />

      {!disabled ? (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => onLogin()}
          style={{
            backgroundColor: Colors.primary,
            marginTop: 30,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.primary,
            paddingVertical: 10,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: Colors.dark,
              alignSelf: "center",
              fontSize: 16,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      ) : (
        <CircularProgress />
      )}

      <View
        style={{
          marginTop: 20,
        }}
      >
        <TouchableOpacity>
          <Text
            style={{
              alignSelf: "center",
              paddingVertical: 15,
              fontSize: 14,
              fontWeight: 200,
              color: Colors.primary,
            }}
          >
            Forgot password
          </Text>
        </TouchableOpacity>

        <View style={{ margin: 10, alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 200,
              color: Colors.primary,
            }}
          >
            Powered by
          </Text>
          <Text style={{ color: Colors.primary }}>Satesoft</Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "center",
          position: "absolute",
          bottom: 10,
        }}
      >
        <Text
          style={{ color: Colors.primary, alignSelf: "center", fontSize: 12 }}
        >
          V {Constants.expoConfig.version}
        </Text>
      </View>
    </View>
  );
}

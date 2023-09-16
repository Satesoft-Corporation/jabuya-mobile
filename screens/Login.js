import React, { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import MaterialButton from "../components/MaterialButton";
import MaterialInput from "../components/MaterialInput";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { BaseApiService } from "../utils/BaseApiService";
import { UserSessionUtils } from "../utils/UserSessionUtils";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let loginInfo = {
    username,
    password,
  };

  const onLogin = () => {
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
          navigation.navigate("welcome");
          setPassword("");
          setUsername("");
        } else if (status === 400) {
          Alert.alert("Invalid username or password");
        }
      })
      .catch((error) => {
        Alert.alert("Login Failed!", error?.message);
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

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/icons/yellow_transparent.png")}
            style={{
              height: 150,
              width: 150,
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
          color: Colors.light,
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
          color: Colors.light,
        }}
      />

      <MaterialButton
        title="LOGIN"
        style={{
          backgroundColor: Colors.dark,
          marginTop: 30,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: Colors.primary,
        }}
        titleStyle={{
          fontWeight: "bold",
          color: Colors.primary,
        }}
        buttonPress={() => onLogin()}
      />

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

        <View
          style={{
            borderBottomColor: Colors.primary,
            borderBottomWidth: 1,
            marginTop: 5,
          }}
        ></View>
      </View>
      <SocailMediaLinks />
    </View>
  );

  function SocailMediaLinks() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
          alignItems: "center",
          marginTop: -35,
        }}
      >
        <MaterialButton
          title="Google"
          style={{
            backgroundColor: Colors.dark,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.primary_light,
          }}
          titleStyle={{
            color: Colors.primary_light,
            paddingHorizontal: 10,
            letterSpacing: 2,
          }}
          buttonPress={() => console.log("hello world")}
        />
        <MaterialButton
          title="Facebook"
          style={{
            backgroundColor: Colors.dark,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.primary_light,
          }}
          titleStyle={{
            color: Colors.primary_light,
            paddingHorizontal: 10,
            letterSpacing: 2,
          }}
          buttonPress={() => console.log("hello world")}
        />
        <MaterialButton
          title="Twitter"
          style={{
            backgroundColor: Colors.dark,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.primary_light,
          }}
          titleStyle={{
            color: Colors.primary_light,
            paddingHorizontal: 10,
            letterSpacing: 2,
          }}
          buttonPress={() => console.log("hello world")}
        />
      </View>
    );
  }
}

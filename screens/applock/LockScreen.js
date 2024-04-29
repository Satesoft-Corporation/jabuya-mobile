import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../../constants/Colors";
import PinDot from "./PinDot";
import NumbersContiner from "./NumbersContiner";
import { TouchableOpacity } from "react-native";
import AppStatusBar from "../../components/AppStatusBar";
import { Image } from "react-native";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { UserContext } from "../../context/UserContext";
import { CommonActions } from "@react-navigation/native";
import Icon from "../../components/Icon";
import * as LocalAuthentication from "expo-local-authentication";
import { LANDING_SCREEN } from "../../navigation/ScreenNames";

const LockScreen = ({ navigation, route }) => {
  const [pinCode, setPinCode] = useState(["", "", "", "", ""]);
  const [errorText, setErrorText] = useState(null);

  const { userPincode } = useContext(UserContext);

  const onNumberPress = (num) => {
    setErrorText(null);

    let tempCode = [...pinCode];
    for (let i = 0; i < tempCode.length; i++) {
      if (tempCode[i] === "") {
        tempCode[i] = String(num);
        break;
      } else {
        continue;
      }
    }

    setPinCode(tempCode);
  };

  const onClear = () => {
    let tempCode = [...pinCode];
    for (let x = tempCode.length - 1; x >= 0; x--) {
      if (tempCode[x] !== "") {
        tempCode[x] = "";
        break;
      } else {
        continue;
      }
    }
    setPinCode(tempCode);
  };

  const logTheUserIn = async () => {
    await UserSessionUtils.setPinLoginTime(String(new Date()));
    navigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: LANDING_SCREEN }],
      })
    );
  };

  const authWithPin = async () => {
    const isCorrectPin = pinCode.join("") === userPincode;

    if (isCorrectPin) {
      await logTheUserIn();
      setPinCode(["", "", "", "", ""]);
    }

    if (!pinCode.includes("") && !isCorrectPin) {
      setErrorText("Incorrect PIN");
      setPinCode(["", "", "", "", ""]);
    }
  };

  const handleFingerprintAuth = async () => {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isAvailable) {
        return;
      }

      if (!isEnrolled) {
        return;
      }

      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with fingerprint",
      });

      if (success) {
        console.log("Authentication successful");
        logTheUserIn();
      } else {
        console.log("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  useEffect(() => {
    if (!pinCode.includes("")) {
      authWithPin();
    }
  }, [pinCode]);

  useEffect(() => {
    handleFingerprintAuth();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <AppStatusBar />

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Image
          source={require("../../assets/icons/yellow_transparent.png")}
          style={{
            height: 120,
            width: 120,
            resizeMode: "contain",
          }}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          height: 100, //100 if logo
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            letterSpacing: 0.34,
            lineHeight: 25,
            color: Colors.light,
          }}
        >
          Enter pin code
        </Text>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          {pinCode.map((n, i) => (
            <PinDot key={i} number={n} />
          ))}
        </View>
      </View>

      <NumbersContiner
        onPress={onNumberPress}
        fpAuth={handleFingerprintAuth}
        showFpIcon
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 30,
          alignItems: "center",
          height: 30,
        }}
      >
        <View>
          <Text style={{ color: Colors.light }}>Forgot pin?</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClear}
          style={{ justifyContent: "center" }}
        >
          <Icon
            name="delete"
            groupName="Feather"
            color={Colors.light}
            size={25}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        {errorText && (
          <Text
            style={{ alignSelf: "center", fontSize: 16, color: Colors.error }}
          >
            {errorText}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LockScreen;

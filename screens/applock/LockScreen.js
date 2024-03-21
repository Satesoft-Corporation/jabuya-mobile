import { View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../../constants/Colors";
import PinDot from "../../components/lockscreen/PinDot";
import NumbersContiner from "../../components/lockscreen/NumbersContiner";
import { TouchableOpacity } from "react-native";
import AppStatusBar from "../../components/AppStatusBar";
import { Image } from "react-native";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { UserContext } from "../../context/UserContext";
import { CommonActions } from "@react-navigation/native";

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

  const authWithPin = async () => {
    const isCorrectPin = pinCode.join("") === userPincode;

    if (isCorrectPin) {
      const { dispatch } = navigation;
      setPinCode(["", "", "", "", ""]);
      await UserSessionUtils.setPinLoginTime(String(new Date()));
      dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "welcome" }],
        })
      );
    }

    if (!pinCode.includes("") && !isCorrectPin) {
      setErrorText("Incorrect PIN");
      setPinCode(["", "", "", "", ""]);
    }
  };

  useEffect(() => {
    if (!pinCode.includes("")) {
      authWithPin();
    }
  }, [pinCode]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
          source={require("../../assets/icons/icon2.png")}
          style={{
            height: 100,
            width: 100,
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
            // color: Colors.light,
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

      <NumbersContiner onPress={onNumberPress} />

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
          <Text>Forgot pin?</Text>
        </View>
        <TouchableOpacity
          onPress={onClear}
          style={{ justifyContent: "center" }}
        >
          <Image
            source={require("../../assets/icons/icons8-chevron-left-30.png")}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        {errorText && (
          <Text style={{ alignSelf: "center", fontSize: 16 }}>{errorText}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LockScreen;

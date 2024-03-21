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
import PrimaryButton from "../../components/buttons/PrimaryButton";

const LockSetUp = ({ navigation, route }) => {
  const [pinCode, setPinCode] = useState(["", "", "", "", ""]);
  const [lockText, setLockText] = useState("Set pin code");

  const [confirmPinCode, setConfirmPinCode] = useState(null);
  const [confirmPinCode2, setConfirmPinCode2] = useState(null);
  const [pinReady, setIsPinReady] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const { hasUserSetPinCode, setHasUserSetPinCode } = useContext(UserContext);

  const onNumberPress = (num) => {
    let tempCode = [...pinCode];
    setErrorText(null);
    for (let i = 0; i < tempCode.length; i++) {
      if (tempCode[i] === "") {
        tempCode[i] = String(num);
        break;
      } else {
        continue;
      }
    }

    setPinCode(tempCode);

    if (!hasUserSetPinCode) {
    }
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

  const onConfirmPin = () => {
    // setErrorText(null);
    if (confirmPinCode?.length === 5 && !confirmPinCode2) {
      setLockText("Re-enter your pin code");
      setConfirmPinCode2(confirmPinCode);
      setPinCode(["", "", "", "", ""]);
      setConfirmPinCode(null);
      setIsPinReady(true);
    }

    if (confirmPinCode2?.length === 5) {
      if (confirmPinCode?.join("") === confirmPinCode2?.join("")) {
        UserSessionUtils.setUserPinCode(pinCode.join(""));
        setHasUserSetPinCode(true);
        UserSessionUtils.setPinLoginTime(String(new Date()));
        navigation.goBack();
        return true;
      } else {
        setErrorText("Pin codes do not match, re-enter again");
        setPinCode(["", "", "", "", ""]);
      }
    }
  };

  useEffect(() => {
    if (!pinCode.includes("")) {
      setConfirmPinCode(pinCode);
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
          height: 170, //100 if logo
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
          {lockText}
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
        }}
      >
        <View></View>
        <TouchableOpacity onPress={onClear}>
          <Text style={{}}>Clear</Text>
        </TouchableOpacity>
      </View>

      {!pinCode.includes("") && (
        <PrimaryButton
          title={pinReady ? "Save pin" : "Confirm pin code"}
          style={{ flex: 0, marginHorizontal: 10, marginTop: 20 }}
          onPress={onConfirmPin}
        />
      )}
      <View>
        {errorText && <Text style={{ alignSelf: "center" }}>{errorText}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default LockSetUp;

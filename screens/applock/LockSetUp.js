import { Text, SafeAreaView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import ReactNativePinView from "react-native-pin-view";
import { useNavigation } from "@react-navigation/native";
import { userData } from "context/UserContext";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import Colors from "@constants/Colors";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Icon from "@components/Icon";

const LockSetUp = () => {
  const [lockText, setLockText] = useState("Set pin code");
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  const { getAppLockStatus } = userData();

  const pinLength = 5;

  const navigation = useNavigation();

  const onConfirmPin = async () => {
    if (showCompletedButton) {
      await UserSessionUtils.setUserPinCode(enteredPin);
      await getAppLockStatus();

      await UserSessionUtils.setPinLoginTime(String(new Date()));
      navigation.goBack();
      return true;
    }
  };

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === pinLength) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [enteredPin]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.dark,
        justifyContent: "center",
      }}
    >
      <Text
        style={{ color: Colors.primary, textAlign: "center", fontSize: 17 }}
      >
        {lockText}
      </Text>

      <ReactNativePinView
        inputSize={25}
        ref={pinView}
        pinLength={pinLength}
        buttonSize={70}
        onValueChange={(value) => setEnteredPin(value)}
        buttonAreaStyle={{
          marginTop: 24,
          paddingHorizontal: 20,
        }}
        inputAreaStyle={{
          marginVertical: 25,
        }}
        inputViewEmptyStyle={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#FFF",
        }}
        inputViewFilledStyle={{
          backgroundColor: Colors.primary,
          borderColor: "#fff",
          borderWidth: 1,
        }}
        buttonViewStyle={{
          borderWidth: 1,
          borderColor: "#FFF",
        }}
        buttonTextStyle={{
          color: "#FFF",
        }}
        onButtonPress={(key) => {
          if (key === "custom_right") {
            pinView.current.clear();
          }
        }}
        customRightButton={
          showRemoveButton ? (
            <Icon
              name="delete"
              groupName="Feather"
              color={Colors.light}
              size={25}
            />
          ) : undefined
        }
      />

      <PrimaryButton
        title={showCompletedButton ? "Save pin" : ""}
        style={{ flex: 0, marginHorizontal: 10, marginTop: 20 }}
        onPress={onConfirmPin}
      />
    </SafeAreaView>
  );
};

export default LockSetUp;

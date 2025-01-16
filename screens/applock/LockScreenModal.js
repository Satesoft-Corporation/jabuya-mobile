import { Text, SafeAreaView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Image } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import Colors from "@constants/Colors";
import Modal from "react-native-modal";
import ReactNativePinView from "react-native-pin-view";
import Icon from "@components/Icon";
import { useDispatch, useSelector } from "react-redux";
import { getUserPinCode } from "duqactStore/selectors";
import { setApplockTime } from "actions/userActions";

const LockScreenModal = ({ showLock = false, hideLock = () => {} }) => {
  const [errorText, setErrorText] = useState(null);

  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [hasFP, setHasFp] = useState(false);

  const userPincode = useSelector(getUserPinCode);
  const dispatch = useDispatch();

  const pinLength = 5;

  const logTheUserIn = async () => {
    dispatch(setApplockTime(String(new Date())));
    hideLock();
  };

  const authWithPin = async () => {
    const isCorrectPin = enteredPin == userPincode;

    console.log(userPincode);
    if (isCorrectPin) {
      await logTheUserIn();
    } else {
      setErrorText("Incorrect PIN");
    }
  };

  const handleFingerprintAuth = async () => {
    if (showLock === true) {
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
          promptMessage: "Unlock to use Duqact",
        });

        if (success) {
          console.log("Authentication successful");
          await logTheUserIn();
        } else {
          console.log("Authentication failed");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }
  };

  useEffect(() => {
    setErrorText(null);
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === pinLength) {
      authWithPin();
    }
  }, [enteredPin]);

  const checkFingerPrintSupport = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (isAvailable === true && isEnrolled === true) {
      setHasFp(true);
    }
  };

  useEffect(() => {
    checkFingerPrintSupport();
    handleFingerprintAuth();
  }, [showLock]);

  return (
    <Modal
      style={{
        flex: 1,
        backgroundColor: "#000",
        margin: 0,
        justifyContent: "space-between",
      }}
      isVisible={showLock}
    >
      <SafeAreaView>
        <Image
          source={require("../../assets/icons/yellow_transparent.png")}
          style={{
            height: 90,
            width: 120,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            fontSize: 22,
            letterSpacing: 0.34,
            lineHeight: 25,
            color: Colors.light,
            textAlign: "center",
          }}
        >
          Enter pin code
        </Text>
      </SafeAreaView>

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
          marginTop: 20,
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
          if (key === "custom_left" && hasFP) {
            handleFingerprintAuth();
          }
        }}
        customRightButton={showRemoveButton ? <Icon name="delete" groupName="Feather" color={Colors.light} size={25} /> : null}
        customLeftButton={hasFP ? <Icon name="fingerprint" color="#fff" size={30} /> : null}
      />

      <Text
        style={{
          alignSelf: "center",
          fontSize: 16,
          color: errorText ? Colors.error : "#000",
        }}
      >
        {errorText}
      </Text>
    </Modal>
  );
};

export default LockScreenModal;

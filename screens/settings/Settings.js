import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import { SafeAreaView } from "react-native";
import Colors from "../../constants/Colors";
import SettingsBar from "../../components/SettingsBar";
import Constants from "expo-constants";
import { UserContext } from "../../context/UserContext";
import DisplayMessage from "../../components/Dialogs/DisplayMessage";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { LOCK_SETuP } from "../../navigation/ScreenNames";

const Settings = ({ navigation }) => {
  const { hasUserSetPinCode, sessionObj } = useContext(UserContext);

  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [agreeFn, setAgreeFn] = useState(() => {});

  const { role, fullName } = sessionObj;

  const handleAppLockPress = () => {
    if (hasUserSetPinCode === true) {
      setMessage("Pin code is already set, would you like to change it?");
      setAgreeText("Yes");
      setCanCancel(true);
      setShowModal(true);
    } else {
      navigation.navigate(LOCK_SETuP);
    }
  };

  const logOut = () => {
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />

      <TopHeader title="Settings" showShopName={false} />

      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Account</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              borderBottomWidth: 1,
              borderBottomColor: Colors.gray,
              paddingBottom: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/images/man_placeholder.jpg")}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "cover",
                  borderRadius: 50,
                  marginStart: 5,
                  borderWidth: 1,
                  borderColor: Colors.dark,
                }}
              />
              <View
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    fontWeight: 400,
                    // fontSize: 12,
                  }}
                >
                  {fullName}
                </Text>
                <Text
                  style={{
                    fontWeight: 300,
                    // fontSize: 11,
                  }}
                >
                  {role}
                </Text>
              </View>
            </View>

            <Image
              source={require("../../assets/icons/icons8-right-arrow-50.png")}
              style={{
                width: 15,
                height: 15,
                resizeMode: "cover",
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Settings</Text>

          <SettingsBar
            icon={require("../../assets/icons/icons8-lock-24.png")}
            text="App lock"
            onPress={() => handleAppLockPress()}
          />

          <SettingsBar
            icon={require("../../assets/icons/ic_notification.png")}
            text="Notfications"
          />

          <SettingsBar
            icon={require("../../assets/icons/ic_notification.png")}
            text="Privacy"
          />

          <SettingsBar
            icon={require("../../assets/icons/ic_notification.png")}
            text="Contact us"
          />

          <SettingsBar
            icon={require("../../assets/icons/icons8-logout-30.png")}
            text="Log out"
            onPress={logOut}
          />
        </View>
      </View>

      <View
        style={{
          alignSelf: "center",
          position: "absolute",
          bottom: 10,
        }}
      >
        <Text style={{ alignSelf: "center", fontSize: 12 }}>
          v {Constants.expoConfig.version}
        </Text>
      </View>

      <DisplayMessage
        showModal={showMoodal}
        message={message}
        onAgree={() => navigation.navigate("locksetup")}
        agreeText={agreeText}
        setShowModal={setShowModal}
        canCancel={canCancel}
      />
    </SafeAreaView>
  );
};

export default Settings;

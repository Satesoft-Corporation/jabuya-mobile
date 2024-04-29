import { View, Text, Image } from "react-native";
import React, { useContext, useState } from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import { SafeAreaView } from "react-native";
import Colors from "../../constants/Colors";
import SettingsBar from "./SettingsBar";
import Constants from "expo-constants";
import { UserContext } from "../../context/UserContext";
import DisplayMessage from "../../components/Dialogs/DisplayMessage";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { LOCK_SETuP } from "../../navigation/ScreenNames";
import { BaseStyle } from "../../utils/BaseStyle";
import { Switch } from "react-native-paper";

const Settings = ({ navigation }) => {
  const {
    hasUserSetPinCode,
    sessionObj,
    logInWithPin,
    setLoginWithPin,
    getAppLockStatus,
  } = useContext(UserContext);

  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);

  const onToggleSwitch = async () => {
    setLoginWithPin(!logInWithPin);

    if (hasUserSetPinCode === false) {
      navigation.navigate(LOCK_SETuP);
    } else {
      await UserSessionUtils.removeUserPinCode();
      await getAppLockStatus();
    }
  };
  const { role, fullName } = sessionObj;

  const logOut = () => {
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
  };
  const handleLogout = () => {
    setMessage("Are you sure you want to log out?");
    setAgreeText("Yes");
    setCanCancel(true);
    setShowModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />

      <TopHeader title="Settings" showShopName={false} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.dark,
          paddingVertical: 10,
        }}
      >
        <Image
          source={require("../../assets/images/man_placeholder.jpg")}
          style={{
            width: 45,
            height: 45,
            resizeMode: "cover",
            borderRadius: 10,
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
              color: Colors.primary,
            }}
          >
            {fullName}
          </Text>
          <Text
            style={{
              fontWeight: 300,
              color: Colors.primary,
            }}
          >
            {role}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Personal</Text>
          <View style={BaseStyle.container}>
            <SettingsBar
              icon={require("../../assets/icons/icons8-font-size-60.png")}
              text="Text font size"
            />

            <SettingsBar
              icon={require("../../assets/icons/ic_notification.png")}
              text="Notfications"
            />

            <SettingsBar
              icon={require("../../assets/icons/icons8-magnetic-card-50.png")}
              text="Subscriptions"
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Security and Mangement</Text>
          <View style={BaseStyle.container}>
            {/* <SettingsBar
              icon={require("../../assets/icons/icons8-shield-50.png")}
              text="Password"
            /> */}

            <SettingsBar
              icon={require("../../assets/icons/icons8-shield-50.png")}
              text="Pin Lock"
              renderRight={() => (
                <Switch
                  style={{ height: 20 }}
                  value={logInWithPin}
                  onValueChange={onToggleSwitch}
                  color="#000"
                />
              )}
            />

            <SettingsBar
              icon={require("../../assets/icons/icons8-shield-50.png")}
              text="Help center"
            />
            <SettingsBar
              icon={require("../../assets/icons/icons8-shield-50.png")}
              text="Terms and privacy"
            />
          </View>
        </View>

        <SettingsBar
          onPress={handleLogout}
          icon={require("../../assets/icons/icons8-logout-48.png")}
          text="Logout"
          tintColor={Colors.primary}
          textColor={Colors.primary}
          textStyle={{ fontSize: 17 }}
          style={[
            BaseStyle.container,
            {
              backgroundColor: Colors.dark,
              paddingVertical: 7,
              borderRadius: 8,
            },
          ]}
        />
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
        onAgree={logOut}
        agreeText={agreeText}
        setShowModal={setShowModal}
        canCancel={canCancel}
      />
    </SafeAreaView>
  );
};

export default Settings;

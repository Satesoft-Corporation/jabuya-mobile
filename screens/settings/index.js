import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import Constants from "expo-constants";
import { Switch } from "react-native-paper";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import Colors from "@constants/Colors";
import SettingsBar from "./SettingsBar";
import { BaseStyle } from "@utils/BaseStyle";
import DisplayMessage from "@components/Dialogs/DisplayMessage";
import { LOCK_SETuP, OFFLINE_SALES } from "@navigation/ScreenNames";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/Icon";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, getUserPinCode, getUserType } from "reducers/selectors";
import {
  logOutAction,
  setApplockTime,
  setUserPinCode,
} from "actions/userActions";

const Settings = () => {
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState(null);
  const [canCancel, setCanCancel] = useState(false);
  const [pendingSales, setPendingSales] = useState(0);

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userPincode = useSelector(getUserPinCode);
  const sessionObj = useSelector(getUserData);
  const userType = useSelector(getUserType);

  const onToggleSwitch = async () => {
    if (userPincode === null) {
      navigation.navigate(LOCK_SETuP);
    } else {
      dispatch(setUserPinCode(null));
      dispatch(setApplockTime(null));
    }
  };

  const logOut = async () => {
    if (pendingSales > 0) {
      navigation.navigate(OFFLINE_SALES);
    } else {
      dispatch(logOutAction());
      await UserSessionUtils.clearLocalStorageAndLogout(navigation);
    }
  };

  const checkForUnsavedSales = async () => {
    const data = await UserSessionUtils.getPendingSales();
    setPendingSales(data?.length);
  };

  const handleLogout = async () => {
    if (pendingSales === 0) {
      setMessage("Are you sure you want to log out?");
      setAgreeText("Log out");
      setCanCancel(true);
      setShowModal(true);
    } else {
      setAgreeText("View sales");
      setMessage(
        `Cannot logout, you have ${pendingSales} unsaved sale (s) on your device, please connect to the internet to save them.`
      );
      setCanCancel(false);
      setShowModal(true);
      return;
    }
  };

  useEffect(() => {
    checkForUnsavedSales();
  }, [showMoodal]);

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
            {sessionObj?.fullName}
          </Text>
          <Text
            style={{
              fontWeight: 300,
              color: Colors.primary,
            }}
          >
            {userType}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Personal</Text>

          <View style={BaseStyle.container}>
            <SettingsBar
              icon={<Icon name="wifi-off" groupName="Feather" size={19} />}
              text="Offline sales"
              onPress={() => navigation.navigate(OFFLINE_SALES)}
            />

            <SettingsBar
              icon={<Icon name={"bell"} groupName="FontAwesome" size={20} />}
              text="Notfications"
            />

            <SettingsBar
              icon={
                <Icon name={"credit-card"} groupName="FontAwesome" size={20} />
              }
              text="Subscriptions"
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Security and Mangement</Text>
          <View style={BaseStyle.container}>
            <SettingsBar
              icon={<Icon name={"user-lock"} size={20} />}
              text="Pin Lock"
              renderRight={() => (
                <Switch
                  style={{ height: 20 }}
                  value={userPincode !== null}
                  onValueChange={onToggleSwitch}
                  color="#000"
                />
              )}
            />

            <SettingsBar
              icon={<Icon name={"help-circle"} groupName="Feather" size={20} />}
              text="Help center"
            />
            <SettingsBar
              icon={
                <Icon
                  name={"privacy-tip"}
                  groupName="MaterialIcons"
                  size={20}
                />
              }
              text="Terms and privacy"
            />
          </View>
        </View>

        <SettingsBar
          onPress={handleLogout}
          icon={
            <Icon
              name={"logout"}
              groupName="AntDesign"
              size={20}
              color={Colors.primary}
            />
          }
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

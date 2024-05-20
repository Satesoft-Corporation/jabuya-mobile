import { View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { FlatList } from "react-native";
import UserProfile from "../../components/UserProfile";
import { BlackScreen } from "../../components/BlackAndWhiteScreen";
import AppStatusBar from "../../components/AppStatusBar";
import { MenuIcon } from "../../components/MenuIcon";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { getTimeDifference } from "../../utils/Utils";
import DisplayMessage from "../../components/Dialogs/DisplayMessage";
import Loader from "../../components/Loader";
import { StackActions } from "@react-navigation/native";
import { navList } from "./navList";
import { LOCK_SCREEN, STOCK_ENTRY } from "../../navigation/ScreenNames";
import { resolveUnsavedSales } from "../../controllers/OfflineControllers";

import { userData } from "../../context/UserContext";

const LandingScreen = ({ navigation }) => {
  const {
    getShopsFromStorage,
    userParams,
    configureUserData,
    getRefreshToken,
    shops,
  } = userData();

  const [loading, setLoading] = useState(true);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [timeDiff, setTimeDiff] = useState(null);

  const logOut = () => {
    setLoading(false);
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
  };

  const logInPrompt = () => {
    setMessage("Your session has expired, please login to continue.");
    setAgreeText("Login");
    setCanCancel(false);
    setShowModal(true);
  };

  const handleTabPress = (item) => {
    const { days } = timeDiff;
    if (days >= 7) {
      //trigger the logout dialog every after some time
      logInPrompt();
      return null;
    }

    if (item.target) {
      if (item.target === "stocking" && userParams?.isShopAttendant === true) {
        navigation.navigate(STOCK_ENTRY);
        return null;
      } else {
        navigation.navigate(item.target);
        return null;
      }
    }
  };

  const handlePinLockStatus = async () => {
    let prevPinTime = await UserSessionUtils.getPinLoginTime(); //time when app lock was last used

    if (prevPinTime !== null) {
      let pintimeDiff = getTimeDifference(prevPinTime, new Date());

      if (pintimeDiff.minutes >= 10) {
        navigation.dispatch(StackActions.replace(LOCK_SCREEN));
        return;
      }
    }
  };

  const handleLoginSession = async () => {
    let prevLoginTime = await UserSessionUtils.getLoginTime();

    const logintimeDifferance = getTimeDifference(prevLoginTime, new Date());
    const { days, hours } = logintimeDifferance;

    setTimeDiff(logintimeDifferance);
    console.log(logintimeDifferance);

    if (hours < 24) {
      //to save if access token is still valid
      await resolveUnsavedSales();
    }
    if (hours >= 6 || days >= 1) {
      await getRefreshToken();
    }
  };

  const start = async () => {
    const isUserConfigured = await configureUserData(); //configuring up the user

    if (isUserConfigured === true) {
      handlePinLockStatus();
      handleLoginSession();
      await getShopsFromStorage();
      setLoading(false);
    } else {
      logOut();
      return true;
    }
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />
      <Loader loading={loading} />
      <BlackScreen>
        <UserProfile
          renderMenu={shops?.length > 1}
          renderNtnIcon={false}
          showShops
        />
      </BlackScreen>

      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <FlatList
          style={{ marginTop: 10 }}
          data={navList}
          renderItem={({ item }) => (
            <MenuIcon icon={item} onPress={() => handleTabPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
        />
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

export default LandingScreen;

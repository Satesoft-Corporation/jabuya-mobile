import { View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { userData } from "../../context/UserContext";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { getTimeDifference } from "@utils/Utils";
import { BlackScreen } from "@components/BlackAndWhiteScreen";
import AppStatusBar from "@components/AppStatusBar";
import Loader from "@components/Loader";

import UserProfile from "@components/UserProfile";
import { MenuIcon } from "@components/MenuIcon";
import DisplayMessage from "@components/Dialogs/DisplayMessage";
import Colors from "@constants/Colors";
import { resolveUnsavedSales } from "@controllers/OfflineControllers";
import { navList } from "./navList";
import { COMING_SOON, LOCK_SCREEN } from "@navigation/ScreenNames";

const LandingScreen = () => {
  const { getShopsFromStorage, configureUserData, getRefreshToken, shops } =
    userData();

  const [loading, setLoading] = useState(true);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [timeDiff, setTimeDiff] = useState(null);

  const navigation = useNavigation();
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
    if (days >= 14) {
      //trigger the logout dialog every after some time
      logInPrompt();
      return null;
    }

    if (item.target) {
      navigation.navigate(item.target);
      return;
    }
    if (!item.target) {
      navigation.navigate(COMING_SOON, item?.title);
      return;
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

  const handleUsageTime = async () => {
    const prevUsageIime = await UserSessionUtils.getLastOpenTime();
    const usageTimeDifferance = getTimeDifference(prevUsageIime, new Date());
    const { days, hours, minutes } = usageTimeDifferance;

    const interval = days > 0 && hours > 0 && hours % 3 === 0 && minutes > 50; //every after some 3 hours
    if (interval === true) {
      console.log("refreshing local data");
      await configureUserData(true);
    }
  };

  const handleLoginSession = async () => {
    await configureUserData(false); //configuring up the usercontext

    const prevLoginTime = await UserSessionUtils.getLoginTime();

    const logintimeDifferance = getTimeDifference(prevLoginTime, new Date());

    const { days, hours } = logintimeDifferance;

    setTimeDiff(logintimeDifferance);

    await handlePinLockStatus();
    await getShopsFromStorage();
    await handleUsageTime();

    if (hours < 24) {
      //to save if access token is still valid
      await resolveUnsavedSales();
    }

    if (hours >= 20 || days >= 1) {
      await getRefreshToken();
    }
    console.log("login time", logintimeDifferance);
    setLoading(false);
  };

  const startTheApp = async () => {
    await UserSessionUtils.getUserDetails().then(async (data) => {
      if (data) {
        await UserSessionUtils.setLastOpenTime(String(new Date()));
        await handleLoginSession();
      } else {
        logOut();
        return true;
      }
    });
  };

  useEffect(() => {
    startTheApp();
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
          keyExtractor={(item) => item.title.toString()}
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

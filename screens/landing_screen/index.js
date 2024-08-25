import { View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { userData } from "../../context/UserContext";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { getTimeDifference } from "@utils/Utils";
import Loader from "@components/Loader";
import UserProfile from "@components/UserProfile";
import { MenuIcon } from "@components/MenuIcon";
import Colors from "@constants/Colors";
import { navList } from "./navList";
import { COMING_SOON } from "@navigation/ScreenNames";
import LockScreenModal from "@screens/applock/LockScreenModal";
import { getRefreshToken } from "@controllers/OfflineControllers";

const LandingScreen = () => {
  const { getShopsFromStorage, configureUserData, shops } = userData();

  const [loading, setLoading] = useState(true);
  const [showLock, setShowLock] = useState(false);

  const navigation = useNavigation();

  const logOut = async () => {
    setLoading(false);
    await UserSessionUtils.clearLocalStorageAndLogout(navigation);
  };

  const handleTabPress = (item) => {
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
        setShowLock(true);
      }
    }
  };

  const handleLoginSession = async () => {
    await configureUserData(false); //configuring up the usercontext

    const prevLoginTime = await UserSessionUtils.getLoginTime();

    const logintimeDifferance = getTimeDifference(prevLoginTime, new Date());

    const { days, hours } = logintimeDifferance;

    await handlePinLockStatus();
    await getShopsFromStorage();

    if (hours >= 10 || days >= 1) {
      await getRefreshToken();
    }
    console.log("login time", logintimeDifferance);
    setLoading(false);
  };

  const startTheApp = async () => {
    await UserSessionUtils.getUserDetails()
      .then(async (data) => {
        if (data) {
          await UserSessionUtils.setLastOpenTime(String(new Date()));
          await handleLoginSession();
        } else {
          logOut();
          return true;
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    startTheApp();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <Loader loading={loading} />
      <UserProfile
        renderMenu={shops?.length > 1}
        renderNtnIcon={false}
        showShops
      />

      <LockScreenModal
        showLock={showLock}
        hideLock={() => setShowLock(false)}
      />
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
    </SafeAreaView>
  );
};

export default LandingScreen;

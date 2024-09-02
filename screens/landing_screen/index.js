import { View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { getTimeDifference } from "@utils/Utils";
import Loader from "@components/Loader";
import UserProfile from "@components/UserProfile";
import { MenuIcon } from "@components/MenuIcon";
import Colors from "@constants/Colors";
import { navList } from "./navList";
import { COMING_SOON } from "@navigation/ScreenNames";
import LockScreenModal from "@screens/applock/LockScreenModal";
import {
  saveShopDetails,
  saveShopProductsOnDevice,
} from "@controllers/OfflineControllers";
import { useSelector } from "react-redux";
import {
  getConfigureStatus,
  getLastApplockTime,
  getLastLoginTime,
  getOfflineParams,
} from "reducers/selectors";
import { useDispatch } from "react-redux";
import {
  changeUser,
  loginAction,
  setIsUserConfigured,
} from "actions/userActions";
import { useNetInfo } from "@react-native-community/netinfo";
import { BaseApiService } from "@utils/BaseApiService";
import { setShopProducts, setShops } from "actions/shopActions";

const LandingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [showLock, setShowLock] = useState(false);

  const navigation = useNavigation();

  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  const offlineParams = useSelector(getOfflineParams);
  const prevLoginTime = useSelector(getLastLoginTime);
  const configStatus = useSelector(getConfigureStatus);
  const prevPinTime = useSelector(getLastApplockTime);

  const getRefreshToken = async () => {
    const loginInfo = await UserSessionUtils.getLoginDetails();
    if (loginInfo) {
      await new BaseApiService(LOGIN_END_POINT)
        .saveRequestWithJsonResponse(loginInfo, false)
        .then(async (response) => {
          await UserSessionUtils.setUserAuthToken(response.accessToken);
          await UserSessionUtils.setUserRefreshToken(response.refreshToken);
          dispatch(loginAction(true));
          dispatch(changeUser(response.user));
          console.log("token refreshed");
        });
    }
  };

  const configureUserData = async (refresh = false) => {
    if (refresh === true) {
      const shops = await saveShopDetails(offlineParams, refresh);
      const products = await saveShopProductsOnDevice(offlineParams, refresh);

      dispatch(setShops(shops));

      dispatch(setShopProducts(products));

      dispatch(setIsUserConfigured(true));
    }
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
    if (prevPinTime !== null) {
      const pintimeDiff = getTimeDifference(prevPinTime, new Date());
      if (pintimeDiff.minutes >= 10) {
        setShowLock(true);
      }
    }
  };

  const handleLoginSession = async () => {
    await handlePinLockStatus();
    setLoading(true);

    if (prevLoginTime !== null) {
      const logintimeDifferance = getTimeDifference(
        new Date(prevLoginTime),
        new Date()
      );

      const { days, hours } = logintimeDifferance;

      console.log("login time", logintimeDifferance);

      // if (netInfo.isInternetReachable === true) {

      await configureUserData(configStatus === false);

      if (hours >= 13 || days >= 1) {
        await getRefreshToken();
        await configureUserData(true);
      }
    }
    // }
    setLoading(false);
  };

  useEffect(() => {
    handleLoginSession();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <Loader loading={loading} />
      <UserProfile renderNtnIcon={false} showShops />

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

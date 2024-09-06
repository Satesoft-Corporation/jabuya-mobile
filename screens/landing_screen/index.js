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
import { COMING_SOON, CONTACT_BOOK, ENTRIES } from "@navigation/ScreenNames";
import LockScreenModal from "@screens/applock/LockScreenModal";
import {
  saveClientSalesOnDevice,
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
} from "@controllers/OfflineControllers";
import { useSelector } from "react-redux";
import {
  getAttendantShopId,
  getAttendantShopName,
  getConfigureStatus,
  getLastApplockTime,
  getLastLoginTime,
  getOfflineParams,
  getShopOwnerId,
  getUserData,
  getUserType,
} from "reducers/selectors";
import { useDispatch } from "react-redux";
import {
  changeUser,
  loginAction,
  setIsUserConfigured,
} from "actions/userActions";
import { useNetInfo } from "@react-native-community/netinfo";
import { BaseApiService } from "@utils/BaseApiService";
import {
  changeSelectedShop,
  setClientSales,
  setCollectClintInfo,
  setOffersDebt,
  setShopClients,
  setShopProducts,
  setShops,
} from "actions/shopActions";
import { LOGIN_END_POINT } from "@utils/EndPointUtils";
import { ALL_SHOPS_LABEL, userTypes } from "@constants/Constants";

const LandingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showLock, setShowLock] = useState(false);

  const [menu, setMenu] = useState([]);

  const navigation = useNavigation();

  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  const offlineParams = useSelector(getOfflineParams);
  const prevLoginTime = useSelector(getLastLoginTime);
  const configStatus = useSelector(getConfigureStatus);
  const prevPinTime = useSelector(getLastApplockTime);
  const userType = useSelector(getUserType);
  const shopOwnerId = useSelector(getShopOwnerId);

  const isShopAttendant = userType === userTypes.isShopAttendant;
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
      setLoading(true);
      let shops = [];
      let menuList = [...navList];
      const shopData = await saveShopDetails(offlineParams, isShopAttendant);

      const offersDebt = shopData?.some((s) => s?.supportsCreditSales === true);

      const collectClientInfo = shopData?.some(
        (s) => s?.captureClientDetailsOnAllSales === true
      );

      if (shopData?.length > 1) {
        shops = [{ name: ALL_SHOPS_LABEL, id: shopOwnerId }, ...shopData];
      } else {
        shops = [...shopData];
      }

      dispatch(changeSelectedShop(shops[0]));
      dispatch(setShops(shops));
      dispatch(setOffersDebt(offersDebt));
      dispatch(setCollectClintInfo(collectClientInfo));

      if (offersDebt === true) {
        const clients = await saveShopClients(offlineParams);
        const clientSales = await saveClientSalesOnDevice(offlineParams);
        menuList = [...navList];
        dispatch(setShopClients(clients));
        dispatch(setClientSales(clientSales));
      }

      if (offersDebt === false) {
        menuList = menuList.filter((i) => i.target !== CONTACT_BOOK);
      }

      if (isShopAttendant) {
        menuList = menuList.filter((i) => i.target !== ENTRIES);
      }

      if (userType !== userTypes.isSuperAdmin) {
        const products = await saveShopProductsOnDevice(offlineParams);
        dispatch(setShopProducts(products));
      }

      setMenu(menuList);
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
      const pintimeDiff = getTimeDifference(new Date(prevPinTime), new Date());
      console.log("lock time", pintimeDiff);
      if (pintimeDiff.minutes >= 10) {
        setShowLock(true);
      }
    }
  };

  const handleLoginSession = async () => {
    try {
      await handlePinLockStatus();

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
          setLoading(true);
          await getRefreshToken();
          await configureUserData(true);
        }
      }
      // }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
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
          data={menu}
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

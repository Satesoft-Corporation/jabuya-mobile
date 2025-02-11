import { View, SafeAreaView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { getTimeDifference } from "@utils/Utils";
import Loader from "@components/Loader";
import UserProfile from "@components/UserProfile";
import { MenuIcon } from "@components/MenuIcon";
import Colors from "@constants/Colors";
import LockScreenModal from "@screens/applock/LockScreenModal";
import {
  saveLookUps,
  saveManufactures,
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
  saveSuppliers,
} from "@controllers/OfflineControllers";
import { useSelector } from "react-redux";
import {
  getConfigureStatus,
  getIsAdmin,
  getIsShopAttendant,
  getLastApplockTime,
  getLastLoginTime,
  getLookUps,
  getManufactures,
  getOffersDebt,
  getOfflineParams,
  getOfflineSales,
  getShopOwnerId,
  getSuppliers,
  getUsersList,
} from "duqactStore/selectors";
import { useDispatch } from "react-redux";
import { addLookUps, setIsUserConfigured, tokenRefresh } from "actions/userActions";
import { BaseApiService } from "@utils/BaseApiService";
import { addManufacturers, addSuppliers, changeSelectedShop, setShops } from "actions/shopActions";
import { LOGIN_END_POINT } from "@utils/EndPointUtils";
import { ALL_SHOPS_LABEL } from "@constants/Constants";
import { hasInternetConnection } from "@utils/NetWork";
import {
  CONTACT_BOOK,
  CREDIT_SALES,
  ENTRIES,
  EXPENSES,
  LEADS,
  OFFLINE_SALES,
  SALES_DESK,
  SALES_REPORTS,
  STOCK_ENTRY,
  STOCK_LEVELS,
} from "@navigation/ScreenNames";
import { getCanViewSales } from "duqactStore/selectors/permissionSelectors";

const LandingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showLock, setShowLock] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const offlineParams = useSelector(getOfflineParams);
  const prevLoginTime = useSelector(getLastLoginTime);
  const configStatus = useSelector(getConfigureStatus);
  const prevPinTime = useSelector(getLastApplockTime);
  const userList = useSelector(getUsersList);
  const shopOwnerId = useSelector(getShopOwnerId);
  const manufacturers = useSelector(getManufactures);
  const suppliers = useSelector(getSuppliers);
  const prevLookUps = useSelector(getLookUps);
  const isAdmin = useSelector(getIsAdmin);
  const canViewSales = useSelector(getCanViewSales);

  const offersDebt = useSelector(getOffersDebt);
  const isShopAttendant = useSelector(getIsShopAttendant);

  const pendingSales = useSelector(getOfflineSales);

  const navList = [
    // landing screen icons
    { icon: require("assets/icons/icons8-cash-register-50.png"), title: "Sales Desk", target: SALES_DESK },
    ...(canViewSales ? [{ icon: require("assets/icons/5499402.png"), title: "Daily sales", target: SALES_REPORTS }] : []),
    ...(offersDebt ? [{ icon: require("assets/icons/icons8-cash-50.png"), title: "Debts", target: CREDIT_SALES }] : []),
    ...(pendingSales?.length > 0 ? [{ icon: require("assets/icons/icons8-offline-48.png"), title: "Offline sales", target: OFFLINE_SALES }] : []),

    { icon: require("assets/icons/stock_purc.jpg"), title: "Stock purchases", target: STOCK_ENTRY },
    { icon: require("assets/icons/icons8-box-501.png"), title: "Stock levels", target: STOCK_LEVELS },
    { icon: require("assets/icons/income.png"), title: "Expenses", target: EXPENSES },

    { icon: require("assets/icons/entries.png"), title: "Entries", target: ENTRIES },
    { icon: require("assets/icons/icons8-contact-book-64.png"), title: "Contacts", target: CONTACT_BOOK },
    ...(isAdmin ? [{ icon: require("assets/icons/group-solid-24.png"), title: "Leads", target: LEADS }] : []),
  ];

  const getRefreshToken = async () => {
    const loginInfo = await UserSessionUtils.getLoginDetails();
    if (loginInfo) {
      setLoading(true);
      await new BaseApiService(LOGIN_END_POINT)
        .saveRequestWithJsonResponse(loginInfo, false)
        .then(async (response) => {
          await UserSessionUtils.setUserAuthToken(response.accessToken);
          await UserSessionUtils.setUserRefreshToken(response.refreshToken);
          dispatch(tokenRefresh(response.user));
          setLoading(false);
          console.log("token refreshed");
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };

  const configureUserData = async (refresh = false) => {
    if (refresh === true) {
      let shops = [];

      const shopData = await saveShopDetails(offlineParams, isShopAttendant);

      const offersDebt = shopData?.some((s) => s?.supportsCreditSales === true);

      if (shopData?.length > 1) {
        shops = [{ name: ALL_SHOPS_LABEL, id: shopOwnerId, supportsCreditSales: offersDebt, captureClientDetailsOnAllSales: false }, ...shopData];
      } else {
        shops = [...shopData];
      }

      dispatch(changeSelectedShop(shops[0]));
      dispatch(setShops(shops));

      if (isAdmin == false) {
        await saveShopProductsOnDevice(offlineParams);
        if (offersDebt === true) {
          await saveShopClients(offlineParams);
        }
      }

      if (userList?.length == 0) {
        const newManufactures = await saveManufactures(manufacturers);

        const newSuppliers = await saveSuppliers(suppliers);

        const lookups = await saveLookUps(prevLookUps);

        dispatch(addManufacturers(newManufactures));
        dispatch(addSuppliers(newSuppliers));
        dispatch(addLookUps(lookups));
      }

      dispatch(setIsUserConfigured(true));
    }
  };

  const handlePinLockStatus = async () => {
    if (prevPinTime !== null) {
      const pintimeDiff = getTimeDifference(new Date(prevPinTime), new Date());
      console.log("lock time", pintimeDiff);
      if (pintimeDiff.minutes >= 30) {
        setShowLock(true);
      }
    }
  };

  const handleLoginSession = async () => {
    try {
      const hasNet = await hasInternetConnection();

      if (prevLoginTime !== null) {
        const logintimeDifferance = getTimeDifference(new Date(prevLoginTime), new Date());

        const { days, hours } = logintimeDifferance;

        console.log("login time", logintimeDifferance);

        //if (hasNet === true) {
        await configureUserData(configStatus === false);

        if (hours >= 20 || days >= 1) {
          await getRefreshToken();
        }
        //}
        await handlePinLockStatus();
      }
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
      <UserProfile home />

      <LockScreenModal showLock={showLock} hideLock={() => setShowLock(false)} />
      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={navList}
          renderItem={({ item }) => <MenuIcon icon={item} onPress={() => navigation.navigate(item?.target)} />}
          keyExtractor={(item) => item.title.toString()}
          numColumns={3}
        />
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

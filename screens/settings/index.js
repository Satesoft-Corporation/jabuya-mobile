import { View, Text, Image } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { Switch } from "react-native-paper";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import TopHeader from "@components/TopHeader";
import Colors from "@constants/Colors";
import SettingsBar from "./SettingsBar";
import { BaseStyle } from "@utils/BaseStyle";
import DisplayMessage from "@components/Dialogs/DisplayMessage";
import { LOCK_SETuP, OFFLINE_SALES } from "@navigation/ScreenNames";
import { useNavigation } from "@react-navigation/native";
import Icon from "@components/Icon";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientSales,
  getLookUps,
  getManufactures,
  getOfflineParams,
  getOfflineSales,
  getShopClients,
  getShopOwnerId,
  getShopProducts,
  getSuppliers,
  getUserData,
  getUserPinCode,
  getUserType,
} from "duqactStore/selectors";
import { addLookUps, logOutAction, setApplockTime, setUserPinCode } from "actions/userActions";
import { ALL_SHOPS_LABEL, APP_VERSION, userTypes } from "@constants/Constants";
import {
  saveClientSalesOnDevice,
  saveManufactures,
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
  saveSuppliers,
} from "@controllers/OfflineControllers";
import { addManufacturers, addSuppliers, changeSelectedShop, setClientSales, setShopClients, setShopProducts, setShops } from "actions/shopActions";
import Loader from "@components/Loader";
import { hasInternetConnection } from "@utils/NetWork";
import Snackbar from "@components/Snackbar";
import SubscriptionsAlert from "@components/SubscriptionsAlert";

const Settings = () => {
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState(null);
  const [canCancel, setCanCancel] = useState(false);
  const [showSubAlert, setShowSubAlert] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();
  const userPincode = useSelector(getUserPinCode);
  const sessionObj = useSelector(getUserData);
  const userType = useSelector(getUserType);
  const pendingSales = useSelector(getOfflineSales);

  const [loading, setLoading] = useState(false);
  const offlineParams = useSelector(getOfflineParams);
  const shopOwnerId = useSelector(getShopOwnerId);
  const prevProducts = useSelector(getShopProducts);
  const prevClients = useSelector(getShopClients);
  const prevClientSales = useSelector(getClientSales);
  const manufacturers = useSelector(getManufactures);
  const suppliers = useSelector(getSuppliers);
  const prevLookUps = useSelector(getLookUps);

  const snackbarRef = useRef(null);

  const isShopAttendant = userType === userTypes.isShopAttendant;

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

  const handleLogout = async () => {
    if (pendingSales?.length === 0) {
      setMessage("Are you sure you want to log out?");
      setAgreeText("Log out");
      setCanCancel(true);
      setShowModal(true);
    } else {
      setAgreeText("View sales");
      setMessage(`Cannot logout, you have ${pendingSales?.length} unsaved sale(s) on your device, please connect to the internet to save them.`);
      setCanCancel(false);
      setShowModal(true);
      return;
    }
  };

  const configureUserData = async () => {
    try {
      const hasNet = await hasInternetConnection();

      if (hasNet === false) {
        snackbarRef.current.show("Cannot connect to the internet.", 5000);
        return;
      } else {
        setLoading(true);
        let shops = [];

        const shopData = await saveShopDetails(offlineParams, isShopAttendant);

        const lookups = await saveLookUps(prevLookUps);

        const offersDebt = shopData?.some((s) => s?.supportsCreditSales === true);

        if (shopData?.length > 1) {
          shops = [{ name: ALL_SHOPS_LABEL, id: shopOwnerId, supportsCreditSales: offersDebt, captureClientDetailsOnAllSales: false }, ...shopData];
        } else {
          shops = [...shopData];
        }

        dispatch(changeSelectedShop(shops[0]));
        dispatch(setShops(shops));

        const newManufactures = await saveManufactures(manufacturers);

        const newSuppliers = await saveSuppliers(suppliers);

        dispatch(addManufacturers(newManufactures));
        dispatch(addSuppliers(newSuppliers));
        dispatch(addLookUps(lookups));

        if (userType !== userTypes.isSuperAdmin) {
          const products = await saveShopProductsOnDevice(offlineParams, prevProducts);
          dispatch(setShopProducts(products));
          if (offersDebt === true) {
            const clients = await saveShopClients(offlineParams, prevClients);
            const clientSales = await saveClientSalesOnDevice(offlineParams, prevClientSales);
            dispatch(setShopClients(clients));
            dispatch(setClientSales(clientSales));
          }
        }
      }
    } catch (e) {
      snackbarRef.current.show(e, 5000);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={loading} message="Please wait..." />
      <Snackbar ref={snackbarRef} />

      <SubscriptionsAlert showModal={showSubAlert} setShowModal={setShowSubAlert} />

      <TopHeader title="Settings" showShopName={false} />

      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: Colors.dark, paddingVertical: 10 }}>
        <Image
          source={require("assets/images/man_placeholder.jpg")}
          style={{ width: 45, height: 45, resizeMode: "cover", borderRadius: 10, marginStart: 5, borderWidth: 1, borderColor: Colors.dark }}
        />
        <View style={{ marginHorizontal: 5 }}>
          <Text style={{ fontWeight: 400, color: Colors.primary }}>{sessionObj?.fullName}</Text>
          <Text style={{ fontWeight: 300, color: Colors.primary }}>{userType}</Text>
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
              icon={<Icon name={"cloud-sync-outline"} groupName="MaterialCommunityIcons" size={20} />}
              onPress={() => configureUserData(true)}
              text="Sync data"
            />

            <SettingsBar
              icon={<Icon name={"credit-card"} groupName="FontAwesome" size={20} />}
              onPress={() => setShowSubAlert(true)}
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
              renderRight={() => <Switch style={{ height: 20 }} value={userPincode !== null} onValueChange={onToggleSwitch} color="#000" />}
            />

            <SettingsBar icon={<Icon name={"help-circle"} groupName="Feather" size={20} />} text="Help center" />
            <SettingsBar icon={<Icon name={"privacy-tip"} groupName="MaterialIcons" size={20} />} text="Terms and privacy" />
          </View>
        </View>

        <SettingsBar
          onPress={handleLogout}
          icon={<Icon name={"logout"} groupName="AntDesign" size={20} color={Colors.primary} />}
          text="Logout"
          tintColor={Colors.primary}
          textColor={Colors.primary}
          textStyle={{ fontSize: 17 }}
          style={[BaseStyle.container, { backgroundColor: Colors.dark, paddingVertical: 7, paddingHorizontal: 7, borderRadius: 8 }]}
        />
      </View>

      <View style={{ alignSelf: "center", position: "absolute", bottom: 10 }}>
        <Text style={{ alignSelf: "center", fontSize: 12 }}>{APP_VERSION} </Text>
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

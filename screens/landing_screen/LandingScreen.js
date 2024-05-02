import { View, SafeAreaView, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { FlatList } from "react-native";
import UserProfile from "../../components/UserProfile";
import { BlackScreen } from "../../components/BlackAndWhiteScreen";
import AppStatusBar from "../../components/AppStatusBar";
import SelectShopBar from "../../components/SelectShopBar";
import { MenuIcon } from "../../components/MenuIcon";
import { UserContext } from "../../context/UserContext";
import { BaseApiService } from "../../utils/BaseApiService";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import { getTimeDifference } from "../../utils/Utils";
import DisplayMessage from "../../components/Dialogs/DisplayMessage";
import Loader from "../../components/Loader";
import { StackActions } from "@react-navigation/native";
import { navList } from "./navList";
import { LOCK_SCREEN, STOCK_ENTRY } from "../../navigation/ScreenNames";
import {
  resolveUnsavedSales,
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
} from "../../controllers/OfflineControllers";
const LandingScreen = ({ navigation }) => {
  const {
    setUserParams,
    getShopsFromStorage,
    userParams,
    setSelectedShop,
    setShops,
    getRefreshToken,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [timeDiff, setTimeDiff] = useState(null);

  const logOut = () => {
    setLoading(false);
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
    setUserParams(null);
    setSelectedShop(null);
    setShops([]);
  };

  const logInPrompt = () => {
    setMessage("Your session has expired, please login to continue.");
    setAgreeText("Login");
    setCanCancel(false);
    setShowModal(true);
  };

  const handleTabPress = (item) => {
    const { days } = timeDiff;

    if (days > 5) {
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
    let prevPinTime = await UserSessionUtils.getPinLoginTime();

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

    let logintimeDifferance = getTimeDifference(prevLoginTime, new Date());

    setTimeDiff(logintimeDifferance);

    if (logintimeDifferance.hours < 24) {
      //to save if access token is still valid
      await resolveUnsavedSales();
    }
    if (logintimeDifferance.hours >= 6) {
      await getRefreshToken();
    }
  };

  useEffect(() => {
    UserSessionUtils.getFullSessionObject()
      .then(async (data) => {
        if (data === null) {
          logOut();
          return true;
        }

        handlePinLockStatus();
        handleLoginSession();
        const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
          data?.user;

        setUserParams({
          isShopOwner,
          isShopAttendant,
          attendantShopId,
          shopOwnerId,
        });

        /**
         * saving products ondevice
         */
        const searchParameters = {
          offset: 0,
          limit: 10000,
          ...(isShopAttendant && { shopId: attendantShopId }),
          ...(isShopOwner && { shopOwnerId }),
        };

        const savedproducts = await saveShopProductsOnDevice(searchParameters);
        const savedClients = await saveShopClients(searchParameters);

        let shopCount = await UserSessionUtils.getShopCount();

        if (!isShopAttendant) {
          if (shopCount === null) {
            await saveShopDetails(isShopOwner, shopOwnerId);
            getShopsFromStorage();
          }
        }

        if (savedproducts === true && savedClients === true) {
          setLoading(false);
        } else {
          Alert.alert("Unkown error", "Please re login");
          setLoading(false);
        }
      })
      .catch(async (error) => {
        //loging the user out if the object is missing
        console.log(error);
        logOut();
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />
      <Loader loading={loading} />
      <BlackScreen>
        <UserProfile />

        {!userParams?.isShopAttendant && <SelectShopBar />}
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

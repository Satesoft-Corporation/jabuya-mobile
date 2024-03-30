import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { FlatList } from "react-native";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import AppStatusBar from "../components/AppStatusBar";
import SelectShopBar from "../components/SelectShopBar";
import { Icon } from "../components/Icon";
import { categoryIcons } from "../constants/Constants";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import { getTimeDifference } from "../utils/Utils";
import DisplayMessage from "../components/Dialogs/DisplayMessage";
import Loader from "../components/Loader";
import { CommonActions } from "@react-navigation/native";

const LandingScreen = ({ navigation }) => {
  const {
    setUserParams,
    getShopsFromStorage,
    userParams,
    setSelectedShop,
    setShops,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [timeDiff, setTimeDiff] = useState(null);

  const fetchShops = (id) => {
    new BaseApiService("/shops")
      .getRequestWithJsonResponse({ limit: 0, offset: 0, shopOwnerId: id })
      .then(async (response) => {
        await UserSessionUtils.setShopCount(String(response.totalItems));
        await UserSessionUtils.setShops(response.records);
        getShopsFromStorage();
      })
      .catch((error) => {});
  };

  const logOut = () => {
    setLoading(false);
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
    setUserParams(null);
    setSelectedShop(null);
    setShops([]);
  };

  const confirmLogout = () => {
    setMessage("Are you sure you want to log out?");
    setAgreeText("Yes");
    setCanCancel(true);
    setShowModal(true);
  };

  const logInPrompt = () => {
    setMessage("Your session has expired, please login to continue.");
    setAgreeText("Login");
    setCanCancel(false);
    setShowModal(true);
  };

  const handleTabPress = (item) => {
    const { days, hours } = timeDiff;

    if (hours >= 12 || days > 0) {
      //trigger the logout dialog every after 5 hrs
      logInPrompt();
      return null;
    }

    if (item.target) {
      if (item.target === "stocking" && userParams?.isShopAttendant === true) {
        navigation.navigate("stockEntries");
        return null;
      } else {
        navigation.navigate(item.target);
        return null;
      }
    }
  };

  const resolveUnsavedSales = async () => {
    let pendingSales = await UserSessionUtils.getPendingSales();

    if (pendingSales.length > 0) {
      pendingSales.forEach(async (cart, index) => {
        await new BaseApiService("/shop-sales")
          .postRequest(cart)
          .then(async (response) => {
            let d = { info: await response.json(), status: response.status };
            return d;
          })
          .then(async (d) => {
            let { info, status } = d;
            let id = info?.id;

            if (status === 200) {
              new BaseApiService(`/shop-sales/${id}/confirm`)
                .postRequest()
                .then((d) => d.json())
                .then(async (d) => {
                  await UserSessionUtils.removePendingSale(index);
                })
                .catch((error) => {
                  console.log(error, cart);
                });
            } else {
              // console.log(error, cart);
            }
          })
          .catch((error) => {});
      });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    UserSessionUtils.getFullSessionObject()
      .then(async (data) => {
        if (data === null) {
          logOut();
          return true;
        }

        let prevPinTime = await UserSessionUtils.getPinLoginTime();

        if (prevPinTime !== null) {
          let pintimeDiff = getTimeDifference(prevPinTime, new Date());

          if (pintimeDiff.hours >= 1) {
            const { dispatch } = navigation;

            dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "lockscreen" }],
              })
            );
          }
        }

        const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
          data?.user;

        let prevLoginTime = await UserSessionUtils.getLoginTime();

        let logintimeDifferance = getTimeDifference(prevLoginTime, new Date());

        setUserParams({
          isShopOwner,
          isShopAttendant,
          attendantShopId,
          shopOwnerId,
        });

        setTimeDiff(logintimeDifferance);

        let shopCount = await UserSessionUtils.getShopCount();

        if (isShopOwner) {
          if (shopCount === null) {
            fetchShops(shopOwnerId);
          }
        }
        if (logintimeDifferance.hours < 24) {
          //to save if access token is still valid
          resolveUnsavedSales();
        }
      })
      .catch(async (error) => {
        //loging the user out if the object is missing
        logOut();
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />
      <Loader loading={loading} />
      <BlackScreen>
        <UserProfile />

        {userParams?.isShopOwner && (
          <SelectShopBar onPress={() => navigation.navigate("selectShops")} />
        )}
      </BlackScreen>

      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <FlatList
          style={{ marginTop: 10 }}
          data={categoryIcons}
          renderItem={({ item }) => (
            <Icon icon={item} onPress={() => handleTabPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
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
    </View>
  );
};

export default LandingScreen;

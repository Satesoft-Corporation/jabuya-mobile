import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { FlatList } from "react-native";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import AppStatusBar from "../components/AppStatusBar";
import SelectShop from "../components/SelectShop";
import { Icon } from "../components/Icon";
import { categoryIcons } from "../constants/Constants";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import { getTimeDifference } from "../utils/Utils";

const LandingScreen2 = ({ navigation }) => {
  const { setUserParams, getShopsFromStorage } = useContext(UserContext);
  const [tab, setTab] = useState("home");

  const [loading, setLoading] = useState(true);
  const [routeParams, setRouteParams] = useState(null);
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
      .catch((error) => {
        console.log(error);
      });
  };

  const logOut = () => {
    setLoading(false);
    UserSessionUtils.clearLocalStorageAndLogout(navigation);
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
    console.log(timeDiff);

    if (hours >= 5 || days > 0) {
      //trigger the logout dialog every after 5 hrs
      logInPrompt();
    } else {
      item.target
        ? navigation.navigate(item.target, {
            ...routeParams,
          })
        : null;
    }
  };

  useEffect(() => {
    UserSessionUtils.getFullSessionObject()
      .then(async (data) => {
        if (data === null) {
          logOut();
          return true;
        }
        const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
          data?.user;

        setRouteParams({
          isShopOwner,
          isShopAttendant,
          attendantShopId,
          shopOwnerId,
        });

        setUserParams({
          isShopOwner,
          isShopAttendant,
          attendantShopId,
          shopOwnerId,
        });
        let prevTime = await UserSessionUtils.getLoginTime();
        let timeDifferance = getTimeDifference(prevTime, new Date());
        setTimeDiff(timeDifferance);

        let shopCount = await UserSessionUtils.getShopCount();

        if (isShopOwner) {
          if (shopCount === null) {
            fetchShops(shopOwnerId);
          }
        }
        setLoading(false);
      })
      .catch(async (error) => {
        console.log(error);
        //loging the user out if the object is missing
        logOut();
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <BlackScreen>
        <UserProfile />

        <SelectShop onPress={() => navigation.navigate("selectShops")} />
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
    </View>
  );
};

export default LandingScreen2;

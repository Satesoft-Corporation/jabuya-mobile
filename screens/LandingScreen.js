import { View, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { Icon } from "../components/Icon";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import Loader from "../components/Loader";
import { categoryIcons } from "../constants/Constants";
import { BaseApiService } from "../utils/BaseApiService";
import { getTimeDifference } from "../utils/Utils";
import DispalyMessage from "../components/Dialogs/DisplayMessage";
import { UserContext } from "../context/UserContext";

export default function LandingScreen({ navigation }) {
  const [tab, setTab] = useState("home");

  const [loading, setLoading] = useState(true);
  const [routeParams, setRouteParams] = useState(null);
  const [showMoodal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const [canCancel, setCanCancel] = useState(false);
  const [timeDiff, setTimeDiff] = useState(null);

  const { setUserParams } = useContext(UserContext);

  const fetchShops = (id) => {
    new BaseApiService("/shops")
      .getRequestWithJsonResponse({ limit: 0, offset: 0, shopOwnerId: id })
      .then(async (response) => {
        await UserSessionUtils.setShopCount(String(response.totalItems));
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
    if (timeDiff?.hours >= 5) {
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
        }
        const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
          data.user;

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
        //loging the user out if the object is missing
        logOut();
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <Loader loading={loading} />

      <BlackScreen>
        <UserProfile />
      </BlackScreen>

      <FlatList
        style={{ flex: 1, marginTop: 20 }}
        data={categoryIcons}
        renderItem={({ item }) => (
          <Icon icon={item} onPress={() => handleTabPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />

      <View // bottom nav
        style={{
          height: 70,
          backgroundColor: Colors.dark,
          flexDirection: "row",
          alignSelf: "stretch",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setTab("cash")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "cash" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-money-bag-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("box")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "box" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-box-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("home")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "home" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-home-48.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("wallet")}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "wallet" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-wallet-50.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmLogout}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: tab === "check" ? Colors.primary : Colors.light,
            }}
            resizeMode={"contain"}
            source={require("../assets/icons/icons8-logout-24.png")}
          />
        </TouchableOpacity>
      </View>

      <DispalyMessage
        showModal={showMoodal}
        message={message}
        onAgree={logOut}
        agreeText={agreeText}
        setShowModal={setShowModal}
        canCancel={canCancel}
      />
    </View>
  );
}

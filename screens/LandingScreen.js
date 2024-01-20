import { View, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { Icon } from "../components/Icon";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import UserProfile from "../components/UserProfile";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import Loader from "../components/Loader";
import { categoryIcons } from "../constants/Constants";
import { BaseApiService } from "../utils/BaseApiService";

export default function LandingScreen({ navigation }) {
  const [tab, setTab] = useState("home");

  const [loading, setLoading] = useState(false);
  const [routeParams, setRouteParams] = useState(null);

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

  useEffect(() => {
    UserSessionUtils.getFullSessionObject()
      .then(async (data) => {
        if (data === null) {
          UserSessionUtils.clearLocalStorageAndLogout(navigation);
        }
        setRouteParams(data.user);
        const { isShopOwner, shopOwnerId } = data.user;

        let shopCount = await UserSessionUtils.getShopCount();
        if (isShopOwner) {
          if (shopCount === null) {
            fetchShops(shopOwnerId);
          }
        }
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        //looging the user out if the object is missing
        UserSessionUtils.clearLocalStorageAndLogout(navigation);
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
          <Icon
            icon={item}
            onPress={() =>
              item.target
                ? navigation.navigate(item.target, {
                    ...routeParams,
                  })
                : null
            }
          />
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
          onPress={() =>
            UserSessionUtils.clearLocalStorageAndLogout(navigation)
          }
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
    </View>
  );
}

import {
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
} from "@controllers/OfflineControllers";
import { BaseApiService } from "@utils/BaseApiService";
import { LOGIN_END_POINT } from "@utils/EndPointUtils";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const userData = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hasUserSetPinCode, setHasUserSetPinCode] = useState(false);
  const [userPincode, setUserPinCode] = useState("");
  const [sessionObj, setSessionObj] = useState(null);
  const [logInWithPin, setLoginWithPin] = useState(false);
  const [offlineParams, setOfflineParams] = useState(null);

  const resetAll = () => {
    setUserParams({});
    setShops([]);
    setOfflineParams(null);
    setLoginWithPin(false);
    setSessionObj(null);
    setSelectedShop(null);
  };

  const getShopsFromStorage = async () => {
    await UserSessionUtils.getShops().then(async (ownerShops) => {
      if (ownerShops) {
        if (ownerShops?.length > 1) {
          const allShops = {
            name: "All shops",
            id: userParams?.shopOwnerId,
          };

          setShops([allShops, ...ownerShops]);
          setSelectedShop(allShops);
        } else {
          setSelectedShop(ownerShops[0]);
          setShops(ownerShops);
        }
      }
    });
  };

  const configureUserData = async (refresh = false) => {
    let isConfigured = false;
    await UserSessionUtils.getUserDetails()
      .then(async (data) => {
        if (data) {
          const {
            roles,
            firstName,
            lastName,
            isShopOwner,
            isShopAttendant,
            attendantShopId,
            shopOwnerId,
            attendantShopName,
            isSuperAdmin,
          } = data;

          setUserParams({
            isShopOwner,
            isShopAttendant,
            isSuperAdmin,
            attendantShopId,
            shopOwnerId,
          });

          setSessionObj({
            fullName: firstName + " " + lastName,
            role: roles[0].name,
            phoneNumber: data?.phoneNumber,
            dateCreated: data?.dateCreated,
            emailAddress: data?.emailAddress,
            attendantShopName: data?.attendantShopName,
          });

          if (!isShopAttendant) {
            const savedShops = await saveShopDetails(
              isShopOwner,
              shopOwnerId,
              refresh
            );
            isConfigured = savedShops;
          }

          if (isSuperAdmin === false) {
            if (isShopAttendant == true) {
              setSelectedShop({
                name: attendantShopName,
                id: attendantShopId,
              });
            }

            const searchParameters = {
              offset: 0,
              limit: 10000,
              ...(isShopAttendant && { shopId: attendantShopId }),
              ...(isShopOwner && { shopOwnerId }),
            };

            setOfflineParams(searchParameters);
            const savedproducts = await saveShopProductsOnDevice(
              searchParameters,
              refresh
            );
            const savedClients = await saveShopClients(
              searchParameters,
              refresh
            );

            if (savedproducts === true && savedClients === true) {
              isConfigured = true;
            }

            await getShopsFromStorage();
          }
        }
      })
      .catch((error) => {
        console.log("No user data available", error);
        setUserParams({});
        setSessionObj(null);
        isConfigured = false;
      });

    return isConfigured;
  };

  const getAppLockStatus = () => {
    UserSessionUtils.getUserPinCode().then(async (data) => {
      if (data) {
        setHasUserSetPinCode(true);
        setUserPinCode(data);
        setLoginWithPin(true);
      } else {
        setHasUserSetPinCode(false);
        setLoginWithPin(false);
      }
    });
  };

  const getRefreshToken = async () => {
    const loginInfo = await UserSessionUtils.getLoginDetails();
    console.log("Getting refresh token");
    if (loginInfo) {
      new BaseApiService(LOGIN_END_POINT)
        .saveRequestWithJsonResponse(loginInfo, false)
        .then(async (response) => {
          await UserSessionUtils.setUserAuthToken(response.accessToken);
          await UserSessionUtils.setUserRefreshToken(response.refreshToken);
          await UserSessionUtils.setLoginTime(String(new Date()));
          console.log("token refreshed");
        });
    }
  };

  /**
   *
   * returns and object of search params basing on the selected shop and the current user type
   */
  const filterParams = () => {
    let obj = {};
    const allShops = selectedShop?.name === "All shops";

    if (userParams?.isShopOwner === true && allShops) {
      obj.shopOwnerId = userParams?.shopOwnerId;
    }

    if (!allShops) {
      obj.shopId = selectedShop?.id;
    }

    return obj;
  };

  useEffect(() => {
    getAppLockStatus();
    getShopsFromStorage();
  }, [hasUserSetPinCode, userParams]);

  useEffect(() => {
    if (hasUserSetPinCode === false) {
      setLoginWithPin(false);
    }
  }, [logInWithPin]);

  const data = {
    sessionObj,
    hasUserSetPinCode,
    userPincode,
    setHasUserSetPinCode,
    userParams,
    setUserParams,
    shops,
    setShops,
    selectedShop,
    setSelectedShop,
    getShopsFromStorage,
    logInWithPin,
    setLoginWithPin,
    getRefreshToken,
    getAppLockStatus,
    configureUserData,
    offlineParams,
    filterParams,
    resetAll,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

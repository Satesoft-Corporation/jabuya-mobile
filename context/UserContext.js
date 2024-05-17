import { createContext, useState, useEffect, useContext } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import { BaseApiService } from "../utils/BaseApiService";
import { LOGIN_END_POINT } from "../utils/EndPointUtils";
import {
  saveShopClients,
  saveShopDetails,
  saveShopProductsOnDevice,
} from "../controllers/OfflineControllers";

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

  const [reload, setReload] = useState(false); // flag for reloading screen when a record edit or save is made

  const getShopsFromStorage = async () => {
    await UserSessionUtils.getShops().then(async (ownerShops) => {
      if (ownerShops) {
        if (ownerShops?.length > 1) {
          const allShops = {
            name: "All shops",
            id: userParams?.shopOwnerId,
          };

          setShops([allShops, ...ownerShops]);
          setSelectedShop(ownerShops[0]);
        } else {
          setSelectedShop(ownerShops[0]);
          setShops(ownerShops);
        }
      }
    });
  };

  const configureUserData = async () => {
    let isConfigured = false;
    await UserSessionUtils.getUserDetails().then(async (data) => {
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
        } = data;

        setUserParams({
          isShopOwner,
          isShopAttendant,
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

        await saveShopProductsOnDevice(searchParameters);
        await saveShopClients(searchParameters);

        let shopCount = await UserSessionUtils.getShopCount();

        if (!isShopAttendant && shopCount === null) {
          await saveShopDetails(isShopOwner, shopOwnerId);
        }

        isConfigured = true;
      } else {
        console.log("No user data available");
        setUserParams({});
        setSessionObj(null);
        isConfigured = false;
      }
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
          await UserSessionUtils.setLoginTime(JSON.stringify(new Date()));
          console.log("token refreshed");
        });
    }
  };

  useEffect(() => {
    getAppLockStatus();
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
    reload,
    setReload,
    getRefreshToken,
    getAppLockStatus,
    configureUserData,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import { BaseApiService } from "../utils/BaseApiService";
import { LOGIN_END_POINT } from "../utils/EndPointUtils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hasUserSetPinCode, setHasUserSetPinCode] = useState(false);
  const [userPincode, setUserPinCode] = useState("");
  const [sessionObj, setSessionObj] = useState(null);
  const [logInWithPin, setLoginWithPin] = useState(false);

  const [reload, setReload] = useState(false); // flag for reloading screen when a record edit or save is made

  const getShopsFromStorage = () => {
    UserSessionUtils.getShops().then((ownerShops) => {
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

    if (userParams?.isShopAttendant === true) {
      UserSessionUtils.getFullSessionObject().then((data) => {
        if (data) {
          const { attendantShopId, attendantShopName } = data?.user;

          setSelectedShop({
            name: attendantShopName,
            id: attendantShopId,
          });
        }
      });
    }
  };

  const getSessionObj = async () => {
    await UserSessionUtils.getFullSessionObject().then((data) => {
      if (data) {
        const { roles, firstName, lastName } = data?.user;

        setSessionObj({
          fullName: firstName + " " + lastName,
          role: roles[0].name,
          phoneNumber: data?.phoneNumber,
          dateCreated: data?.dateCreated,
          username: data?.userParams,
          emailAddress: data?.emailAddress,
          isShopAttendant: data?.isShopAttendant,
          isShopOwner: data?.isShopOwner,
          attendantShopName: data?.attendantShopName,
        });
      }
    });
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
    getShopsFromStorage();
    getSessionObj();
  }, [userParams]);

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
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

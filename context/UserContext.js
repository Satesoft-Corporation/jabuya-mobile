import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import NetInfo from "@react-native-community/netinfo";
import { getTimeDifference } from "../utils/Utils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //api call variables
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hasUserSetPinCode, setHasUserSetPinCode] = useState(false);
  const [userPincode, setUserPinCode] = useState("");
  const [sessionObj, setSessionObj] = useState(null);
  const [logInWithPin, setLoginWithPin] = useState(false);

  const getShopsFromStorage = () => {
    UserSessionUtils.getShops().then((ownerShops) => {
      if (ownerShops) {
        setShops(ownerShops);
        setSelectedShop(ownerShops[0]);
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
        const {
          roles,
          firstName,
          lastName,
          attendantShopName,
          phoneNumber,
          dateCreated,
          username,
          emailAddress,
          isShopAttendant,
          isShopOwner,
        } = data?.user;

        setSessionObj({
          fullName: firstName + " " + lastName,
          role: roles[0].name,
          phoneNumber,
          dateCreated,
          username,
          emailAddress,
          isShopAttendant,
          isShopOwner,
          attendantShopName,
        });
      }
    });
  };

  const getAppLockStatus = () => {
    UserSessionUtils.getUserPinCode().then(async (data) => {
      if (data) {
        setHasUserSetPinCode(true);
        setUserPinCode(data);
      }
    });
  };

  useEffect(() => {
    getShopsFromStorage();
    getSessionObj();
  }, [userParams]);

  useEffect(() => {
    getAppLockStatus();
  }, [hasUserSetPinCode, userParams]);

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
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

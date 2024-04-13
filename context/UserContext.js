import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";

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
        setSelectedShop(ownerShops[0]);
        if (ownerShops?.length > 1) {
          const allShops = {
            name: "All shops",
            id: userParams?.shopOwnerId,
          };

          setShops([allShops, ...ownerShops]);
        } else {
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
        setLoginWithPin(true);
      } else {
        setHasUserSetPinCode(false);
        setLoginWithPin(false);
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
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

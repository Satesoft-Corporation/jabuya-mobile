import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import NetInfo from "@react-native-community/netinfo";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //api call variables
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  

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

  useEffect(() => {
    getShopsFromStorage();
  }, [userParams]);

  const data = {
    userParams,
    setUserParams,
    shops,
    setShops,
    selectedShop,
    setSelectedShop,
    getShopsFromStorage,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const getShopsFromStorage = () => {
    UserSessionUtils.getShops().then((ownerShops) => {
      if (ownerShops) {
        setShops(ownerShops);
        setSelectedShop(ownerShops[0])
      }
    });
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

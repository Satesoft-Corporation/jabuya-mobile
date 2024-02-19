import { createContext, useState, useEffect } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const getShopsFromStorage = () => {
    let allShops = { name: "All shops", id: userParams?.shopOwnerId };

    UserSessionUtils.getShops().then((ownerShops) => {
      if (ownerShops) {
        setSelectedShop(allShops);
        setShops([allShops, ...ownerShops]);
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

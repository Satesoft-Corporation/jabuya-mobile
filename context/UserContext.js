import { createContext, useState } from "react";
import { UserSessionUtils } from "../utils/UserSessionUtils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});
  const [stopLoading, setStopLoading] = useState(false);

  const data = {
    userParams,
    setUserParams,
    stopLoading,
    setStopLoading,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

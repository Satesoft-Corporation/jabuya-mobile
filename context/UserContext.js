import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userParams, setUserParams] = useState({});

  const data = {
    userParams,
    setUserParams,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

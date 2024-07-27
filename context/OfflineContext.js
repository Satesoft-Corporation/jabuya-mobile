import { createContext, useContext } from "react";

export const OfflineContext = createContext();

export const useOfflineMode = () => {
  return useContext(OfflineContext);
};

export const OfflineProvider = ({ children }) => {
  const data = {};
  return (
    <OfflineContext.Provider value={data}>{children}</OfflineContext.Provider>
  );
};

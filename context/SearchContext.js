import { createContext, useState } from "react";
import { StockingTabTitles } from "../constants/Constants";
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { PurchaseTitle } = StockingTabTitles;
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [currentTab, setCurrentTab] = useState(PurchaseTitle);
  const [searchOffset, setSearchOffset] = useState(0);

  const data = {
    searchTerm,
    setSearchTerm,
    shouldSearch,
    setShouldSearch,
    currentTab,
    setCurrentTab,
    searchOffset,
    setSearchOffset,
  };
  return (
    <SearchContext.Provider value={data}>{children}</SearchContext.Provider>
  );
};

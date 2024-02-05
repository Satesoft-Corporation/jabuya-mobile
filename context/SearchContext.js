import { createContext, useState } from "react";
import { StockingTabTitles } from "../constants/Constants";
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { PurchaseTitle } = StockingTabTitles;
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [currentTab, setCurrentTab] = useState(PurchaseTitle);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        shouldSearch,
        setShouldSearch,
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

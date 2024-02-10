import { createContext, useState } from "react";
import { StockingTabTitles } from "../constants/Constants";
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { PurchaseTitle } = StockingTabTitles;

  const [searchTerm, setSearchTerm] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [currentTab, setCurrentTab] = useState(PurchaseTitle);
  const [message, setMessage] = useState(null);

  //stock purchase context staff
  const [stockEntries, setStockEntries] = useState([]);
  const [stockEntryRecords, setStockEntryRecords] = useState(0);
  const [stockEntryOffset, setStockEntryOffset] = useState(0);

  //stock levels context staff
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [stockLevelOffset, setStockLevelOffset] = useState(0);

  //stock listing context staff
  const [stockListing, setStockListing] = useState([]);
  const [stockListRecords, setStockListRecords] = useState(0);
  const [stockListOffset, setStockListOffset] = useState(0);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const data = {
    searchTerm,
    setSearchTerm,
    shouldSearch,
    setShouldSearch,
    currentTab,
    setCurrentTab,

    stockEntries,
    setStockEntries,
    isFetchingMore,
    setIsFetchingMore,
    stockEntryRecords,
    setStockEntryRecords,
    stockEntryOffset,
    setStockEntryOffset,

    stockLevels,
    setStockLevels,
    stockLevelRecords,
    setStockLevelRecords,
    stockLevelOffset,
    setStockLevelOffset,

    stockListing,
    setStockListing,
    stockListRecords,
    setStockListRecords,
    stockListOffset,
    setStockListOffset,

    message,
    setMessage,
  };
  return (
    <SearchContext.Provider value={data}>{children}</SearchContext.Provider>
  );
};

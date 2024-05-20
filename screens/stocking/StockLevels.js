import { View, FlatList } from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Text } from "react-native";
import Colors from "../../constants/Colors";
import Snackbar from "../../components/Snackbar";
import { UserContext } from "../../context/UserContext";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import StockLevelCard from "./components/StockLevelCard";
import { PDT_ENTRY } from "../../navigation/ScreenNames";
import VerticalSeparator from "../../components/VerticalSeparator";
import ItemHeader from "../sales/components/ItemHeader";
import { formatNumberWithCommas } from "../../utils/Utils";
import { UserSessionUtils } from "../../utils/UserSessionUtils";

const StockLevel = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sold, setSold] = useState(0);

  const [stock, setStock] = useState(0);

  const [pdtValue, setPdtValue] = useState(0);

  const snackbarRef = useRef(null);

  const { selectedShop } = useContext(UserContext);

  const fetchShopProducts = async () => {
    try {
      setLoading(true);
      const id = selectedShop?.name.includes("All") ? null : selectedShop?.id;

      let list = await UserSessionUtils.getShopProducts(id);

      setStockLevels(list);
      setStockLevelRecords(list.length);

      const newList = list.map((data) => {
        const summary = data?.performanceSummary;
        const productSoldQty = summary?.totalQuantitySold || 0;
        const productStockedQty = summary?.totalQuantityStocked || 0;
        const price = data?.salesPrice;

        let remainingStock = Math.round(productStockedQty - productSoldQty);

        if (
          remainingStock === undefined ||
          isNaN(remainingStock) ||
          remainingStock < 1
        ) {
          remainingStock = 0;
        }

        return {
          soldQty: Math.round(productSoldQty),
          stockValue: Math.round(remainingStock * price),
          items: Math.round(remainingStock),
        };
      });

      const soldQty = newList.reduce((a, b) => a + b?.soldQty, 0);
      const items = newList.reduce((a, b) => a + b?.items, 0);
      const stock = newList.reduce((a, b) => a + b?.stockValue, 0);

      setSold(soldQty);
      setPdtValue(items);
      setStock(stock);
      setLoading(false);

      if (list.length === 0) {
        setMessage("No shop products found");
      }

      if (list.length === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  const onSearch = () => {
    const pool = [...stockLevels];
    setLoading(true);
    const filter = pool.filter((item) =>
      item?.productName?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    setStockLevels(filter);
    setLoading(false);
  };
  useEffect(() => {
    fetchShopProducts();
  }, [selectedShop]);

  const toProductEntry = () => {
    if (selectedShop?.name.includes("All")) {
      snackbarRef.current.show("Please select a shop before listing");
    } else {
      navigation.navigate(PDT_ENTRY);
    }
  };

  const menuItems = [
    {
      name: "List product",
      onClick: () => toProductEntry(),
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar />

      <TopHeader
        title="Stock levels"
        // showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showMenuDots
        menuItems={menuItems}
        showShops
        onSearch={onSearch}
      />
      <View
        style={{
          flexDirection: "row",
          paddingTop: 15,
          justifyContent: "space-between",
          paddingHorizontal: 12,
          backgroundColor: "#000",
          paddingBottom: 10,
        }}
      >
        <ItemHeader
          title="Products"
          value={formatNumberWithCommas(stockLevelRecords)}
          ugx={false}
        />

        <VerticalSeparator />
        <ItemHeader
          value={formatNumberWithCommas(pdtValue)}
          title="Items"
          ugx={false}
        />

        <VerticalSeparator />
        <ItemHeader title="Value " value={formatNumberWithCommas(stock)} />
      </View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => <StockLevelCard data={item} />}
        onRefresh={() => fetchShopProducts()}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{message}</Text>
          </View>
        )}
      />
      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockLevel;

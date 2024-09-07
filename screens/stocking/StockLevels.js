import { View, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { PDT_ENTRY } from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import ItemHeader from "@screens/sales/components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import StockLevelCard from "./components/StockLevelCard";
import Snackbar from "@components/Snackbar";
import { userData } from "context/UserContext";
import TopHeader from "@components/TopHeader";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import { saveExcelSheet } from "@utils/FileSystem";
import { useDispatch, useSelector } from "react-redux";
import {
  getOfflineParams,
  getSelectedShop,
  getShopProducts,
  getUserType,
} from "reducers/selectors";
import { userTypes } from "@constants/Constants";

const StockLevel = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(0);
  const [pdtValue, setPdtValue] = useState(0);

  const dispatch = useDispatch();
  // const products = await saveShopProductsOnDevice(offlineParams);
  // dispatch(setShopProducts(products));

  const offlineParams = useSelector(getOfflineParams);
  const selectedShop = useSelector(getSelectedShop);
  const shopProducts = useSelector(getShopProducts);
  const userType = useSelector(getUserType);

  const isShopAttendant = userType === userTypes.isShopAttendant;
  const snackbarRef = useRef(null);

  const fetchShopProducts = async () => {
    try {
      setLoading(true);

      let pdtList = shopProducts.filter((p) => p.shopId === selectedShop?.id);

      pdtList = pdtList?.filter((item) =>
        item?.productName?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );

      setStockLevels(pdtList);

      setStockLevelRecords(pdtList?.length);

      //for calculations
      const newList = list?.map((data) => {
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
          stockValue: Math.round(remainingStock * price),
          items: Math.round(remainingStock),
        };
      });

      const items = newList.reduce((a, b) => a + b?.items, 0);
      const stock = newList.reduce((a, b) => a + b?.stockValue, 0);

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

  const downloadExcelSheet = async () => {
    setLoading(true);
    const clabel = selectedShop?.currency ? `(${selectedShop?.currency})` : "";
    const titles = [
      "Product ",
      `Price ${clabel}`,
      "Items sold",
      "Items in stock",
      "Stock value",
      "Category",
      "Manufacturer",
      "Barcode",
      "Package Unit",
      "SerialNumber",
      "Listed by",
      "Listed on",
    ];

    const summarisedata = stockLevels.map((data) => {
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

      return [
        data?.productName,
        price,
        productSoldQty,
        remainingStock,
        Math.round(remainingStock * price),
        data?.categoryName,
        data?.manufacturerName,
        data?.barcode,
        data?.packageUnitName,
        data?.serialNumber,
        data?.createdByFullName,
        formatDate(data?.dateCreated, true),
      ];
    });
    const excelData = [titles, ...summarisedata];

    await saveExcelSheet(`${selectedShop?.name}'s product list`, excelData);
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
    ...(!isShopAttendant
      ? [
          {
            name: "List product",
            onClick: () => toProductEntry(),
          },
        ]
      : []),
    {
      name: "Share excel sheet",
      onClick: () => downloadExcelSheet(),
      share: true,
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
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showMenuDots
        menuItems={menuItems}
        showShops
        onSearch={() => fetchShopProducts()}
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
        <ItemHeader title="Products" value={stockLevelRecords} />

        <VerticalSeparator />
        <ItemHeader value={formatNumberWithCommas(pdtValue)} title="Items" />

        <VerticalSeparator />
        <ItemHeader title="Value " value={stock} isCurrency />
      </View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => <StockLevelCard data={item} />}
        onRefresh={async () => {
          setSearchTerm("");
          await saveShopProductsOnDevice(offlineParams, 2 === 2);
          fetchShopProducts();
        }}
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

import { View, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { PDT_ENTRY } from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import ItemHeader from "@screens/sales/components/ItemHeader";
import VerticalSeparator from "@components/VerticalSeparator";
import Snackbar from "@components/Snackbar";
import TopHeader from "@components/TopHeader";
import { formatNumberWithCommas } from "@utils/Utils";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import { useSelector } from "react-redux";
import { getIsAdmin, getOfflineParams, getSelectedShop } from "duqactStore/selectors";
import { ALL_SHOPS_LABEL } from "@constants/Constants";
import StockLevelCard from "./StockLevelCard";
import { getCanCreateUpdateMyShopStock, getCanViewShopCapital } from "duqactStore/selectors/permissionSelectors";
import AdminStock from "./AdminStock";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import { hasInternetConnection } from "@utils/NetWork";
import { useNavigation } from "@react-navigation/native";
import UnlistModal from "./UnlistModal";

const StockLevels = () => {
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockLevels, setStockLevels] = useState([]);
  const [stockLevelRecords, setStockLevelRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState(0);
  const [pdtValue, setPdtValue] = useState(0);
  const [unListModal, setUnListModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const offlineParams = useSelector(getOfflineParams);
  const selectedShop = useSelector(getSelectedShop);

  const canViewCapital = useSelector(getCanViewShopCapital);
  const canDoStockCrud = useSelector(getCanCreateUpdateMyShopStock);
  const isAdmin = useSelector(getIsAdmin);
  const navigation = useNavigation();
  const snackbarRef = useRef(null);

  const fetchShopProducts = async () => {
    try {
      const shopProducts = await UserSessionUtils.getShopProducts();

      setLoading(true);

      let pdtList = shopProducts?.filter((p) => p.shopId === selectedShop?.id);

      if (selectedShop?.name === ALL_SHOPS_LABEL) {
        pdtList = [...shopProducts];
      }

      pdtList = pdtList?.filter((item) => item?.productName?.toLowerCase()?.includes(searchTerm.toLowerCase()?.trim()));

      setStockLevels(pdtList);

      setStockLevelRecords(pdtList?.length);

      //for calculations
      const newList = pdtList?.map((data) => {
        const summary = data?.performanceSummary;
        return { stockValue: Math.round(summary?.remainingStockValue || 0), items: Math.round(summary?.remainingStockQuantity || 0) };
      });

      const items = newList.reduce((a, b) => a + b?.items, 0);
      const stock = newList.reduce((a, b) => a + b?.stockValue, 0);

      setPdtValue(items);
      setStock(stock);

      if (pdtList.length === 0) {
        setMessage("No shop products found");
      }

      if (pdtList.length === 0 && searchTerm !== "") {
        setMessage(`No results found for ${searchTerm}`);
      }

      setLoading(false);
    } catch (error) {
      setMessage("Error fetching stock records");
      setLoading(false);
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    try {
      const hasNet = await hasInternetConnection();
      if (hasNet === true) {
        setSearchTerm("");
        setLoading(true);
        await saveShopProductsOnDevice(offlineParams);
        await fetchShopProducts();
        snackbarRef.current.show("Data synced", 5000);
      } else {
        snackbarRef.current.show("Cannot connect to the internet");
      }
    } catch (e) {
      setLoading(false);
      snackbarRef.current.show("Unexpected error");
    }
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
    { name: "List product", onClick: () => toProductEntry() },
    { name: "Sync", onClick: () => handleRefresh() },
  ];

  if (isAdmin) {
    return <AdminStock />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <UnlistModal
        selectedItem={selectedItem}
        showMoodal={unListModal}
        setShowModal={setUnListModal}
        onComplete={() => {
          snackbarRef.current.show("Details saved");
          handleRefresh();
        }}
      />

      <TopHeader
        title="Stock levels"
        showSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showMenuDots={canDoStockCrud}
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
        {canViewCapital && (
          <>
            <VerticalSeparator />
            <ItemHeader title="Value " value={formatNumberWithCommas(stock, selectedShop?.currency)} />
          </>
        )}
      </View>
      <FlatList
        keyExtractor={(item) => item?.id?.toString()}
        style={{ marginTop: 5 }}
        showsHorizontalScrollIndicator={false}
        data={stockLevels}
        renderItem={({ item }) => (
          <StockLevelCard
            data={item}
            handleDelete={() => {
              setUnListModal(true);
              setSelectedItem(item);
            }}
          />
        )}
        onRefresh={() => fetchShopProducts()}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>{message}</Text>
          </View>
        )}
      />
      <Snackbar ref={snackbarRef} />
    </View>
  );
};

export default StockLevels;

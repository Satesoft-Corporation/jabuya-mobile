import React, { useState, useEffect, useContext } from "react";
import { Text, View, TextInput, ScrollView, SafeAreaView } from "react-native";
import { useRef } from "react";
import {
  BARCODE_SCREEN,
  CREDIT_SALES,
  SALES_REPORTS,
} from "@navigation/ScreenNames";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import ConfirmSaleModal from "./components/ConfirmSaleModal";
import EnterSaleQtyModal from "./components/EnterSaleQtyModal";
import { BlackScreen } from "@components/BlackAndWhiteScreen";
import UserProfile from "@components/UserProfile";
import {
  MyDropDown,
  SalesDropdownComponent,
} from "@components/DropdownComponents";
import { formatNumberWithCommas } from "@utils/Utils";
import PrimaryButton from "@components/buttons/PrimaryButton";
import SalesTable from "./components/SalesTable";
import { userData } from "context/UserContext";
import { SaleEntryContext } from "context/SaleEntryContext";
import Snackbar from "@components/Snackbar";
import DataRow from "@components/card_components/DataRow";
import { scale } from "react-native-size-matters";
import { screenWidth } from "@constants/Constants";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";
import { BaseApiService } from "@utils/BaseApiService";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";

function SalesDesk({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [clients, setClients] = useState([]);

  const snackbarRef = useRef(null);

  const {
    userParams,
    selectedShop,
    shops,
    setSelectedShop,
    filterParams,
    offlineParams,
  } = userData();

  const {
    selections,
    selection,
    setSelection,
    setLoading,
    totalQty,
    recievedAmount,
    setRecievedAmount,
    totalCost,
    clearEverything,
    setShowModal,
    setSaleUnits,
    setSelectedSaleUnit,
    setInitialUnitCost,
    setUnitCost,
  } = useContext(SaleEntryContext);

  const { isShopAttendant, isSuperAdmin } = userParams;

  const menuItems = [
    {
      name: "Daily sales",
      onClick: () => navigation.navigate(SALES_REPORTS),
    },
    {
      name: "Debts",
      onClick: () => navigation.navigate(CREDIT_SALES),
    },
  ];

  const fetchProducts = async () => {
    if (isSuperAdmin) {
      await fetchProductsFromServer();
      setLoading(false);
      return;
    } else {
      setLoading(true);
      const pdtList = await UserSessionUtils.getShopProducts(selectedShop?.id);
      const inStock = pdtList
        ?.filter((pdt) => pdt?.performanceSummary)
        .filter((pdt) => {
          const { totalQuantityStocked, totalQuantitySold } =
            pdt?.performanceSummary;

          const qtyInStock = totalQuantityStocked - totalQuantitySold;
          return qtyInStock > 0;
        });
      setProducts(inStock);
      fetchClients();
    }
  };

  const fetchProductsFromServer = async () => {
    if (!selectedShop?.name.includes("All")) {
      const searchParameters = {
        ...filterParams(),
        ...(searchTerm && { searchTerm: searchTerm }),
        offset: 0,
        limit: 20,
      };
      await new BaseApiService(SHOP_PRODUCTS_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then(async (response) => {
          setProducts(response.records);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  const fetchClients = async () => {
    let clients = await UserSessionUtils.getShopClients(selectedShop?.id, true);
    setClients(clients);
    setLoading(false);
  };

  const onComplete = async () => {
    if (!isSuperAdmin) {
      await saveShopProductsOnDevice(offlineParams, true); // updating offline products
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedShop]);

  useEffect(() => {
    setLoading(true);
    clearEverything();
  }, [selectedShop]);

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const makeSelection = (item) => {
    const { multipleSaleUnits, saleUnitName, salesPrice } = item;
    let defUnit = { productSaleUnitName: saleUnitName, unitPrice: salesPrice };

    setSelection(item);
    setShowModal(true);

    if (multipleSaleUnits) {
      setSaleUnits([defUnit, ...multipleSaleUnits]);
    } else {
      setSaleUnits([{ ...defUnit }]);
      setSelectedSaleUnit(defUnit);
      setInitialUnitCost(salesPrice);
      setUnitCost(String(salesPrice));
    }
  };

  const handleSubmit = () => {
    if (selections.length > 0) {
      setShowConfirmed(true);
    } else {
      snackbarRef.current.show("Product selection is required.");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar />

      <ConfirmSaleModal
        visible={showConfirmed}
        setVisible={() => setShowConfirmed(false)}
        snackbarRef={snackbarRef}
        clients={clients}
        onComplete={onComplete}
      />

      <EnterSaleQtyModal />

      <BlackScreen flex={isShopAttendant ? 12 : 10}>
        <UserProfile renderMenu renderNtnIcon={false} menuItems={menuItems} />

        <View style={{ marginTop: 15 }}>
          {!isShopAttendant && shops?.length > 1 && (
            <View style={{ paddingHorizontal: 10 }}>
              <MyDropDown
                data={shops?.filter((s) => !s?.name?.includes("All"))}
                labelField={"name"}
                valueField="id"
                onChange={(e) => setSelectedShop(e)}
                value={selectedShop}
                search={shops?.length > 4}
                placeholder="Select a shop"
              />
            </View>
          )}

          <SalesDropdownComponent
            disable={!isShopAttendant && selectedShop?.name?.includes("All")}
            value={selection}
            products={products}
            handleChange={(t) => handleChange(t)}
            makeSelection={makeSelection}
            setScanned={() =>
              navigation.navigate(BARCODE_SCREEN, {
                products,
              })
            }
          />
        </View>
      </BlackScreen>

      <ScrollView
        style={{ backgroundColor: Colors.light_2, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 10, marginTop: 7, gap: 10 }}>
          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <SalesTable sales={selections} />
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#000",
              alignItems: "baseline",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: scale(14) }}>
              Recieved amount
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                maxWidth: screenWidth / 2.5,
                gap: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: Colors.gray,
                  fontSize: scale(14),
                  marginEnd: 5,
                }}
              >
                {selectedShop?.currency}
              </Text>
              <TextInput
                textAlign="right"
                value={recievedAmount}
                inputMode="numeric"
                onChangeText={(text) => setRecievedAmount(text)}
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  fontSize: scale(15),
                  marginEnd: 5,
                }}
                placeholder="Enter amount"
              />
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <DataRow
              label={`Sold ${
                totalQty > 1
                  ? `${totalQty} items`
                  : totalQty === 1
                  ? `${totalQty} item`
                  : ""
              }`}
              value={formatNumberWithCommas(totalCost)}
              currency={selectedShop?.currency}
              labelTextStyle={{ fontWeight: 600 }}
            />
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <DataRow
              label={"Balance"}
              value={formatNumberWithCommas(recievedAmount - totalCost)}
              currency={selectedShop?.currency}
            />
          </View>

          <View
            style={{
              marginTop: 8,
              height: 40,
              marginBottom: 20,
              flexDirection: "row",
              gap: 5,
            }}
          >
            <View style={{ flex: 0.3 }}>
              <PrimaryButton
                title={"Clear"}
                onPress={clearEverything}
                darkMode={false}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <PrimaryButton
                title={"Confirm purchase"}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar ref={snackbarRef} />
    </SafeAreaView>
  );
}

export default SalesDesk;

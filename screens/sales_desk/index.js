import React, { useState, useEffect, useContext } from "react";
import { Text, View, TextInput, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRef } from "react";
import { BARCODE_SCREEN, SALES_REPORTS } from "@navigation/ScreenNames";
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
import { formatNumberWithCommas, isValidNumber } from "@utils/Utils";
import PrimaryButton from "@components/buttons/PrimaryButton";
import SalesTable from "./components/SalesTable";
import { userData } from "context/UserContext";
import { SaleEntryContext } from "context/SaleEntryContext";
import Snackbar from "@components/Snackbar";

function SalesDesk({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [clients, setClients] = useState([]);

  const snackbarRef = useRef(null);

  const { userParams, selectedShop, shops, setSelectedShop } = userData();

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

  const { isShopAttendant } = userParams;

  const menuItems = [
    {
      name: "Report",
      onClick: () => navigation.navigate(SALES_REPORTS),
    },
  ];

  const fetchProducts = async () => {
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
  };

  const fetchClients = async () => {
    let clients = await UserSessionUtils.getShopClients(selectedShop?.id, true);
    setClients(clients);
    setLoading(false);
  };

  useEffect(() => {
    clearEverything();
    fetchProducts();
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
                search={false}
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

            <View
              style={{
                backgroundColor: Colors.light,
                borderRadius: 5,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                  Sold{" "}
                  {totalQty >= 1 && (
                    <Text>
                      {totalQty}
                      {totalQty > 1 ? <Text> items</Text> : <Text> item</Text>}
                    </Text>
                  )}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontWeight: 700,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>
                    {selectedShop?.currency}
                  </Text>{" "}
                  {formatNumberWithCommas(totalCost)}
                </Text>
              </View>
            </View>
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
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                elevation: 10,
                shadowOffset: { width: 0, height: 25 },
                shadowOpacity: 0.8,
                gap: 10,
              }}
            >
              <FontAwesome5 name="money-bill" size={20} color="black" />
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                Recieved amount
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: Colors.gray,
                    fontSize: 10,
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
                    width: 120,
                    fontSize: 17,
                    marginEnd: 5,
                  }}
                  placeholder="Enter amount"
                />
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Balance</Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontWeight: 700,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: 400 }}>
                  {selectedShop?.currency}{" "}
                </Text>
                <Text style={{ fontSize: 17 }}>
                  {recievedAmount &&
                    formatNumberWithCommas(recievedAmount - totalCost)}
                </Text>
              </Text>
            </View>
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

import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

import AppStatusBar from "../../components/AppStatusBar";
import UserProfile from "../../components/UserProfile";
import { SalesDropdownComponent } from "../../components/DropdownComponents";
import { formatNumberWithCommas, isValidNumber } from "../../utils/Utils";
import { BlackScreen } from "../../components/BlackAndWhiteScreen";
import { IconsComponent } from "../../components/MenuIcon";
import Loader from "../../components/Loader";
import Snackbar from "../../components/Snackbar";
import { useRef } from "react";
import { UserContext } from "../../context/UserContext";
import SelectShopBar from "../../components/SelectShopBar";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { SaleEntryContext } from "../../context/SaleEntryContext";
import { UserSessionUtils } from "../../utils/UserSessionUtils";
import NetInfo from "@react-native-community/netinfo";

import { SafeAreaView } from "react-native";
import {
  BARCODE_SCREEN,
  SALES_REPORTS,
  SHOP_SELECTION,
} from "../../navigation/ScreenNames";
import SalesTable from "./components/SalesTable";
import EnterSaleQtyModal from "./components/EnterSaleQtyModal";
import ConfirmSaleModal from "./components/ConfirmSaleModal";

function SalesEntry({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [clients, setClients] = useState([]);

  const snackbarRef = useRef(null);

  const { userParams, selectedShop, shops, setSelectedShop } =
    useContext(UserContext);

  const {
    selections,
    selection,
    setSelection,
    loading,
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

  const { isShopOwner, isShopAttendant, shopOwnerId } = userParams;

  const fetchProducts = async () => {
    let pdtList = await UserSessionUtils.getShopProducts(selectedShop?.id); //store the payload in local storage
    setProducts(pdtList);
    fetchClients();
    setLoading(false);

    NetInfo.fetch().then(async (state) => {
      if (!state.isConnected) {
        snackbarRef.current.show("Running offline", 5000);
        setLoading(false);
      }
    });
  };

  const fetchClients = async () => {
    let clients = await UserSessionUtils.getShopClients(selectedShop?.id);
    setClients(clients);
  };

  useEffect(() => {
    clearEverything();
    fetchProducts();
    if (selectedShop?.id === shopOwnerId) {
      setSelectedShop(shops[1]);
    }
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <Loader loading={loading} />

      <ConfirmSaleModal
        visible={showConfirmed}
        setVisible={() => setShowConfirmed(false)}
        setLoading={setLoading}
        snackbarRef={snackbarRef}
        clients={clients}
      />

      <EnterSaleQtyModal />

      <BlackScreen flex={isShopAttendant ? 12 : 10}>
        <UserProfile />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(SALES_REPORTS);
          }}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 3,
            height: 25,
            justifyContent: "center",
            alignSelf: "flex-end",
            marginEnd: 10,
            marginBottom: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text
            style={{
              color: Colors.dark,
              paddingHorizontal: 6,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            Report
          </Text>
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 0 }}>
          {isShopOwner && (
            <SelectShopBar
              showIcon={false}
              onPress={() => navigation.navigate(SHOP_SELECTION)}
            />
          )}

          <SalesDropdownComponent
            disable={isShopOwner && selectedShop === null}
            value={selection}
            products={products}
            handleChange={(t) => handleChange(t)}
            setLoading={() => setLoading(false)}
            makeSelection={makeSelection}
            setScanned={() => navigation.navigate(BARCODE_SCREEN)}
          />
        </View>
      </BlackScreen>

      <View style={{ backgroundColor: Colors.light_2, flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: 10, marginTop: 7 }}>
          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
              paddingVertical: 4,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                elevation: 10,
                shadowOffset: { width: 0, height: 25 },
                shadowOpacity: 0.8,
              }}
            >
              <FontAwesome5 name="money-bill" size={24} color="black" />
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Recieved amt</Text>
              </View>
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
                  UGX
                </Text>
                <TextInput
                  textAlign="right"
                  value={recievedAmount}
                  inputMode="numeric"
                  onChangeText={(text) => setRecievedAmount(text)}
                  style={{
                    backgroundColor: Colors.light,
                    borderRadius: 5,
                    padding: 5,
                    width: 120,
                    fontSize: 17,
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
              marginTop: 8,
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
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>UGX</Text>{" "}
                  {formatNumberWithCommas(totalCost)}
                </Text>
              </View>
            </View>
          </View>

          <View // selections table
            style={{
              backgroundColor: Colors.light,
              borderRadius: 5,
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="money-bill" size={24} color="black" />
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  Balance
                </Text>
              </View>
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
                <Text style={{ fontSize: 10, fontWeight: 400 }}>UGX </Text>
                <Text style={{ fontSize: 17 }}>
                  {recievedAmount &&
                    formatNumberWithCommas(recievedAmount - totalCost)}
                </Text>
              </Text>
            </View>
          </View>

          <IconsComponent clear={() => clearEverything()} />

          <View style={{ marginTop: 8, height: 40, marginBottom: 20 }}>
            <PrimaryButton
              title={"Confirm purchase"}
              titleStyle={{
                fontSize: 18,
                fontWeight: 500,
              }}
              onPress={() => {
                const isValidAmount = Number(recievedAmount) >= totalCost;

                if (selections.length > 0) {
                  if (isValidAmount === true) {
                    setLoading(true);
                    setShowConfirmed(true);
                    return true;
                  }

                  if (!isValidNumber(recievedAmount)) {
                    snackbarRef.current.show(
                      "Invalid input for recieved amount."
                    );
                    return true;
                  } else {
                    snackbarRef.current.show(
                      `Recieved amount should be greater that UGX ${formatNumberWithCommas(
                        totalCost
                      )}`,
                      4000
                    );
                    return true;
                  }
                } else {
                  snackbarRef.current.show("Product selection is required.");
                }
              }}
            />
          </View>
        </ScrollView>
        <Snackbar ref={snackbarRef} />
      </View>
    </SafeAreaView>
  );
}

export default SalesEntry;

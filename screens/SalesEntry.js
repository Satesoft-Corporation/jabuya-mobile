import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { BaseApiService } from "../utils/BaseApiService";

import Colors from "../constants/Colors";

import AppStatusBar from "../components/AppStatusBar";
import UserProfile from "../components/UserProfile";
import { SaleListItem } from "../components/TransactionItems";
import { SalesDropdownComponent } from "../components/DropdownComponents";
import { SalesQtyInputDialog } from "../components/Dialogs";
import { formatNumberWithCommas, isValidNumber } from "../utils/Utils";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import { IconsComponent } from "../components/Icon";
import Loader from "../components/Loader";
import { ConfirmSalesDialog } from "../components/Dialogs";
import Snackbar from "../components/Snackbar";
import { useRef } from "react";
import { UserContext } from "../context/UserContext";
import SelectShopBar from "../components/SelectShopBar";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { MAXIMUM_RECORDS_PER_FETCH, dummy } from "../constants/Constants";
import { SaleEntryContext } from "../context/SaleEntryContext";
import { UserSessionUtils } from "../utils/UserSessionUtils";
import NetInfo from "@react-native-community/netinfo";

const screenHeight = Dimensions.get("window").height;

function SalesEntry({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const snackbarRef = useRef(null);

  const { userParams, selectedShop } = useContext(UserContext);

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
  } = useContext(SaleEntryContext);

  const { isShopOwner, isShopAttendant, attendantShopId } = userParams;

  const resolvePendingSales = async () => {
    setLoading(true);

    let pendingSales = await UserSessionUtils.getPendingSales();

    if (pendingSales.length > 0) {
      pendingSales.forEach((cart, index) => {
        new BaseApiService("/shop-sales")
          .postRequest(cart)
          .then(async (response) => {
            let d = { info: await response.json(), status: response.status };
            return d;
          })
          .then(async (d) => {
            let { info, status } = d;
            let id = info?.id;

            if (status === 200) {
              new BaseApiService(`/shop-sales/${id}/confirm`)
                .postRequest()
                .then((d) => d.json())
                .then(async (d) => {
                  await UserSessionUtils.removePendingSale(index);
                })
                .catch((error) => {
                  console.log(error, cart);
                });
            } else {
              console.log(error, cart);
            }
          });
      });
    }
    fetchProducts();
  };

  const fetchProducts = async () => {
    let searchParameters = {
      offset: 0,
      limit: 10000,
    };

    if (searchTerm !== null) {
      searchParameters.searchTerm = searchTerm;
    }

    if (isShopOwner) {
      searchParameters.shopId = selectedShop?.id;
    }

    if (isShopAttendant) {
      searchParameters.shopId = attendantShopId;
    }

    NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        new BaseApiService("/shop-products")
          .getRequestWithJsonResponse(searchParameters)
          .then(async (response) => {
            setProducts(response.records);
            setLoading(false);

            if (!searchTerm) {
              await UserSessionUtils.setShopProducts(response.records); //to keep updating the list locally
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        let pdtList = await UserSessionUtils.getShopProducts(selectedShop?.id);
        setProducts(pdtList);
        snackbarRef.current.show("enjoy offline mode", 6000);
        setLoading(false);
      }
    });
  };

  const postSales = () => {
    let payLoad = {
      id: null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: Number(recievedAmount),
      lineItems: selections,
    };

    setLoading(true);
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        new BaseApiService("/shop-sales")
          .postRequest(payLoad)
          .then(async (response) => {
            let d = { info: await response.json(), status: response.status };
            return d;
          })
          .then(async (d) => {
            let { info, status } = d;
            let id = info?.id;

            if (status === 200) {
              new BaseApiService(`/shop-sales/${id}/confirm`)
                .postRequest()
                .then((d) => d.json())
                .then((d) => {
                  if (d.status === "Success") {
                    setShowConfirmed(false);
                    setLoading(false);
                    clearEverything();
                    snackbarRef.current.show(
                      "Sale confirmed successfully",
                      4000
                    );
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  snackbarRef.current.show(
                    `Failed to confirm purchases!,${error?.message}`,
                    6000
                  );
                });
            } else {
              setLoading(false);
              snackbarRef.current.show(info?.message, 5000);
            }
          })
          .catch((error) => {
            setLoading(false);
            snackbarRef.current.show(error?.message);
          });
      } else {
        console.log("going offline");
        await UserSessionUtils.addPendingSale(payLoad);
        setTimeout(() => setLoading(false), 1000);
        clearEverything();
        snackbarRef.current.show(
          "Sale record will be saved when online.",
          4000
        );
      }
    });
  };

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const makeSelection = (item) => {
    const { multipleSaleUnits, saleUnitName, salesPrice } = item;

    let defUnit = { productSaleUnitName: saleUnitName, unitPrice: salesPrice };

    setSelection(item);
    console.log(item);
    setShowModal(true);

    if (multipleSaleUnits) {
      setSaleUnits([defUnit, ...multipleSaleUnits]);
    } else {
      setSaleUnits([{ ...defUnit }]);
    }
  };

  useEffect(() => {
    resolvePendingSales();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <Loader loading={loading} />

      <ConfirmSalesDialog
        visible={showConfirmed}
        addSale={postSales}
        sales={selections}
        totalCost={totalCost}
        setVisible={() => setShowConfirmed(false)}
        clear={clearEverything}
        amountPaid={recievedAmount}
        balanceGivenOut={recievedAmount - totalCost}
        cartLength={totalQty}
      />

      <SalesQtyInputDialog />

      <BlackScreen flex={isShopAttendant ? 12 : 10}>
        <UserProfile />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("viewSales");
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
              onPress={() => navigation.navigate("selectShops")}
            />
          )}

          <SalesDropdownComponent
            disable={isShopOwner && selectedShop === null}
            value={selection}
            products={products}
            handleChange={(t) => handleChange(t)}
            setLoading={() => setLoading(false)}
            makeSelection={makeSelection}
            setScanned={() => navigation.navigate("barcodeScreen")}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 25,
                paddingEnd: 10,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 0.3,
              }}
            >
              <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
              <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
                Qty
              </Text>
              <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
                Cost
              </Text>

              <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
                Amount
              </Text>
            </View>
            <ScrollView
              style={{
                height: screenHeight / 4,
              }}
            >
              {selections.map((item) => (
                <SaleListItem data={item} key={item.id} />
              ))}
            </ScrollView>
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

          <IconsComponent clear={clearEverything} />

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
                    setTimeout(() => {
                      setLoading(false);
                      setShowConfirmed(true);
                    }, 500);
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
    </View>
  );
}

export default SalesEntry;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import MaterialButton from "../components/MaterialButton";
import { BaseApiService } from "../utils/BaseApiService";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import ModalContent from "../components/ModalContent";
import Card from "../components/Card";
import ConfirmSalesDialog from "../components/ConfirmSalesDialog";
import { BarCodeScanner } from "expo-barcode-scanner";
import UserProfile from "../components/UserProfile";
import MaterialInput from "../components/MaterialInput";
import { SaleListItem } from "../components/TransactionItems";
import {
  SalesDropdownComponent,
  ShopSelectionDropdown,
} from "../components/DropdownComponents";
import { SalesInfoDialog } from "../components/Dialogs";
import { formatNumberWithCommas } from "../utils/Utils";
import { BlackScreen } from "../components/BlackAndWhiteScreen";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function SalesEntry({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]); //unfiltered selections array
  const [quantity, setQuantity] = useState(null);
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [showMoodal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [postedPdts, setPostedPdts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [returnCost, setReturnedCost] = useState(0);
  const [returnedList, setReturnedList] = useState([]);
  const [returnedId, setReturnedId] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [balanceGivenOut, setBalanceGivenOut] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanBarCode, setScanBarCode] = useState(false); // barcode scanner trigger
  const [totalQty, setTotalQty] = useState(0);
  const [unitCost, setUnitCost] = useState(null);
  const [initialUnitCost, setInitialUnitCost] = useState(null);
  const [errors, setErrors] = useState(null);
  const [date, setDate] = useState(null); // sale time stamp
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    route.params;

  const fetchProducts = async (shopId) => {
    let searchParameters = {
      offset: 0,
      limit: limit,
      searchTerm,
    };
    setLoading(true);
    if (shopId !== null) {
      searchParameters.shopId = shopId;
    }
    if (isShopAttendant) {
      searchParameters.shopId = attendantShopId;
    }
    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchShops = async () => {
    let searchParameters = { offset: 0, limit: 0, shopOwnerId: shopOwnerId };
    if (isShopOwner) {
      new BaseApiService("/shops")
        .getRequestWithJsonResponse(searchParameters)
        .then(async (response) => {
          setShops(response.records);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const postSales = () => {
    let payLoad = {
      id: isShopAttendant ? shopOwnerId : null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: recievedAmount,
      lineItems: selectedProducts,
    };

    new BaseApiService("/shop-sales")
      .postRequest(payLoad)
      .then(async (response) => {
        let d = { info: await response.json(), status: response.status };
        return d;
      })
      .then(async (d) => {
        let { info, status } = d;
        let id = info.id;
        let totalCost_1 = info.totalCost;
        if (status === 200) {
          setReturnedCost(totalCost_1);
          setReturnedList(info.lineItems);
          setReturnedId(id);
          setAmountPaid(info.amountPaid);
          setBalanceGivenOut(info.balanceGivenOut);
          setLineItems(info.lineItems);
          setDate(info.dateCreated);
          setShowConfirmed(true);
          setTimeout(() => setLoading(false), 1000);
        } else if (status === 400) {
          Alert.alert("Failed to confirm purchases!", info?.message);
          setTimeout(() => setLoading(false), 1000);
        }
      })
      .catch((error) => {
        Alert.alert("An unexpected error occurred!");

        setLoading(false);
      });
  };

  const saveSales = (items, id) => {
    setLoading(true);
    postedPdts.push(items);
    new BaseApiService(`/shop-sales/${id}/confirm`)
      .postRequest()
      .then((d) => d.json())
      .then((d) => {
        if (d.status === "Success") {
          setShowConfirmed(false);
          Alert.alert("Sale confirmed successfully");
          setLoading(false);
          clearEverything();
        }
      })
      .catch((error) => {
        Alert.alert("Failed to confirm purchases!", error?.message);
        setLoading(false);
      });
  };

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const makeSelection = (item) => {
    setUnitCost(String(item?.salesPrice));

    setShowModal(true);
    setSelection(item);
  };

  const makeShopSelection = (shop) => {
    setSelectedShop(shop);
    fetchProducts(shop.id);
  };

  const saveSelection = () => {
    // saving the item into the data table

    const parsedQuantity = Number(quantity);
    const itemUnitCost = Number(unitCost);

    let cost = itemUnitCost * parsedQuantity;

    const isValidQuantity = !isNaN(parsedQuantity) && parsedQuantity > 0;
    const isValidCost = !isNaN(itemUnitCost) && itemUnitCost >= initialUnitCost;

    if (itemUnitCost < initialUnitCost) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          lessPriceError: `Unit cost for ${selection.productName} should be greater than ${initialUnitCost}`,
        };
      });
    }

    if (parsedQuantity === 0) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          qtyZeroError: "Quantity should be greater than 0",
        };
      });
    }

    const isValidSubmition = () => {
      return isValidQuantity && isValidCost;
    };

    if (isValidSubmition()) {
      setLoading(true);

      setTotalCost(totalCost + cost);

      setTotalQty(totalQty + parsedQuantity); //updating total items purchased

      const productIndex = selections.findIndex(
        //locating the duplicate item in selection array
        (product) => product.productName === selection.productName
      );

      const productIndex2 = selectedProducts.findIndex(
        //locating the duplicate item in selected pdts array
        (product) => product.id === selection.id
      );

      if (productIndex !== -1) {
        //if the already exists, update quantity and total cost
        let prevQty = selections[productIndex].quantity;
        let prevTotalCost = selections[productIndex].totalCost;

        selections[productIndex].quantity = Number(quantity) + prevQty;
        selections[productIndex].totalCost = prevTotalCost + cost;
        selectedProducts[productIndex2].quantity = Number(quantity) + prevQty;
        setLoading(false);
      } else {
        selectedProducts.push({
          // data set to be used in posting the sale to the server
          id: selection.id,
          shopProductId: selection.id,
          quantity: parsedQuantity,
          unitCost: unitCost,
        });

        setSelections((prev) => [
          ...prev,
          {
            id: selection.id,
            productName: selection.productName,
            salesPrice: unitCost,
            quantity: parsedQuantity, // Use the parsed quantity
            totalCost: cost,
          },
        ]);
      }
      setSelection(null);
      setQuantity(null);
      setShowModal(false);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    setLoading(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    fetchProductByBarCode(data);
  };

  const fetchProductByBarCode = (barcode) => {
    setLoading(true);

    let searchParameters = {
      offset: 0,
      limit: 0,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      barCode: barcode,
    };

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        if (response.records.length === 0) {
          Alert.alert("Cannot find product in your shop", "", [
            {
              text: "Ok",
              onPress: () => setScanned(false),
              style: "cancel",
            },
          ]);
          setLoading(false);
          setQuantity(null);
        } else {
          setSelection(response.records[0]);
          setUnitCost(String(response.records[0]?.salesPrice));
          setShowModal(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        Alert.alert("Error!", error?.message);
        setLoading(false);
        setScanned(false);
      });
  };

  const clearEverything = () => {
    setSelectedProducts([]);
    setQuantity(null);
    setSelection(null);
    setTotalCost(0);
    setRecievedAmount(0);
    setShowConfirmed(false);
    setSelections([]);
    setLineItems([]);
    setTotalQty(0);
    setErrors({});
    setSelectedShop(null);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    setInitialUnitCost(selection?.salesPrice);
  }, [selection]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    unfocusedContainer: {
      //the blured section
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
    },

    focusedContainer: {
      //scan area
      borderColor: Colors.primary,
      borderWidth: 2,
      height: 150,
      borderRadius: 5,
      width: screenWidth / 1.2,
    },
  });

  return scanBarCode ? (
    <View style={styles.container}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />
      <OrientationLoadingOverlay
        visible={loading}
        color={Colors.primary}
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
      <ModalContent visible={showMoodal} style={{ padding: 35 }}>
        <Card
          style={{
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 2,
            }}
          >
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 20,
                  marginBottom: 5,
                }}
              >
                Successfull
              </Text>
              <Text>
                {selection && selection.productName} has been selected.
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 13,
                  marginTop: 10,
                }}
              >
                Quantity
              </Text>
            </View>

            <TextInput
              onFocus={() => setErrors(null)}
              onBlur={() => setErrors(null)}
              textAlign="right"
              inputMode="numeric"
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              maxLength={3}
              style={{
                backgroundColor: Colors.light_3,
                borderRadius: 5,
                padding: 6,
                borderWidth: 1,
                borderColor: errors?.qtyZeroError
                  ? Colors.error
                  : "transparent",
              }}
            />
            {errors?.qtyZeroError && (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.error,
                }}
              >
                {errors?.qtyZeroError}
              </Text>
            )}
            <Text
              style={{
                fontWeight: "600",
                fontSize: 13,
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Unit cost
            </Text>
            <TextInput
              textAlign="right"
              value={unitCost}
              inputMode="numeric"
              onChangeText={(e) => setUnitCost(e)}
              style={{
                backgroundColor: Colors.light_3,
                borderRadius: 5,
                padding: 6,
                borderColor: errors?.lessPriceError
                  ? Colors.error
                  : "transparent",
              }}
            />
            {errors?.lessPriceError && (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.error,
                }}
              >
                {errors?.lessPriceError}
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
                marginBottom: 5,
              }}
            >
              <MaterialButton
                title="Cancel"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.dark,
                  marginStart: -2,
                  margin: 10,
                  height: 40,
                }}
                titleStyle={{
                  fontWeight: "bold",
                  color: Colors.dark,
                }}
                buttonPress={() => {
                  setScanned(false);
                  setShowModal(false);
                  setErrors({});
                }}
              />
              <MaterialButton
                title="Confirm"
                style={{
                  backgroundColor: Colors.dark,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.dark,
                  marginStart: 2,
                  marginEnd: -2,
                  margin: 10,
                  height: 40,
                }}
                titleStyle={{
                  fontWeight: "bold",
                  color: Colors.primary,
                }}
                buttonPress={() => {
                  setScanned(false);
                  saveSelection();
                }}
              />
            </View>
          </View>
        </Card>
      </ModalContent>

      <BarCodeScanner
        height={screenHeight}
        width={screenWidth}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ marginTop: -20 }}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}></View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
        <View
          style={{
            backgroundColor: "black",
            justifyContent: "center",
            width: screenWidth,
          }}
        >
          <TouchableOpacity
            onPress={() => setScanBarCode(false)}
            style={{
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: Colors.primary,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.dark,
              height: 50,
              width: 300,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 500,
                color: Colors.dark,
                alignSelf: "center",
                fontSize: 20,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: Colors.light_2 }}>
      <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

      <OrientationLoadingOverlay
        visible={loading}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message=""
      />
      <ConfirmSalesDialog
        visible={showConfirmed}
        addSale={() => {
          saveSales(returnedList, returnedId);
        }}
        sales={lineItems}
        total={returnCost}
        setVisible={() => setShowConfirmed(false)}
        clear={clearEverything}
        transID={returnedId}
        amountPaid={amountPaid}
        balanceGivenOut={balanceGivenOut}
        length={totalQty}
        resetList={() => setLineItems([])}
        dateCreated={date}
      />
      <BlackScreen flex={isShopAttendant ? 12 : 10}>
        <UserProfile />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("viewSales", {
              ...route.params,
            });
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
        <View style={{ paddingHorizontal: 10, marginTop: 0 }}>
          {isShopOwner && (
            <>
              <ShopSelectionDropdown
                value={selectedShop} // flex is .75 for owner
                makeShopSelection={makeShopSelection}
                shops={shops}
                disable={selections.length > 0}
              />
            </>
          )}
          <SalesDropdownComponent
            disable={isShopOwner && selectedShop === null}
            value={selection}
            products={products}
            handleChange={(t) => handleChange(t)}
            setLoading={() => setLoading(false)}
            makeSelection={makeSelection}
            setScanned={() => setScanBarCode(true)}
          />
        </View>
      </BlackScreen>

      <View style={{ backgroundColor: Colors.light_2, flex: 1 }}>
        <ScrollView
          style={{ paddingHorizontal: 10, marginTop: 7 }}
        >
          <View
            style={{
              //m was -10
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
            <View
              style={{
                height: screenHeight / 4,
              }}
            >
              {selections.map((item) => (
                <SaleListItem data={item} />
              ))}
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
          <View
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
                  {recievedAmount === 0
                    ? 0
                    : formatNumberWithCommas(recievedAmount - totalCost)}
                </Text>
              </Text>
            </View>
          </View>
          <IconsComponent clear={clearEverything} />
          <TouchableOpacity
            disabled={selections.length < 1}
            style={{
              backgroundColor: Colors.dark,
              borderRadius: 5,
              height: 50,
              justifyContent: "center",
              marginTop: 8,
            }}
            onPress={() => {
              if (recievedAmount === null && selections.length > 0) {
                Alert.alert("Please enter recieved amount");
              }
              if (recievedAmount - totalCost < 0) {
                Alert.alert(
                  `Recieved amount should be greater that ${totalCost}`
                );
              }
              if (
                Number(recievedAmount) >= totalCost &&
                selections.length > 0
              ) {
                setLoading(true);
                postSales();
              }
            }}
          >
            <Text
              style={{
                color: Colors.primary,
                alignSelf: "center",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              Confirm purchase
            </Text>
          </TouchableOpacity>

          <ModalContent visible={showMoodal} style={{ padding: 35 }}>
            <Card
              style={{
                paddingHorizontal: 15,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 2,
                }}
              >
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 5,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 20,
                      marginBottom: 5,
                    }}
                  >
                    Successfull
                  </Text>
                  <Text>
                    {selection && selection.productName} has been selected.
                  </Text>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      marginTop: 10,
                    }}
                  >
                    Quantity
                  </Text>
                </View>

                <TextInput
                  onFocus={() => setErrors(null)}
                  onBlur={() => setErrors(null)}
                  textAlign="right"
                  inputMode="numeric"
                  value={quantity}
                  onChangeText={(text) => setQuantity(text)}
                  maxLength={3}
                  style={{
                    backgroundColor: Colors.light_3,
                    borderRadius: 5,
                    padding: 6,
                    borderWidth: 1,
                    borderColor: errors?.qtyZeroError
                      ? Colors.error
                      : "transparent",
                  }}
                />
                {errors?.qtyZeroError && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.error,
                    }}
                  >
                    {errors?.qtyZeroError}
                  </Text>
                )}
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 13,
                    marginTop: 10,
                    marginBottom: 5,
                  }}
                >
                  Unit cost
                </Text>
                <TextInput
                  textAlign="right"
                  value={unitCost}
                  inputMode="numeric"
                  onChangeText={(e) => setUnitCost(e)}
                  style={{
                    backgroundColor: Colors.light_3,
                    borderRadius: 5,
                    padding: 6,
                    borderColor: errors?.lessPriceError
                      ? Colors.error
                      : "transparent",
                  }}
                />
                {errors?.lessPriceError && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.error,
                    }}
                  >
                    {errors?.lessPriceError}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                    marginBottom: 5,
                  }}
                >
                  <MaterialButton
                    title="Cancel"
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: Colors.dark,
                      marginStart: -2,
                      margin: 10,
                      height: 40,
                    }}
                    titleStyle={{
                      fontWeight: "bold",
                      color: Colors.dark,
                    }}
                    buttonPress={() => {
                      setShowModal(false);
                      setErrors({});
                    }}
                  />
                  <MaterialButton
                    title="Confirm"
                    style={{
                      backgroundColor: Colors.dark,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: Colors.dark,
                      marginStart: 2,
                      marginEnd: -2,
                      margin: 10,
                      height: 40,
                    }}
                    titleStyle={{
                      fontWeight: "bold",
                      color: Colors.primary,
                    }}
                    buttonPress={() => {
                      saveSelection();
                    }}
                  />
                </View>
              </View>
            </Card>
          </ModalContent>
        </ScrollView>
      </View>
    </View>
  );
}

const IconsComponent = ({ clear }) => {
  let color = Colors.gray;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="credit-card" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="mobile" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Mobile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <FontAwesome name="wechat" size={25} color={color} />
        <Text style={{ alignSelf: "center", color }}>Fap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
          opacity: 0.7,
        }}
      >
        <MaterialCommunityIcons
          name="hand-extended-outline"
          size={24}
          color={color}
        />
        <Text style={{ alignSelf: "center", color }}>Credit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.primary,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <MaterialCommunityIcons
          name="broom"
          size={25}
          color="black"
          onPress={() => {
            clear();
          }}
        />
        <Text style={{ alignSelf: "center" }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SalesEntry;

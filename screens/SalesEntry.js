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
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { FontAwesome5 } from "@expo/vector-icons";

import { BaseApiService } from "../utils/BaseApiService";

import Colors from "../constants/Colors";

import AppStatusBar from "../components/AppStatusBar";
import UserProfile from "../components/UserProfile";
import { SaleListItem } from "../components/TransactionItems";
import { SalesDropdownComponent } from "../components/DropdownComponents";
import { ShopSelectionDropdown } from "../components/DropdownComponents";
import { SalesQtyInputDialog } from "../components/Dialogs";
import { formatNumberWithCommas } from "../utils/Utils";
import { BlackScreen } from "../components/BlackAndWhiteScreen";
import { IconsComponent } from "../components/Icon";
import Loader from "../components/Loader";
import { ConfirmSalesDialog } from "../components/Dialogs";
import DispalyMessage from "../components/Dialogs/DisplayMessage";
import Snackbar from "../components/Snackbar";
import { useRef } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function SalesEntry({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(null);
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [showMoodal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState();
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanBarCode, setScanBarCode] = useState(false); // barcode scanner trigger
  const [totalQty, setTotalQty] = useState(0);
  const [unitCost, setUnitCost] = useState(null);
  const [initialUnitCost, setInitialUnitCost] = useState(null);
  const [errors, setErrors] = useState(null);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [message, setMessage] = useState(null);
  const [displayMessage, setDisplayMssage] = useState(false);

  const snackbarRef = useRef(null);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    route.params;

  const fetchProducts = async (shopId) => {
    let searchParameters = {
      offset: 0,
      limit: limit,
    };

    if (searchTerm !== null) {
      searchParameters.searchTerm = searchTerm;
    }

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
          if (response.records.length === 1) {
            setSelectedShop(response.records[0]);
            fetchProducts(response.records[0].id);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const postSales = () => {
    let payLoad = {
      id: null,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      amountPaid: Number(recievedAmount),
      lineItems: selections,
    };
    setLoading(true);
    new BaseApiService("/shop-sales")
      .postRequest(payLoad)
      .then(async (response) => {
        let d = { info: await response.json(), status: response.status };
        return d;
      })
      .then(async (d) => {
        let { info, status } = d;
        let id = info.id;

        if (status === 200) {
          new BaseApiService(`/shop-sales/${id}/confirm`)
            .postRequest()
            .then((d) => d.json())
            .then((d) => {
              if (d.status === "Success") {
                setShowConfirmed(false);
                setMessage("Sale confirmed successfully");
                setLoading(false);
                setDisplayMssage(true);
                clearEverything();
              }
            })
            .catch((error) => {
              setMessage(`Failed to confirm purchases!,${error?.message}`);
              setLoading(false);
              setDisplayMssage(true);
            });
          setTimeout(() => setLoading(false), 1000);
        } else if (status === 400) {
          setMessage(`Failed to confirm purchases!,${error?.message}`);
          setLoading(false);
          setDisplayMssage(true);
        }
      })
      .catch((error) => {
        snackbarRef.current.show(
          "An unexpected error occurred! Try again later."
        );
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
    setLoading(true);
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

      if (productIndex !== -1) {
        //if the already exists, update quantity and total cost
        let prevQty = selections[productIndex].quantity;
        let prevTotalCost = selections[productIndex].totalCost;

        selections[productIndex].quantity = Number(quantity) + prevQty;
        selections[productIndex].totalCost = prevTotalCost + cost;
        setLoading(false);
        setScanned(false);
      } else {
        setSelections((prev) => [
          ...prev,
          {
            id: selection.id,
            productName: selection.productName,
            shopProductId: selection.id,
            quantity: parsedQuantity, // Use the parsed quantity
            totalCost: cost,
            unitCost: unitCost,
          },
        ]);
      }
      setScanned(false);
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
          setScanned(true);
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
    setQuantity(null);
    setSelection(null);
    setTotalCost(0);
    setRecievedAmount(0);
    setShowConfirmed(false);
    setSelections([]);
    setTotalQty(0);
    setErrors({});
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (isShopAttendant) {
      fetchProducts();
    }
    fetchShops();
  }, []);

  useEffect(() => {
    fetchProducts(selectedShop?.id);
  }, [searchTerm]);

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

      <Loader loading={loading} />

      <SalesQtyInputDialog
        showMoodal={showMoodal}
        selection={selection}
        errors={errors}
        setErrors={setErrors}
        setShowModal={setShowModal}
        quantity={quantity}
        setQuantity={setQuantity}
        saveSelection={saveSelection}
        setUnitCost={setUnitCost}
        unitCost={unitCost}
        setScanned={setScanned}
        setSelection={setSelection}
      />

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

      <SalesQtyInputDialog
        showMoodal={showMoodal}
        selection={selection}
        errors={errors}
        setErrors={setErrors}
        setShowModal={setShowModal}
        quantity={quantity}
        setQuantity={setQuantity}
        saveSelection={saveSelection}
        setUnitCost={setUnitCost}
        unitCost={unitCost}
        setSelection={setSelection}
        setScanned={setScanned}
      />

      <DispalyMessage
        showModal={displayMessage}
        message={message}
        onAgree={() => setDisplayMssage(false)}
        setShowModal={setDisplayMssage}
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
          <TouchableOpacity
            disabled={selections.length < 1}
            style={{
              backgroundColor: Colors.dark,
              borderRadius: 5,
              height: 50,
              justifyContent: "center",
              marginTop: 8,
              marginBottom: 20,
            }}
            onPress={() => {
              let shouldConfirm = true;

              if (!recievedAmount) {
                shouldConfirm = false;
              }

              if (!(Number(recievedAmount) >= totalCost)) {
                shouldConfirm = false;
                setMessage(
                  `Recieved amount should be greater that UGX ${formatNumberWithCommas(
                    totalCost
                  )}`
                );
                setDisplayMssage(true);
              }

              if (shouldConfirm === true) {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setShowConfirmed(true);
                }, 1000);
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
        </ScrollView>
        <Snackbar ref={snackbarRef} />
      </View>
    </View>
  );
}

export default SalesEntry;

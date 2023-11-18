import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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
import BlackAndWhiteScreen from "../components/BlackAndWhiteScreen";
import { BarCodeScanner } from "expo-barcode-scanner";

function SalesEntry({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]); //unfiltered selections array
  const [quantity, setQuantity] = useState(null);
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [showMoodal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState(null);
  const [shopId, setShopId] = useState(route.params.shopOwnerId);
  const [attendantShopId, setAttendantShopId] = useState(
    route.params.attendantShopId
  );
  const [showConfirmed, setShowConfirmed] = useState(false); //the confirm dialog
  const [postedPdts, setPostedPdts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [returnCost, setReturnedCost] = useState(0);
  const [a, b] = useState(0); // responsible for updating the total items in a cart
  const [returnedList, setReturnedList] = useState([]);
  const [returnedId, setReturnedId] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [balanceGivenOut, setBalanceGivenOut] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanBarCode, setScanBarCode] = useState(false); // barcode scanner trigger
  const [totalQty, setTotalQty] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const fetchProducts = async () => {
    let searchParameters = { offset: 0, limit: limit, shopId: attendantShopId };
    // if (query != undefined && query != null) {
    //   searchParameters.searchTerm = query;
    // }

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const postSales = () => {
    let payLoad = {
      id: shopId,
      shopId: attendantShopId,
      amountPaid: totalCost,
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
        let items = info.lineItems;
        let id = info.id;
        let totalCost_1 = info.totalCost;
        setReturnedCost(totalCost_1);
        setReturnedList(items);
        setReturnedId(id);
        setAmountPaid(info.amountPaid);
        setBalanceGivenOut(info.balanceGivenOut);
        for (let item of items) {
          lineItems.push([
            item.shopProductName,
            item.quantity,
            item.unitCost,
            item.totalCost,
          ]);
        }
        setShowConfirmed(true);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch((error) => {
        Alert.alert("Failed to confirm purchases!", error?.message);
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
    fetchProducts(value);
  };

  const makeSelection = (item) => {
    setShowModal(true);
    setSelection(item);
  };

  const saveSelection = () => {
    // saving the item into the data table
    const parsedQuantity = parseInt(quantity, 10);

    let cost = selection.salesPrice * parsedQuantity; // get total cost

    if (isNaN(parsedQuantity)) {
      Alert.alert("Quantity is not a valid number");
      return;
    }

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

      return true; // Indicates successful update and I'm a genius
    } else {
      selectedProducts.push({
        // data set to be used in posting the sale to the server
        id: selection.id,
        shopProductId: selection.id,
        quantity: parsedQuantity,
      });

      setSelections((prev) => [
        ...prev,
        {
          id: selection.id,
          productName: selection.productName,
          salesPrice: selection.salesPrice,
          quantity: parsedQuantity, // Use the parsed quantity
          totalCost: cost,
        },
      ]);
    }

    setSelection(null);
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
      shopId: attendantShopId,
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
        } else {
          setSelection(response.records[0]);
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


  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    },

    focusedContainer: {
      //scan area
      flex: 9,
      borderColor: Colors.primary,
      borderWidth: 1,
      height: 150,
      borderRadius: 5,
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
                marginStart: 10,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 20,
                  marginBottom: 5,
                }}
              >
                Successfull
              </Text>
              <Text>
                {selection && selection.productName} has been scanned.
              </Text>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                Input quantity
              </Text>
            </View>

            <TextInput
              inputMode="numeric"
              onChangeText={(text) => setQuantity(text)}
              maxLength={3}
              style={{
                backgroundColor: Colors.light_3,
                borderRadius: 5,
                padding: 6,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
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
                  setScanned(false);
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
                  setShowModal(false);
                  setLoading(true);
                  setQuantity(null);
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                  setScanned(false);
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
              height: 40,
              width: 300,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.dark,
                alignSelf: "center",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <BlackAndWhiteScreen flex={1.1} bgColor={Colors.light_2}>
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
      />

      <View style={{ paddingHorizontal: 10, marginTop: 25 }}>
        <DropdownComponent
          products={products}
          handleChange={(t) => handleChange(t)}
          setLoading={() => setLoading(false)}
          makeSelection={makeSelection}
          setScanned={() => setScanBarCode(true)}
        />
        <View
          style={{
            backgroundColor: Colors.light,
            borderRadius: 5,
            padding: 10,
            paddingVertical: 8,
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
            height: 250,
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
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
              Price
            </Text>
            <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
              Qnty
            </Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
              Amount
            </Text>
          </View>
          <FlatList
            data={selections}
            renderItem={({ item }) => <SaleItem data={item} />}
          />
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
                <Text style={{ fontSize: 10 }}>UGX</Text> {totalCost}
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
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>Balance</Text>
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
              <Text style={{ fontSize: 10 }}>UGX</Text>
              <Text style={{ fontSize: 17 }}>
                {" "}
                {recievedAmount === 0 ? 0 : recievedAmount - totalCost}
              </Text>
            </Text>
          </View>
        </View>

        <IconsComponent clear={clearEverything} />

        <TouchableOpacity
          style={{
            backgroundColor: Colors.dark,
            borderRadius: 5,
            height: 40,
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
            if (Number(recievedAmount) >= totalCost && selections.length > 0) {
              setLoading(true);
              postSales();
            }
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              alignSelf: "center",
              fontSize: 17,
            }}
          >
            Confirm Purchase
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
                  marginStart: 10,
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
                    fontSize: 16,
                    marginTop: 10,
                  }}
                >
                  Input quantity
                </Text>
              </View>

              <TextInput
                inputMode="numeric"
                onChangeText={(text) => setQuantity(text)}
                maxLength={3}
                style={{
                  backgroundColor: Colors.light_3,
                  borderRadius: 5,
                  padding: 6,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                    setShowModal(false);
                    setLoading(true);
                    setQuantity(null);
                    setTimeout(() => {
                      setLoading(false);
                    }, 1000);
                  }}
                />
              </View>
            </View>
          </Card>
        </ModalContent>
      </View>
    </BlackAndWhiteScreen>
  );
}

const DropdownComponent = ({
  products,
  handleChange,
  setLoading,
  makeSelection,
  setScanned,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={products}
        search
        maxHeight={250}
        labelField="productName"
        valueField="productName"
        placeholder={!isFocus ? "Select Product" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          setLoading(false);
          makeSelection(item);
          setValue(null);
        }}
        onChangeText={(text) => handleChange(text)}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setScanned()}
          style={{
            borderColor: Colors.primary,
            borderWidth: 1,
            height: 40,
            alignSelf: "center",
            marginStart: 8,
            padding: 10,
            justifyContent: "center",
            borderRadius: 5,
            paddingVertical: 24,
            marginBottom: 8,
          }}
        >
          <Image
            source={require("../assets/icons/icons8-barcode-24.png")}
            style={{
              width: 35,
              height: 35,
              tintColor: Colors.primary,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const IconsComponent = ({ clear }) => {
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
        }}
      >
        <FontAwesome name="credit-card" size={25} color="black" />
        <Text style={{ alignSelf: "center" }}>Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <FontAwesome name="mobile" size={25} color="black" />
        <Text style={{ alignSelf: "center" }}>Mobile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <FontAwesome name="wechat" size={25} color="black" />
        <Text style={{ alignSelf: "center" }}>Fap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors.light,
          borderRadius: 5,
          alignItems: "center",
          width: 63,
          height: 63,
        }}
      >
        <MaterialCommunityIcons
          name="hand-extended-outline"
          size={24}
          color="black"
        />
        <Text style={{ alignSelf: "center" }}>Credit</Text>
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

const SaleItem = ({ data }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.3,
        alignItems: "center",
        height: "fit-content",
        paddingVertical: 8,
      }}
    >
      <Text style={{ flex: 2.5, justifyContent: "center" }}>
        {data.productName}
      </Text>
      <Text style={{ flex: 1, textAlign: "center" }}>{data.salesPrice}</Text>
      <Text style={{ flex: 0.5, textAlign: "center" }}>{data.quantity}</Text>
      <Text style={{ flex: 1, textAlign: "center" }}>{data.totalCost}</Text>

      <TouchableOpacity>
        <Text style={{ fontWeight: 600 }}>X</Text>
      </TouchableOpacity>
    </View>
  );
};
export default SalesEntry;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  dropdown: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: Colors.primary,
    marginBottom: 8,
    width: "80%",
    alignSelf: "center",
  },
  icon: {
    marginRight: 5,
  },

  label: {
    position: "absolute",
    // backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

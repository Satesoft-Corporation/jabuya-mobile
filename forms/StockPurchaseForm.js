import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import { MyDropDown } from "../components/DropdownComponents";
import { BaseApiService } from "../utils/BaseApiService";
import { packageOptions } from "../constants/Constants";
import MaterialButton from "../components/MaterialButton";
import Loader from "../components/Loader";
import { KeyboardAvoidingView } from "react-native";
import { convertToServerDate, toReadableDate, hasNull } from "../utils/Utils";
import { DateCalender } from "../components/Dialogs/DateCalendar";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import TopHeader from "../components/TopHeader";
import Snackbar from "../components/Snackbar";

const StockPurchaseForm = ({ navigation, route }) => {
  const { userParams } = useContext(UserContext);

  // const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
  //   userParams;

  let shopOwnerId = 2453;
  // let isShopOwner = true;
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [isPackedProduct, setIsPackedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [batchNo, setBatchNo] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [packedPurchasedQuantity, setPackedPurchasedQuantity] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [unpackedPurchasedQty, setUnpackedPurchasedQty] = useState(null);
  const [errors, setErrors] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [dateToSelect, setDateToSelect] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [disable, setDisable] = useState(true);

  //

  const snackBarRef = useRef(null);
  const fetchShops = async () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      shopOwnerId: shopOwnerId,
    };
    new BaseApiService("/shops")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setShops(response.records);
        if (response.records.length === 1) {
          setSelectedShop(response.records[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchManufacturers = async () => {
    let searchParameters = { searchTerm: "", offset: 0, limit: 0 };
    new BaseApiService("/manufacturers")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setManufacturers(response.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchSuppliers = async () => {
    let searchParameters = { offset: 0, limit: 0 };
    new BaseApiService("/suppliers")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setSuppliers(response.records);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const fetchProducts = async (shopId, manufacturerId, setOwnerId = true) => {
    setIsPackedProduct(null);
    setSelectedProduct(null);
    setDisable(true);
    let searchParameters = { offset: 0, limit: 0 };
    setLoading(true);

    if (setOwnerId === true) {
      // seting the id coz some data may not return if its present during api call
      searchParameters.shopOwnerId = shopOwnerId;
    }

    if (shopId) {
      searchParameters.shopId = shopId;
    }

    if (manufacturerId) {
      searchParameters.manufacturerId = manufacturerId;
    }
    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
        setDisable(false);
        setLoading(false);
      })
      .catch((error) => {
        setDisable(false);
        setLoading(false);
      });
  };

  const makeShopSelection = (shop) => {
    setSelectedShop(shop);
  };

  const onManufacturerChange = (e) => {
    setSelectedManufacturer(e);
    fetchProducts("", e?.id, false);
  };

  const onProductChange = (pdt) => {
    setSelectedProduct(pdt);
  };

  const onSupplierChange = (e) => {
    setSelectedSupplier(e);
  };

  const clearForm = () => {
    setSelectedManufacturer(null);
    setBatchNo(null);
    setErrors(null);
    setExpiryDate(null);
    setPackedPurchasedQuantity(null);
    setPurchaseDate(null);
    setPurchasePrice(null);
    setSelectedProduct(null);
    setIsPackedProduct(null);
    setSelectedSupplier(null);
    setRemarks(null);
    setUnpackedPurchasedQty(null);
    setProducts([]);
    setSubmitted(false);
  };

  const handleDayPress = (day) => {
    setSelectedStartDate(day.dateString);
    dateToSelect === "expiry"
      ? setExpiryDate(day.dateString)
      : setPurchaseDate(day.dateString);
  };

  const handleCancel = () => {
    return true;
  };

  const saveStockEntry = () => {
    setSubmitted(true);
    setLoading(true);
    let payload;

    const isPacked = isPackedProduct && isPackedProduct === true;
    //setting payload basing on item package type
    if (isPacked === true) {
      payload = {
        batchNumber: batchNo,
        expiryDate: convertToServerDate(expiryDate),
        id: 0,
        manufacturerId: selectedManufacturer.id,
        packedPurchasedQuantity: Number(packedPurchasedQuantity),
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        purchasePrice: Number(purchasePrice),
        remarks: remarks || "",
        shopId: 2454,
        stockedOnDate: convertToServerDate(purchaseDate),
        supplierId: selectedSupplier.id,
        unpackedPurchase: false,
      };
    }

    if (isPacked === false) {
      payload = {
        shopId: selectedShop?.id,
        productId: selectedProduct?.productId,
        // packedPurchasedQuantity: stockEntry?.purchasedQuantity,
        productName: selectedProduct?.productName,
        purchasePrice: Number(purchasePrice),
        batchNumber: batchNo,
        expiryDate: convertToServerDate(expiryDate),
        unpackedPurchase: true,
        unpackedPurchasedQuantity: Number(unpackedPurchasedQty),
        remarks: remarks || "", //remarks is optional
        manufacturerId: selectedManufacturer?.id,
        productId: selectedProduct?.id,
        supplierId: selectedSupplier?.id,
        id: 0,
        stockedOnDate: convertToServerDate(purchaseDate),
      };
    }

    let isValidPayload = payload !== undefined && hasNull(payload) === false;

    if (isValidPayload === false) {
      setLoading(false); //removing loader if form is invalid
    }

    if (isValidPayload === true) {
      new BaseApiService("/stock-entries")
        .saveRequestWithJsonResponse(payload, false)
        .then((response) => {
          clearForm();
          setLoading(false);
          setSubmitted(false);
          snackBarRef.current.show("Stock entry saved successfully", 5000);
        })
        .catch((error) => {
          snackBarRef.current.show(error?.message, 5000);
          setSubmitted(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchShops();
    fetchManufacturers();
  }, []);

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={"height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <AppStatusBar />

        <TopHeader
          title="Stock purchase details"
          onBackPress={() => navigation.goBack()}
        />
        <Loader loading={loading}/>
        <ScrollView
          style={{
            paddingHorizontal: 8,
          }}
        >
          <View style={{ marginTop: 8, marginBottom: 5 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Shop
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              data={shops}
              onChange={makeShopSelection}
              value={selectedShop}
              placeholder="Select shop"
              labelField="name"
              valueField="id"
            />
            {submitted && !selectedShop && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Shop selection is required
              </Text>
            )}
          </View>

          <View>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Supplier
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              data={suppliers}
              onChange={onSupplierChange}
              value={selectedSupplier}
              placeholder="Select supplier"
              labelField="companyOrBusinessName"
              valueField="id"
            />
            {submitted && !selectedSupplier && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Supplier is required
              </Text>
            )}
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Manufacturer
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              data={manufacturers}
              onChange={onManufacturerChange}
              value={selectedManufacturer}
              placeholder="Select manufacuturer"
              labelField="name"
              valueField="id"
            />
            {submitted && !selectedManufacturer && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Manufacturer is required
              </Text>
            )}
          </View>

          <View style={{}}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Product
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              disable={disable}
              data={products}
              onChange={onProductChange}
              value={selectedShop}
              placeholder="Select product"
              labelField="productName"
              valueField="id"
            />
            {submitted && !selectedProduct && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Product is required
              </Text>
            )}
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Package type
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              data={packageOptions}
              disable={selectedProduct === null}
              value={isPackedProduct}
              onChange={(e) => {
                setIsPackedProduct(e.type);
              }}
              placeholder="Select package type"
              labelField="value"
              valueField="type"
            />
            {submitted && !isPackedProduct && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Package type is required
              </Text>
            )}
          </View>

          {isPackedProduct !== null && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    marginVertical: 3,
                    marginStart: 6,
                  }}
                >
                  {isPackedProduct === true
                    ? `Packed quantity (${
                        selectedProduct?.packageUnitName || ""
                      })`
                    : "Unpacked quantity"}
                </Text>
                <TextInput
                  value={
                    isPackedProduct === true
                      ? packedPurchasedQuantity
                      : unpackedPurchasedQty
                  }
                  cursorColor={Colors.dark}
                  onChangeText={(text) => {
                    isPackedProduct === true
                      ? setPackedPurchasedQuantity(text)
                      : setUnpackedPurchasedQty(text);
                  }}
                  inputMode="numeric"
                  style={{
                    backgroundColor: Colors.light,
                    borderRadius: 5,
                    padding: 6,
                    borderWidth: 0.6,
                    borderColor: Colors.dark,
                    paddingHorizontal: 10,
                    textAlign: "center",
                  }}
                />
                {submitted &&
                  (!unpackedPurchasedQty || !packedPurchasedQuantity) && (
                    <Text
                      style={{
                        fontSize: 12,
                        marginStart: 6,
                        color: Colors.error,
                      }}
                    >
                      Quantity is required
                    </Text>
                  )}
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    marginVertical: 3,
                    marginStart: 6,
                  }}
                >
                  {isPackedProduct === true
                    ? "Purchase price"
                    : "Purchase amount"}{" "}
                  (UGX)
                </Text>
                <TextInput
                  value={purchasePrice}
                  cursorColor={Colors.dark}
                  onChangeText={(text) => setPurchasePrice(text)}
                  inputMode="numeric"
                  style={{
                    backgroundColor: Colors.light,
                    borderRadius: 5,
                    padding: 6,
                    borderWidth: 0.6,
                    borderColor: Colors.dark,
                    paddingHorizontal: 10,
                    textAlign: "right",
                  }}
                />
                {submitted && !purchasePrice && (
                  <Text
                    style={{
                      fontSize: 12,
                      marginStart: 6,
                      color: Colors.error,
                    }}
                  >
                    Price is required
                  </Text>
                )}
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Batch no.
              </Text>
              <TextInput
                value={batchNo}
                onChangeText={(text) => setBatchNo(text)}
                cursorColor={Colors.dark}
                inputMode="text"
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 0.6,
                  borderColor: Colors.dark,
                  paddingHorizontal: 10,
                  textAlign: "center",
                }}
              />
              {submitted && !batchNo && (
                <Text
                  style={{
                    fontSize: 12,
                    marginStart: 6,
                    color: Colors.error,
                  }}
                >
                  Batch number is required
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Expiry date{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                  setDateToSelect("expiry");
                }}
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 0.6,
                  borderColor: Colors.dark,
                  paddingHorizontal: 10,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  {toReadableDate(expiryDate)}
                </Text>
              </TouchableOpacity>
              {submitted && !expiryDate && (
                <Text
                  style={{
                    fontSize: 12,
                    marginStart: 6,
                    color: Colors.error,
                  }}
                >
                  Expiry date is required
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Unit sales price
              </Text>
              <TouchableOpacity
                disabled
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 0.6,
                  borderColor: Colors.dark,
                  paddingHorizontal: 10,
                  height: 40,
                }}
              ></TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 6,
                }}
              >
                Purchase date{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                  setDateToSelect("purchase");
                }}
                style={{
                  backgroundColor: Colors.light,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 0.6,
                  borderColor: Colors.dark,
                  paddingHorizontal: 10,
                  height: 40,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  {toReadableDate(purchaseDate)}
                </Text>
              </TouchableOpacity>
              {submitted && !purchaseDate && (
                <Text
                  style={{
                    fontSize: 12,
                    marginStart: 6,
                    color: Colors.error,
                  }}
                >
                  Purchase date is required
                </Text>
              )}
            </View>
          </View>

          <View>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 6,
              }}
            >
              Remarks
            </Text>
            <TextInput
              value={remarks}
              onChangeText={(text) => setRemarks(text)}
              cursorColor={Colors.dark}
              multiline
              style={{
                backgroundColor: Colors.light,
                borderRadius: 5,
                padding: 6,
                borderWidth: 0.6,
                borderColor: Colors.dark,
                paddingHorizontal: 10,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 30,
              gap: 10,
            }}
          >
            <MaterialButton
              title="Clear"
              style={{
                backgroundColor: "transparent",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.dark,
              }}
              buttonPress={clearForm}
            />
            <MaterialButton
              disabled={loading}
              title="Save"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={saveStockEntry}
            />
          </View>
        </ScrollView>
        <Snackbar ref={snackBarRef} />

        <DateCalender
          singleSelection={true}
          selectedEndDate={selectedEndDate}
          visible={visible}
          selectedStartDate={selectedStartDate}
          handleDayPress={handleDayPress}
          setVisible={setVisible}
          onFinish={() => setVisible(false)}
          setSelectedEndDate={setSelectedEndDate}
          setSelectedStartDate={setSelectedStartDate}
          moreCancelActions={handleCancel}
          setFiltering={() => {}}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default StockPurchaseForm;

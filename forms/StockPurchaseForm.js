import { View, Text, TextInput, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import AppStatusBar from "../components/AppStatusBar";
import HeaderOneButton from "../components/HeaderOneButton";
import { ShopSelectionDropdown } from "../components/DropdownComponents";
import { MyDropDown } from "../components/DropdownComponents";
import { BaseApiService } from "../utils/BaseApiService";
import { packageOptions } from "../constants/Constants";
import MaterialButton from "../components/MaterialButton";
import Loader from "../components/Loader";
import { KeyboardAvoidingView } from "react-native";
const StockPurchaseForm = ({ route }) => {
  // const { isShopOwner, shopOwnerId } = route.params;

  let emptyStockEntry = {
    id: 0,
    serialNumber: "",
    productName: "",
    productId: null,
    purchasedQuantity: 0,
    purchasePrice: 0,
    batchNumber: "",
    expiryDate: null,
    unpackedProduct: false,
    unpackedQuantity: 0,
    unpackedUnitPrice: 0,
    supplierName: "",
    supplierId: null,
    distributorId: null,
    shopId: null,
    productUnitPrice: 0,
    purchasedValue: 0,
    remarks: "",
  };

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
  const [loading, setLoading] = useState(false);

  //
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
      })
      .catch((error) => {});
  };

  const fetchManufacturers = async () => {
    let searchParameters = { searchTerm: "", offset: 0, limit: 0 };
    new BaseApiService("/manufacturers")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setManufacturers(response.records);
      })
      .catch((error) => {});
  };

  const fetchSuppliers = async () => {
    let searchParameters = { searchTerm: "", offset: 0, limit: 0 };
    new BaseApiService("/suppliers")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setSuppliers(response.records);
      })
      .catch((error) => {});
  };

  const fetchProducts = async (shopId, manufacturerId, setOwnerId = true) => {
    let searchParameters = { offset: 0, limit: 0 };

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
      })
      .catch((error) => {});
  };

  const makeShopSelection = (shop) => {
    setSelectedShop(shop);
    fetchProducts(shop.id);
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

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={"height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light_2 }}>
        <AppStatusBar bgColor={Colors.dark} content={"light-content"} />

        <Loader loading={loading} />
        <View
          style={{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: Colors.dark,
          }}
        >
          <Text style={{ color: Colors.light, fontSize: 18 }}>
            Stock Information
          </Text>
        </View>
        <ScrollView
          style={{
            paddingHorizontal: 8,
          }}
        >
          <View>
            <Text style={{ marginVertical: 8 }}>Shop</Text>
            <ShopSelectionDropdown
              value={selectedShop}
              makeShopSelection={makeShopSelection}
              shops={shops}
              disable={false}
            />
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 2,
              }}
            >
              Manufacturer
            </Text>
            <MyDropDown
              data={manufacturers}
              onChange={onManufacturerChange}
              value={selectedManufacturer}
              placeholder="Select Manufacuturer"
              labelField="name"
              valueField="name"
            />
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 2,
              }}
            >
              Supplier
            </Text>
            <MyDropDown
              data={suppliers}
              onChange={onSupplierChange}
              value={selectedSupplier}
              placeholder="Select Supplier"
              labelField="name"
              valueField="name"
            />
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 2,
              }}
            >
              Product
            </Text>
            <MyDropDown
              data={products}
              onChange={onProductChange}
              value={selectedShop}
              placeholder="Select Product"
              labelField="name"
              valueField="name"
            />
          </View>

          <View style={{ marginVertical: 8 }}>
            <Text
              style={{
                marginVertical: 3,
                marginStart: 2,
              }}
            >
              Package type
            </Text>
            <MyDropDown
              data={packageOptions}
              disabled={selectedProduct === null}
              value={isPackedProduct}
              onChange={(e) => {
                setIsPackedProduct(e);
              }}
              placeholder="Select package type"
              labelField="value"
              valueField="name"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 8,
              gap: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 2,
                }}
              >
                Batch no.
              </Text>
              <TextInput
                inputMode="numeric"
                style={{
                  backgroundColor: Colors.light_3,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 1,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginVertical: 3,
                  marginStart: 2,
                }}
              >
                Expiry date{" "}
              </Text>
              <TextInput
                style={{
                  backgroundColor: Colors.light_3,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 1,
                }}
              />
            </View>
          </View>

          <View>
            <Text>Remarks</Text>
            <TextInput
              multiline
              style={{
                backgroundColor: Colors.light_3,
                borderRadius: 5,
                padding: 6,
                borderWidth: 1,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 5,
              gap: 5,
            }}
          >
            <MaterialButton
              title="Cancel"
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
              buttonPress={() => {}}
            />
            <MaterialButton
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
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default StockPurchaseForm;

import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Colors from "../../../constants/Colors";
import AppStatusBar from "../../../components/AppStatusBar";
import { MyDropDown } from "../../../components/DropdownComponents";
import { BaseApiService } from "../../../utils/BaseApiService";
import Loader from "../../../components/Loader";
import { KeyboardAvoidingView } from "react-native";
import { hasNull } from "../../..//utils/Utils";
import { UserContext } from "../../../context/UserContext";
import { useContext } from "react";
import TopHeader from "../../../components/TopHeader";
import Snackbar from "../../../components/Snackbar";
import PrimaryButton from "../../../components/buttons/PrimaryButton";

const ProductEntry = ({ navigation, route }) => {
  const { selectedShop } = useContext(UserContext);

  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [disable, setDisable] = useState(false);
  const [saleUnits, setSaleUnits] = useState([]);
  const [selectedSaleUnit, setSelecetedSaleUnit] = useState(false);
  const [salesPrice, setSalesPrice] = useState("");

  //

  const snackBarRef = useRef(null);

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

  const fetchSaleUnits = async () => {
    let searchParameters = {
      offset: 0,
      limit: 0,
      commaSeparatedTypeIds: [4],
    };
    new BaseApiService("/lookups/lookup-values")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setSaleUnits(response.records);
      })
      .catch((error) => {});
  };

  const fetchProducts = async (manufacturerId) => {
    setSelectedProduct(null);
    setDisable(true);

    let searchParameters = { offset: 0, limit: 0 };
    setLoading(true);

    if (manufacturerId) {
      searchParameters.manufacturerId = manufacturerId;
    }
    new BaseApiService("/products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        setProducts(response.records);
        setDisable(false);
        setLoading(false);
      })
      .catch((error) => {
        setDisable(false);
        setLoading(false);
        snackBarRef.current.show("Falied to fetch products, try again");
      });
  };

  const onManufacturerChange = (e) => {
    setSelectedManufacturer(e);
    fetchProducts(e?.id);
  };

  const onProductChange = (pdt) => {
    setSelectedProduct(pdt);
  };

  const clearForm = () => {
    setSelectedManufacturer(null);
    setSelectedProduct(null);
    setRemarks(null);
    setProducts([]);
    setSubmitted(false);
    setSalesPrice("");
  };

  const saveProduct = () => {
    setSubmitted(true);
    setLoading(true);
    setDisable(true);

    let payload = {
      manufacturerId: selectedManufacturer?.id,
      shopId: selectedShop?.id,
      productId: selectedProduct?.id,
      saleUnitId: selectedSaleUnit?.id,
      salesPrice: Number(salesPrice),
      remarks: remarks || "",
      hasMultipleSaleUnits: false,
    };

    const apiUrl = "/shop-products";

    let isValidPayload = hasNull(payload) === false;

    if (isValidPayload === false) {
      setLoading(false); //removing loader if form is invalid
    }

    if (isValidPayload === true) {
      new BaseApiService(apiUrl)
        .saveRequestWithJsonResponse(payload, false)
        .then((response) => {
          clearForm();
          setLoading(false);
          setSubmitted(false);
          snackBarRef.current.show("Product saved successfully", 5000);
          setDisable(false);
        })
        .catch((error) => {
          snackBarRef.current.show(error?.message, 5000);
          setSubmitted(false);
          setLoading(false);
          setDisable(false);
        });
    }
  };

  useEffect(() => {
    fetchManufacturers();
    fetchSaleUnits();
  }, []);

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={"height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: Colors.light }}>
        <AppStatusBar />

        <TopHeader
          title="Add product"
          
        />
        <Loader loading={loading} />
        <ScrollView
          style={{
            paddingHorizontal: 8,
          }}
        >
          <Text
            style={{
              marginVertical: 10,
              fontWeight: 500,
              fontSize: 16,
              marginStart: 5,
            }}
          >
            Enter product detail
          </Text>

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
              labelField="displayName"
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
              Sale unit
            </Text>
            <MyDropDown
              style={{
                backgroundColor: Colors.light,
                borderColor: Colors.dark,
              }}
              data={saleUnits}
              onChange={(e) => setSelecetedSaleUnit(e)}
              value={selectedManufacturer}
              placeholder="Select sale unit"
              labelField="value"
              valueField="id"
            />
            {submitted && !selectedSaleUnit && (
              <Text
                style={{
                  fontSize: 12,
                  marginStart: 6,
                  color: Colors.error,
                }}
              >
                Sale unit is required
              </Text>
            )}
          </View>

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
                Sales prie
              </Text>
              <TextInput
                value={salesPrice}
                onChangeText={(text) => setSalesPrice(text)}
                cursorColor={Colors.dark}
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
              {submitted && salesPrice.trim() === "" && (
                <Text
                  style={{
                    fontSize: 12,
                    marginStart: 6,
                    color: Colors.error,
                  }}
                >
                  Sales price is required
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
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 8,
            gap: 10,
            marginBottom: 10,
          }}
        >
          <PrimaryButton darkMode={false} title={"Clear"} onPress={clearForm} />
          <PrimaryButton
            title={"Save"}
            onPress={saveProduct}
            disabled={disable}
          />
        </View>
        <Snackbar ref={snackBarRef} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProductEntry;

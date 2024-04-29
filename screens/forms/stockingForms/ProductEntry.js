import { View, Text, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Colors from "../../../constants/Colors";
import AppStatusBar from "../../../components/AppStatusBar";
import { MyDropDown } from "../../../components/DropdownComponents";
import { BaseApiService } from "../../../utils/BaseApiService";
import Loader from "../../../components/Loader";
import { hasNull } from "../../..//utils/Utils";
import { UserContext } from "../../../context/UserContext";
import { useContext } from "react";
import TopHeader from "../../../components/TopHeader";
import Snackbar from "../../../components/Snackbar";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import MyInput from "../../../components/MyInput";
import ChipButton from "../../../components/buttons/ChipButton";
import { FlatList } from "react-native";

const ProductEntry = () => {
  const { selectedShop } = useContext(UserContext);

  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [disable, setDisable] = useState(false);
  const [saleUnits, setSaleUnits] = useState([]);
  const [selectedSaleUnit, setSelectedSaleUnit] = useState(null);
  const [selectedSaleUnits, setSelectedSaleUnits] = useState([]);

  const [salesPrice, setSalesPrice] = useState("");

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

  const onSaleUnitSelect = (unit) => {
    const { saleUnitName, id } = unit;

    let itemUnit = {
      id: 0,
      productSaleUnitId: id,
      unitPrice: "",
      saleUnitName,
    };

    const isSelected = selectedSaleUnits?.find(
      (item) => item.productSaleUnitId === id
    );

    if (isSelected) {
      const newList = selectedSaleUnits.filter(
        (item) => item.productSaleUnitId !== id
      );

      setSelectedSaleUnits([...newList]);
    } else {
      setSelectedSaleUnits((prevSaleUnits) => [...prevSaleUnits, itemUnit]);
    }
  };

  const handleSaleUnitChange = (e) => {
    setSelectedSaleUnit(e);
    const newList = selectedSaleUnits.filter(
      (item) => item.productSaleUnitId !== e?.id
    );

    setSelectedSaleUnits(newList);
  };

  const handleUnitPriceChange = (index, value) => {
    const updatedLineItems = [...selectedSaleUnits];
    updatedLineItems[index].unitPrice = value;
    setSelectedSaleUnits([...updatedLineItems]);
  };

  const onManufacturerChange = (e) => {
    setSelectedManufacturer(e);
    fetchProducts(e?.id);
  };

  const onProductChange = (e) => {
    let { multipleSaleUnits } = e;
    setSelectedProduct(e);
    setSelectedSaleUnit(
      multipleSaleUnits?.find((item) => item?.saleUnitId === 2205)
    );
    if (multipleSaleUnits) {
      setSaleUnits(multipleSaleUnits);
    } else {
      setSaleUnits([]);
      setSelectedSaleUnits([]);
    }
  };

  const clearForm = () => {
    setSelectedManufacturer(null);
    setSelectedProduct(null);
    setRemarks("");
    setProducts([]);
    setSubmitted(false);
    setSalesPrice("");
    setSelectedSaleUnits([]);
    setSaleUnits([]);
  };

  const saveProduct = () => {
    setSubmitted(true);
    setLoading(true);

    let payload = {
      manufacturerId: selectedManufacturer?.id,
      shopId: selectedShop?.id,
      productId: selectedProduct?.id,
      saleUnitId: selectedSaleUnit?.saleUnitId,
      salesPrice: Number(salesPrice),
      remarks: remarks || "",
      hasMultipleSaleUnits: selectedSaleUnits.length > 0,
      multipleSaleUnits: selectedSaleUnits,
    };

    const apiUrl = "/shop-products";

    let isValidPayload = hasNull(payload) === false && salesPrice.trim() !== "";

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
  }, []);

  return (
    <KeyboardAvoidingView
      enabled={true}
      behavior={"height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <AppStatusBar />

        <TopHeader title="List product" />
        <Loader loading={loading} />
        <View
          style={{
            paddingHorizontal: 8,
            gap: 8,
            paddingBottom: 30,
          }}
        >
          <Text style={styles.headerText}>Enter product details</Text>

          <View>
            <Text style={styles.inputLabel}>Manufacturer</Text>
            <MyDropDown
              style={styles.dropDown}
              data={manufacturers}
              onChange={onManufacturerChange}
              value={selectedManufacturer}
              placeholder="Select manufacuturer"
              labelField="name"
              valueField="id"
            />
            {submitted && !selectedManufacturer && (
              <Text style={styles.errorText}>Manufacturer is required</Text>
            )}
          </View>

          <View>
            <Text style={styles.inputLabel}>Product</Text>
            <MyDropDown
              style={styles.dropDown}
              disable={disable}
              data={products}
              onChange={onProductChange}
              value={selectedShop}
              placeholder="Select product"
              labelField="displayName"
              valueField="id"
            />
            {submitted && !selectedProduct && (
              <Text style={styles.errorText}>Product is required</Text>
            )}
          </View>

          <FlatList
            data={saleUnits?.filter(
              (item) => item?.saleUnitName !== selectedSaleUnit?.saleUnitName
            )}
            ListHeaderComponent={() =>
              saleUnits?.length > 1 && (
                <Text style={styles.inputLabel}>Container portions</Text>
              )
            }
            renderItem={({ item }) => (
              <ChipButton
                isSelected={selectedSaleUnits?.find(
                  (unit) => item?.saleUnitName === unit?.saleUnitName
                )}
                key={item.saleUnitName}
                onPress={() => onSaleUnitSelect(item)}
                title={item?.saleUnitName}
                style={{ width: "fit-content" }}
              />
            )}
            keyExtractor={(item) => item.saleUnitName.toString()}
            numColumns={3}
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Sale unit</Text>
              <MyDropDown
                style={styles.dropDown}
                data={saleUnits}
                onChange={handleSaleUnitChange}
                value={selectedSaleUnit}
                placeholder="Select sale unit"
                labelField="saleUnitName"
                valueField="id"
                search={false}
              />
              {submitted && !selectedSaleUnit && (
                <Text style={styles.errorText}>Sale unit is required</Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <MyInput
                label={<Text style={styles.inputLabel}>Selling price</Text>}
                value={salesPrice}
                onValueChange={(text) => setSalesPrice(text)}
                inputMode="numeric"
              />

              {submitted && salesPrice.trim() === "" && (
                <Text style={styles.errorText}>Sales price is required</Text>
              )}
            </View>
          </View>

          {selectedSaleUnits?.map((item, index) => (
            <View style={styles.row} key={item?.saleUnitName}>
              <View style={{ flex: 1 }}>
                <MyInput label="" value={item?.saleUnitName} editable={false} />
              </View>
              <View style={{ flex: 1 }}>
                <MyInput
                  label=""
                  value={item.unitPrice}
                  onValueChange={(e) => handleUnitPriceChange(index, e.value)}
                />
              </View>
            </View>
          ))}
          <View>
            <MyInput
              label="Remarks"
              value={remarks}
              onValueChange={(text) => setRemarks(text)}
              multiline
            />
          </View>
        </View>
        <View style={styles.bottomContent}>
          <PrimaryButton darkMode={false} title={"Clear"} onPress={clearForm} />
          <PrimaryButton
            title={"Save"}
            onPress={saveProduct}
            disabled={disable}
          />
        </View>
        <Snackbar ref={snackBarRef} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ProductEntry;

const styles = StyleSheet.create({
  headerText: {
    marginVertical: 10,
    fontWeight: "500",
    fontSize: 16,
    marginStart: 5,
  },
  inputLabel: {
    marginVertical: 3,
    marginStart: 6,
    marginTop: 5,
  },
  dropDown: {
    backgroundColor: Colors.light,
    borderColor: Colors.dark,
  },
  errorText: {
    fontSize: 12,
    marginStart: 6,
    color: Colors.error,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    gap: 10,
    marginBottom: 10,
  },
});

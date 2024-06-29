import { View, Text, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { userData } from "context/UserContext";
import { BaseApiService } from "@utils/BaseApiService";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";
import { hasNull } from "@utils/Utils";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import Loader from "@components/Loader";
import { MyDropDown } from "@components/DropdownComponents";
import { FlatList } from "react-native";
import ChipButton from "@components/buttons/ChipButton";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Colors from "@constants/Colors";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import MyInput from "@components/MyInput";
import Snackbar from "@components/Snackbar";

const ProductEntry = ({ route }) => {
  const { selectedShop, offlineParams, shops, setSelectedShop } = userData();

  const [edit, setEdit] = useState(false);
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
    await new BaseApiService("/manufacturers")
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
    await new BaseApiService("/products")
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
      unitPrice: "0",
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
    const { multipleSaleUnits } = e;

    setSelectedProduct(e);
    const itemToEdit = route?.params;

    if (multipleSaleUnits) {
      setSaleUnits(multipleSaleUnits);

      if (itemToEdit) {
        const defaultUnit = multipleSaleUnits.find(
          (unit) => unit?.saleUnitName === itemToEdit?.saleUnitName
        );
        setSelectedSaleUnit(defaultUnit);
        setRemarks(itemToEdit?.remarks);
        setSalesPrice(String(itemToEdit?.salesPrice));

        if (itemToEdit?.hasMultipleSaleUnits) {
          setSelectedSaleUnits(itemToEdit?.multipleSaleUnits);
        }
      } else {
        setSelectedSaleUnit(
          multipleSaleUnits?.find((item) => item?.saleUnitId === 2205) //if it contains Whole
        );
      }
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

  const populateForm = () => {
    if (route.params) {
      const record = { ...route.params };
      setEdit(true);
      fetchProductDetails(record?.productId);
    } else {
      fetchManufacturers();
    }
  };

  const fetchProductDetails = async (id) => {
    await new BaseApiService(`/products/${id}`)
      .getRequestWithJsonResponse()
      .then(async (response) => {
        setEdit(true);

        const { manufacturerName, manufacturerId } = response;
        setSelectedManufacturer({ name: manufacturerName, id: manufacturerId });
        onProductChange(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        snackBarRef.current.show("Error fetching product infomation");
      });
  };

  const saveProduct = () => {
    setSubmitted(true);
    setLoading(true);

    let payload = {
      manufacturerId: selectedManufacturer?.id,
      shopId: edit ? route?.params?.shopId : selectedShop?.id,
      productId: selectedProduct?.id,
      saleUnitId: selectedSaleUnit?.saleUnitId,
      salesPrice: Number(salesPrice),
      remarks: remarks || "",
      hasMultipleSaleUnits: selectedSaleUnits.length > 0,
      multipleSaleUnits: selectedSaleUnits,
    };

    const apiUrl = edit
      ? `${SHOP_PRODUCTS_ENDPOINT}/${route?.params?.id}`
      : SHOP_PRODUCTS_ENDPOINT;

    let isValidPayload = hasNull(payload) === false && salesPrice.trim() !== "";

    if (isValidPayload === false) {
      setLoading(false); //removing loader if form is invalid
    }
    if (isValidPayload === true) {
      new BaseApiService(apiUrl)
        .saveRequestWithJsonResponse(payload, edit)
        .then(async (response) => {
          if (!edit) {
            clearForm();
          }
          setLoading(false);
          setSubmitted(false);
          snackBarRef.current.show("Product saved successfully", 6000);
          await saveShopProductsOnDevice(offlineParams, true);
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
    populateForm();
  }, []);

  return (
    <KeyboardAvoidingView enabled={true} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
        <AppStatusBar />

        <TopHeader title="List product" />
        <Loader loading={loading} />
        <View
          style={{
            paddingHorizontal: 8,
            gap: 8,
            paddingBottom: 30,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <Text style={styles.headerText}>Enter product details</Text>

            {!edit && (
              <View style={{ gap: 5 }}>
                <Text>Shop</Text>
                <MyDropDown
                  search={false}
                  style={{
                    backgroundColor: Colors.light,
                    borderColor: Colors.dark,
                  }}
                  data={shops?.filter((shop) => !shop?.name?.includes("All"))}
                  value={selectedShop}
                  onChange={(e) => {
                    setSelectedShop(e);
                  }}
                  placeholder="Select Shop"
                  labelField="name"
                  valueField="id"
                />
              </View>
            )}

            <View>
              <Text style={styles.inputLabel}>Manufacturer</Text>
              <MyDropDown
                style={styles.dropDown}
                data={edit ? [{ ...selectedManufacturer }] : manufacturers}
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
                data={edit ? [{ ...selectedProduct }] : products}
                onChange={onProductChange}
                value={selectedProduct}
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
                (item) =>
                  item?.productSaleUnitName !==
                    selectedSaleUnit?.productSaleUnitName ||
                  item?.saleUnitName !== selectedSaleUnit?.saleUnitName
              )}
              ListHeaderComponent={() =>
                saleUnits?.length > 1 && (
                  <Text style={styles.inputLabel}>Container portions</Text>
                )
              }
              renderItem={({ item }) => (
                <ChipButton
                  isSelected={selectedSaleUnits?.find(
                    (unit) =>
                      item?.saleUnitName === unit?.productSaleUnitName ||
                      item?.saleUnitName === unit?.saleUnitName
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
              <View style={styles.row} key={index}>
                <View style={{ flex: 1 }}>
                  <MyInput
                    label=""
                    value={item.saleUnitName || item?.productSaleUnitName}
                    editable={false}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <MyInput
                    label=""
                    value={item.unitPrice}
                    onValueChange={(e) => handleUnitPriceChange(index, e)}
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
            <PrimaryButton
              darkMode={false}
              title={"Clear"}
              onPress={clearForm}
            />
            <PrimaryButton
              title={"Save"}
              onPress={saveProduct}
              disabled={disable}
            />
          </View>
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
    gap: 10,
  },
});

import { View, Text, Image } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";
import { hasNull, isNotEmpty } from "@utils/Utils";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
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
import { getOfflineParams, getSelectedShop, getShops } from "duqactStore/selectors";
import { useDispatch, useSelector } from "react-redux";
import { changeSelectedShop } from "actions/shopActions";
import { useNavigation } from "@react-navigation/native";
import { STOCK_LEVELS } from "@navigation/ScreenNames";
import { ScrollView } from "react-native";
import { getCanCreateUpdateMyShopStock } from "duqactStore/selectors/permissionSelectors";
import NoAuth from "@screens/Unauthorised";
import Icon from "@components/Icon";

const ProductEntry = ({ route }) => {
  const selectedShop = useSelector(getSelectedShop);
  const offlineParams = useSelector(getOfflineParams);
  const shops = useSelector(getShops);
  const canDoStockCrud = useSelector(getCanCreateUpdateMyShopStock);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [edit, setEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdtLoadng, setPdtLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [customName, setCustomName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [disable, setDisable] = useState(false);
  const [saleUnits, setSaleUnits] = useState([]);
  const [selectedSaleUnit, setSelectedSaleUnit] = useState(null);
  const [selectedSaleUnits, setSelectedSaleUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [salesPrice, setSalesPrice] = useState("");

  const snackBarRef = useRef(null);

  const fetchProducts = async () => {
    if (!route.params) {
      if (searchTerm?.length >= 3) {
        setPdtLoading(true);
        const searchParameters = { offset: 0, limit: 20, ...(searchTerm && { searchTerm: searchTerm.trim() }) };
        await new BaseApiService("/products")
          .getRequestWithJsonResponse(searchParameters)
          .then(async (response) => {
            setProducts(response.records);
            setDisable(false);
            setPdtLoading(false);
          })
          .catch((error) => {
            setDisable(false);
            setPdtLoading(false);
            snackBarRef.current.show("Falied to fetch products, try again");
          });
      }
    }
  };

  const onSaleUnitSelect = (unit) => {
    const { saleUnitName, id } = unit;

    let itemUnit = { id: 0, productSaleUnitId: id, unitPrice: "0", saleUnitName };
    const isSelected = selectedSaleUnits?.find((item) => item.productSaleUnitId === id);

    if (isSelected) {
      const newList = selectedSaleUnits.filter((item) => item.productSaleUnitId !== id);

      setSelectedSaleUnits([...newList]);
    } else {
      setSelectedSaleUnits((prevSaleUnits) => [...prevSaleUnits, itemUnit]);
    }
  };

  const handleSaleUnitChange = (e) => {
    setSelectedSaleUnit(e);
    const newList = selectedSaleUnits.filter((item) => item.productSaleUnitId !== e?.id);

    setSelectedSaleUnits(newList);
  };

  const handleUnitPriceChange = (index, value) => {
    const updatedLineItems = [...selectedSaleUnits];
    updatedLineItems[index].unitPrice = value;
    setSelectedSaleUnits([...updatedLineItems]);
  };

  const onProductChange = (e) => {
    const { multipleSaleUnits } = e;

    setSelectedProduct(e);

    const itemToEdit = route?.params;

    if (multipleSaleUnits) {
      setSaleUnits(multipleSaleUnits);

      if (itemToEdit) {
        const defaultUnit = multipleSaleUnits.find((unit) => unit?.saleUnitName === itemToEdit?.saleUnitName);
        setSelectedSaleUnit(defaultUnit);
        setRemarks(itemToEdit?.remarks);
        setCustomName(itemToEdit?.customName || "");
        setSalesPrice(String(itemToEdit?.salesPrice));

        if (itemToEdit?.hasMultipleSaleUnits) {
          setSelectedSaleUnits(itemToEdit?.multipleSaleUnits);
        }
      } else {
        setSelectedSaleUnit(multipleSaleUnits?.find((item) => item?.saleUnitId === 2205));
      }
    } else {
      setSaleUnits([]);
      setSelectedSaleUnits([]);
    }
  };

  const clearForm = () => {
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
      setEdit(true);
      setLoading(true);
      const record = { ...route.params };
      fetchProductDetails(record?.productId);
    }
  };

  const fetchProductDetails = async (id) => {
    await new BaseApiService(`/products/${id}`)
      .getRequestWithJsonResponse()
      .then(async (response) => {
        setEdit(true);
        onProductChange(response);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        snackBarRef.current.show("Error fetching product infomation");
      });
  };

  const saveProduct = async () => {
    setSubmitted(true);
    setLoading(true);

    let payload = {
      id: route.params?.id || 0,
      manufacturerId: selectedProduct?.manufacturerId,
      shopId: edit ? route?.params?.shopId : selectedShop?.id,
      productId: selectedProduct?.id,
      saleUnitId: selectedSaleUnit?.saleUnitId,
      salesPrice: Number(salesPrice),
      remarks: remarks || "",
      hasMultipleSaleUnits: selectedSaleUnits.length > 0,
      multipleSaleUnits: selectedSaleUnits,
      customName: customName,
    };

    let isValidPayload = hasNull(payload) === false && salesPrice.trim() !== "";

    if (isValidPayload === false) {
      setLoading(false); //removing loader if form is invalid
    }
    if (isValidPayload === true) {
      await new BaseApiService(SHOP_PRODUCTS_ENDPOINT)
        .saveRequestWithJsonResponse(payload, false)
        .then(async (response) => {
          await saveShopProductsOnDevice(offlineParams);
          setLoading(false);
          setSubmitted(false);
          //clearForm();

          snackBarRef.current.show("Product saved successfully", 9000);

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

  const renderItem = (item) => {
    return (
      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingVertical: 10, alignItems: "center" }}>
        {isNotEmpty(item?.imageUrl) ? (
          <Image source={{ uri: item?.imageUrl }} style={{ width: 70, height: 40 }} />
        ) : (
          <Icon name="file-image" groupName="FontAwesome6" size={25} color={Colors.gray} style={{ paddingHorizontal: 10 }} />
        )}
        <View>
          <Text style={{ fontWeight: "bold" }}>{item?.displayName}</Text>
          <Text>By: {item?.manufacturerName}</Text>
          {item?.barcode && <Text>Barcode: {item?.barcode}</Text>}
        </View>
      </View>
    );
  };

  useEffect(() => {
    populateForm();
    fetchProducts();
  }, [searchTerm]);

  if (!canDoStockCrud) {
    return <NoAuth />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <TopHeader title="List product" showMenuDots menuItems={[{ name: "Products", onClick: () => navigation.navigate(STOCK_LEVELS) }]} />

      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{ justifyContent: "space-between", paddingBottom: 30, gap: 20 }} style={{ paddingHorizontal: 10 }}>
        <View style={{ gap: 8 }}>
          <Text style={styles.headerText}>Enter product details</Text>

          {!edit && shops?.length > 1 && (
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
                  dispatch(changeSelectedShop(e));
                }}
                placeholder="Select Shop"
                labelField="name"
                valueField="id"
              />
            </View>
          )}

          <MyDropDown
            style={styles.dropDown}
            disable={disable}
            label={"Product"}
            data={edit ? [{ ...selectedProduct }] : products}
            onChange={onProductChange}
            value={selectedProduct}
            placeholder="Select product"
            labelField="displayName"
            valueField="id"
            showError
            required
            isSubmitted={submitted}
            renderItem={renderItem}
            loading={pdtLoadng}
            onChangeText={(t) => {
              if (t && t !== "") {
                setSearchTerm(t);
              }
            }}
          />

          <MyInput value={customName} onValueChange={(e) => setCustomName(e)} label="Custom name" />

          {saleUnits?.length > 1 && (
            <FlatList
              data={saleUnits?.filter(
                (item) => item?.productSaleUnitName !== selectedSaleUnit?.productSaleUnitName || item?.saleUnitName !== selectedSaleUnit?.saleUnitName
              )}
              ListHeaderComponent={() => saleUnits?.length > 1 && <Text style={styles.inputLabel}>Container portions</Text>}
              renderItem={({ item }) => (
                <ChipButton
                  isSelected={selectedSaleUnits?.find(
                    (unit) => item?.saleUnitName === unit?.productSaleUnitName || item?.saleUnitName === unit?.saleUnitName
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
          )}
          <View style={styles.row}>
            <MyDropDown
              data={saleUnits}
              label={"Sale unit"}
              onChange={handleSaleUnitChange}
              value={selectedSaleUnit}
              placeholder="Select sale unit"
              labelField="saleUnitName"
              valueField="id"
              search={false}
              showError
              isSubmitted={submitted}
              divStyle={{ flex: 0.5 }}
              required
            />

            <View style={{ flex: 0.5 }}>
              <MyInput label={"Selling price"} value={salesPrice} onValueChange={(text) => setSalesPrice(text)} inputMode="numeric" required />
              {submitted && salesPrice.trim() === "" && <Text style={styles.errorText}>Sales price is required</Text>}
            </View>
          </View>

          {selectedSaleUnits?.map((item, index) => {
            return (
              <View style={styles.row} key={index}>
                <MyInput label="" value={item.saleUnitName || item?.productSaleUnitName} editable={false} style={{ flex: 0.5 }} />

                <MyInput
                  label=""
                  value={String(item.unitPrice)}
                  inputMode="numeric"
                  onValueChange={(e) => handleUnitPriceChange(index, e)}
                  style={{ flex: 0.5 }}
                />
              </View>
            );
          })}

          <MyInput label="Remarks" value={remarks} onValueChange={(text) => setRemarks(text)} multiline />
        </View>
        <View style={styles.bottomContent}>
          <PrimaryButton darkMode={false} title={"Clear"} onPress={clearForm} style={{ flex: 0.5 }} />
          <PrimaryButton darkMode title={"Save"} onPress={saveProduct} disabled={disable} style={{ flex: 0.5 }} />
        </View>
      </ScrollView>

      <Snackbar ref={snackBarRef} />
    </SafeAreaView>
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

import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import { convertToServerDate, formatNumberWithCommas, hasNull } from "@utils/Utils";
import { saveShopProductsOnDevice } from "@controllers/OfflineControllers";
import TopHeader from "@components/TopHeader";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import Snackbar from "@components/Snackbar";
import Colors from "@constants/Colors";
import { KeyboardAvoidingView } from "react-native";
import Loader from "@components/Loader";
import { packageOptions } from "@constants/Constants";
import { STOCK_ENTRY_ENDPOINT } from "@utils/EndPointUtils";
import { getOfflineParams, getSelectedShop, getShops, getSuppliers } from "duqactStore/selectors";
import { useDispatch, useSelector } from "react-redux";
import { changeSelectedShop } from "actions/shopActions";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { getCanCreateUpdateMyShopStock } from "duqactStore/selectors/permissionSelectors";
import NoAuth from "@screens/Unauthorised";
import { UserSessionUtils } from "@utils/UserSessionUtils";
import SuccessDialog from "@components/SuccessDialog";
import { STOCK_LEVELS } from "@navigation/ScreenNames";
import { STOCK_API, STOCK_ENDPOINT } from "api";

const StockEntryForm = () => {
  const selectedShop = useSelector(getSelectedShop);
  const offlineParams = useSelector(getOfflineParams);
  const suppliers = useSelector(getSuppliers);
  const canDoStockCrud = useSelector(getCanCreateUpdateMyShopStock);

  const shops = useSelector(getShops);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers?.find((i) => i?.companyOrBusinessName?.toLowerCase() === "unknown"));
  const [expiryDate, setExpiryDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6); // Add 6 months
    return date;
  });

  const [isPackedProduct, setIsPackedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [batchNo, setBatchNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [quantity, setQuantity] = useState("");

  const [remarks, setRemarks] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [sModal, setSModal] = useState(false);
  const [selectedSaleUnit, setSelectedSaleUnit] = useState(null);
  const [saleUnits, setSaleUnits] = useState([]);
  const [stockEntryId, setStockEntryId] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const snackBarRef = useRef(null);

  const fetchProducts = async () => {
    const shopProducts = await UserSessionUtils.getShopProducts();

    setIsPackedProduct(null);
    setSelectedProduct(null);

    setLoading(true);
    const pdtList = shopProducts.filter((p) => p.shopId === selectedShop?.id);

    setProducts(pdtList);
    if (route?.params) {
      populateForm(pdtList);
    } else {
      setLoading(false);
    }
  };

  const onProductChange = (pdt) => {
    setSelectedProduct(pdt);
    const { multipleSaleUnits, saleUnitName, saleUnitId } = pdt;

    const defaultUnit =
      route?.params?.stockUnitId > 0
        ? multipleSaleUnits?.find((i) => i?.id === route?.params?.stockUnitId)
        : { id: saleUnitId, productSaleUnitName: saleUnitName };

    setSelectedSaleUnit(defaultUnit);
    if (multipleSaleUnits) {
      setSaleUnits([defaultUnit, ...multipleSaleUnits]);
    } else {
      setSaleUnits([defaultUnit]);
    }
  };

  const onSupplierChange = (e) => {
    setSelectedSupplier(e);
  };

  const clearForm = () => {
    setBatchNo("");
    setExpiryDate(new Date());
    setPurchasePrice(null);
    setSelectedProduct(null);
    setIsPackedProduct(null);
    setRemarks("");
    setSubmitted(false);
    setSModal(false);
    setQuantity("");
    setPurchasePrice("");
  };

  const handleSync = async () => {
    await saveShopProductsOnDevice(offlineParams);
    setLoading(false);
  };

  const handleHide = () => {
    if (edit || route?.params?.stock === true) {
      navigation.goBack();
      return;
    }

    clearForm();
  };
  const saveStockEntry = async () => {
    setSubmitted(true);

    const isPacked = selectedSaleUnit?.id === selectedProduct?.saleUnitId;

    const payload = {
      id: stockEntryId,
      productId: selectedProduct?.id,
      totalPurchasePrice: Number(purchasePrice),
      batchNumber: batchNo,
      expiryDate: convertToServerDate(expiryDate),
      unpackedPurchase: isPacked,
      quantity: Number(quantity),
      supplierId: selectedSupplier?.id,
      saleUnitId: selectedSaleUnit?.id,
      manufacturerId: selectedProduct?.manufacturerId,
      remarks: remarks || "",
      stockedOnDate: convertToServerDate(purchaseDate),
    };

    const isValidPayload = selectedProduct !== null && quantity != "" && purchasePrice != "";

    if (isValidPayload === true) {
      setLoading(true);

      await new BaseApiService(STOCK_ENDPOINT.STOCK_WITH_SALE_UNIT)
        .postRequestWithJsonResponse(payload)
        .then(async (response) => {
          setSubmitted(false);
          setLoading(false);
          setSModal(true);
          setTimeout(() => handleSync(), 3000);
        })
        .catch((error) => {
          snackBarRef.current.show(error?.message, 5000);
          setSubmitted(false);
          setLoading(false);
        });
    }
  };

  const populateForm = (productList) => {
    if (route?.params?.stock == true) {
      //stocking from stock levels
      const product = route.params.product;

      setLoading(false);
      setProducts([product]);
      onProductChange(product);
    } else {
      const selectedRecord = { ...route.params };
      setSelectedEntry(route.params);

      setEdit(true);
      const productMatch = productList?.find((i) => i?.id === selectedRecord?.productId);
      onProductChange(productMatch);

      setExpiryDate(new Date(selectedRecord?.expiryDate));
      setStockEntryId(selectedRecord?.id);
      setSelectedSupplier({ companyOrBusinessName: selectedRecord?.supplierName, id: selectedRecord?.supplierId });

      setPurchaseDate(new Date(selectedRecord?.stockedOnDate));
      setPurchasePrice(String(selectedRecord.purchasePrice));
      setQuantity(String(selectedRecord?.unpackedQuantity > 0 ? selectedRecord?.unpackedQuantity : selectedRecord?.packedQuantity));

      setBatchNo(selectedRecord?.batchNumber);
      setRemarks(selectedRecord?.remarks);
      setLoading(false);
    }
  };

  const getUnitPurchasePrice = () => {
    let price = Number(purchasePrice);

    if (isPackedProduct) {
      return String(Math.round(price / (selectedProduct?.packageQuantity * Number(quantity))));
    } else {
      return String(Math.round(price / quantity));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedShop]);

  if (!canDoStockCrud) {
    return <NoAuth />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <TopHeader
        title="Stock purchase"
        showMenuDots
        sync
        onSync={() => {
          setLoading(true);
          handleSync();
        }}
      />
      <Loader loading={loading} />

      <SuccessDialog
        hide={handleHide}
        visible={sModal}
        text={"Stock information has been"}
        onAgree={() => navigation.dispatch(StackActions.replace(STOCK_LEVELS))}
        agreeText="View stock"
        cancelText={edit || route?.params?.stock === true ? "Cancel" : "Add new stock"}
      />

      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 30 }} style={{ paddingHorizontal: 10 }}>
        <Text style={styles.headerText}>{edit ? "Edit" : "Enter"} stock detail</Text>

        {!edit && shops?.length > 1 && (
          <View style={{ gap: 5 }}>
            <Text>Shop</Text>
            <MyDropDown
              search={false}
              style={{ backgroundColor: Colors.light, borderColor: Colors.dark }}
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
        <View>
          <MyDropDown
            data={edit ? [{ ...selectedProduct }] : products}
            onChange={onProductChange}
            value={selectedProduct}
            placeholder="Select product"
            labelField="productName"
            valueField="id"
            showError
            isSubmitted={submitted}
            required
            label={"Product"}
          />
        </View>

        <MyDropDown
          label={"Package unit"}
          data={saleUnits}
          disable={selectedProduct === null}
          value={selectedSaleUnit}
          onChange={(e) => {
            setSelectedSaleUnit(e);
          }}
          placeholder="Select package unit"
          labelField="productSaleUnitName"
          valueField="id"
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
          <MyInput
            label={"Quantity"}
            value={quantity}
            cursorColor={Colors.dark}
            onValueChange={(text) => {
              setQuantity(text);
            }}
            inputMode="numeric"
            style={{ flex: 0.5 }}
            required
            showError
            isSubmitted={submitted}
            editable={selectedProduct !== null}
          />

          <MyInput
            label={`Purchase amount `}
            value={purchasePrice}
            cursorColor={Colors.dark}
            onValueChange={(text) => setPurchasePrice(text)}
            inputMode="numeric"
            style={{ flex: 0.5 }}
            required
            showError
            isSubmitted={submitted}
            editable={selectedProduct !== null}
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <MyInput inputMode="numeric" label="Unit purchase price" editable={false} value={formatNumberWithCommas(getUnitPurchasePrice())} />
          </View>

          <View style={{ flex: 1 }}>
            <MyInput
              label="Purchase date"
              dateValue={purchaseDate}
              isDateInput
              onDateChange={(date) => setPurchaseDate(date)}
              maximumDate
              editable={selectedProduct !== null}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <MyInput label=" Batch no." value={batchNo} onValueChange={(text) => setBatchNo(text)} />
          </View>

          <View style={{ flex: 1 }}>
            <MyInput isDateInput dateValue={expiryDate} label="Expiry Date" onDateChange={(date) => setExpiryDate(date)} minimumDate />
          </View>
        </View>

        <MyDropDown
          showError
          isSubmitted={submitted}
          data={edit ? [{ ...selectedSupplier }] : suppliers}
          onChange={onSupplierChange}
          value={selectedSupplier}
          placeholder="Select supplier"
          labelField="companyOrBusinessName"
          valueField="id"
          label={"Supplier"}
        />

        <MyInput value={remarks} label="Remarks" multiline onValueChange={(text) => setRemarks(text)} numberOfLines={3} />

        <View style={[styles.row, { marginTop: 15 }]}>
          <PrimaryButton title={"Clear"} onPress={clearForm} style={{ flex: 0.5 }} />
          <PrimaryButton title={"Save"} onPress={saveStockEntry} darkMode style={{ flex: 0.5 }} />
        </View>
      </ScrollView>

      <Snackbar ref={snackBarRef} />
    </SafeAreaView>
  );
};

export default StockEntryForm;
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
  },
});

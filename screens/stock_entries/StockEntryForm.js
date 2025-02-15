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
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isPackedProduct, setIsPackedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchNo, setBatchNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [packedPurchasedQuantity, setPackedPurchasedQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [unpackedPurchasedQty, setUnpackedPurchasedQty] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [sModal, setSModal] = useState(false);

  const snackBarRef = useRef(null);

  const fetchProducts = async () => {
    const shopProducts = await UserSessionUtils.getShopProducts();

    setIsPackedProduct(null);
    setSelectedProduct(null);

    setLoading(true);
    const pdtList = shopProducts.filter((p) => p.shopId === selectedShop?.id);

    setProducts(pdtList);
    setLoading(false);
  };

  const onProductChange = (pdt) => {
    setSelectedProduct(pdt);
  };

  const onSupplierChange = (e) => {
    setSelectedSupplier(e);
  };

  const clearForm = () => {
    setBatchNo("");
    setExpiryDate(new Date());
    setPackedPurchasedQuantity(null);
    setPurchasePrice(null);
    setSelectedProduct(null);
    setIsPackedProduct(null);
    setSelectedSupplier(null);
    setRemarks("");
    setUnpackedPurchasedQty(null);
    setSubmitted(false);
    setSModal(false);
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
    setLoading(true);

    const isPacked = isPackedProduct && isPackedProduct === true;
    //setting payload basing on item package type

    const payload = {
      batchNumber: batchNo,
      expiryDate: convertToServerDate(expiryDate),
      id: 0,
      manufacturerId: selectedProduct?.manufacturerId,
      productId: edit ? selectedProduct?.productId : selectedProduct?.id,
      productName: selectedProduct?.productName,
      shopId: edit ? selectedProduct?.shopId : selectedShop?.id,
      stockedOnDate: convertToServerDate(purchaseDate),
      supplierId: selectedSupplier?.id,
      remarks: remarks || "",
      purchasePrice: Number(purchasePrice),
      ...(isPacked && { packedPurchasedQuantity: Number(packedPurchasedQuantity), unpackedPurchase: false }),
      ...(!isPacked && { unpackedPurchase: true, unpackedPurchasedQuantity: Number(unpackedPurchasedQty) }),
    };

    const isValidPayload = hasNull(payload) === false;

    if (isValidPayload === false) {
      setLoading(false); //removing loader if form is invalid
    }

    if (isValidPayload === true) {
      const apiUrl = edit ? STOCK_ENTRY_ENDPOINT + "/" + selectedProduct.id : STOCK_ENTRY_ENDPOINT;

      await new BaseApiService(apiUrl)
        .saveRequestWithJsonResponse(payload, edit)
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

  const populateForm = () => {
    if (route?.params) {
      if (route?.params?.stock == true) {
        console.log(route.params);

        const product = route.params.product;

        setLoading(false);
        setProducts([product]);

        setSelectedProduct(product);
        setIsPackedProduct(true);
      } else {
        const selectedRecord = { ...route.params };

        setLoading(false);
        setEdit(true);

        setSelectedProduct({
          productName: selectedRecord?.productName,
          id: selectedRecord?.id,
          productId: selectedRecord?.productId,
          packageUnitName: selectedRecord?.formattedQuantity.split(" ")[1],
          manufacturerId: selectedRecord?.manufacturerId,
          packageQuantity: selectedRecord?.purchasedQuantity,
          shopId: selectedRecord?.shopId,
          currency: selectedRecord?.currency,
        });

        setIsPackedProduct(!selectedRecord?.unpackedPurchase);

        setExpiryDate(new Date(selectedRecord?.expiryDate));

        setSelectedSupplier({ companyOrBusinessName: selectedRecord?.supplierName, id: selectedRecord?.supplierId });

        setPurchaseDate(new Date(selectedRecord?.stockedOnDate));
        setPurchasePrice(String(selectedRecord.purchasePrice));
        setUnpackedPurchasedQty(String(selectedRecord?.unpackedQuantity));
        setPackedPurchasedQuantity(String(selectedRecord?.packedQuantity));
        setBatchNo(selectedRecord?.batchNumber);
        setRemarks(selectedRecord?.remarks);
      }
    } else {
      fetchProducts();
    }
  };

  const getUnitPurchasePrice = () => {
    let qty = isPackedProduct ? packedPurchasedQuantity : unpackedPurchasedQty;

    let price = Number(purchasePrice);

    if (isPackedProduct) {
      return String(Math.round(price / (selectedProduct?.packageQuantity * Number(qty))));
    } else {
      return String(Math.round(price / qty));
    }
  };

  useEffect(() => {
    populateForm();
  }, [selectedShop]);

  if (!canDoStockCrud) {
    return <NoAuth />;
  }
  return (
    <KeyboardAvoidingView
      enabled={true}
      // behavior={"height"}
      style={{ flex: 1 }}
    >
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
          text={"Stock information has been saved successfully"}
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
            <Text style={styles.inputLabel}>Product</Text>
            <MyDropDown
              style={styles.dropDown}
              data={edit ? [{ ...selectedProduct }] : products}
              onChange={onProductChange}
              value={selectedProduct}
              placeholder="Select product"
              labelField="productName"
              valueField="id"
            />
            {submitted && !selectedProduct && <Text style={styles.errorText}>Product is required</Text>}
          </View>

          <View>
            <Text style={styles.inputLabel}>Supplier</Text>
            <MyDropDown
              style={styles.dropDown}
              data={edit ? [{ ...selectedSupplier }] : suppliers}
              onChange={onSupplierChange}
              value={selectedSupplier}
              placeholder="Select supplier"
              labelField="companyOrBusinessName"
              valueField="id"
            />
            {submitted && !selectedSupplier && <Text style={styles.errorText}>Supplier is required</Text>}
          </View>

          <View>
            <Text style={styles.inputLabel}>Package type</Text>
            <MyDropDown
              style={styles.dropDown}
              search={false}
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
            {submitted && !isPackedProduct && <Text style={styles.errorText}>Package type is required</Text>}
          </View>

          {isPackedProduct !== null && (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <MyInput
                  label={isPackedProduct === true ? `Quantity (${selectedProduct?.packageUnitName || ""})` : "Unpacked quantity"}
                  value={isPackedProduct === true ? packedPurchasedQuantity : unpackedPurchasedQty}
                  cursorColor={Colors.dark}
                  onValueChange={(text) => {
                    isPackedProduct === true ? setPackedPurchasedQuantity(text) : setUnpackedPurchasedQty(text);
                  }}
                  inputMode="numeric"
                />
                {submitted && ((!unpackedPurchasedQty && !isPackedProduct) || (!packedPurchasedQuantity && isPackedProduct)) && (
                  <Text style={styles.errorText}>Quantity is required</Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <MyInput
                  label={`Purchase amount (${selectedProduct?.currency})`}
                  value={purchasePrice}
                  cursorColor={Colors.dark}
                  onValueChange={(text) => setPurchasePrice(text)}
                  inputMode="numeric"
                />
                {submitted && !purchasePrice && <Text style={styles.errorText}>Price is required</Text>}
              </View>
            </View>
          )}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <MyInput label="Unit purchase price" editable={false} value={formatNumberWithCommas(getUnitPurchasePrice())} />
            </View>

            <View style={{ flex: 1 }}>
              <MyInput label="Purchase date" dateValue={purchaseDate} isDateInput onDateChange={(date) => setPurchaseDate(date)} maximumDate />
              {submitted && !purchaseDate && <Text style={styles.errorText}>Purchase date is required</Text>}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <MyInput label=" Batch no." value={batchNo} onValueChange={(text) => setBatchNo(text)} />
            </View>

            <View style={{ flex: 1 }}>
              <MyInput isDateInput dateValue={expiryDate} label="Expiry Date" onDateChange={(date) => setExpiryDate(date)} minimumDate />
              {submitted && !expiryDate && <Text style={styles.errorText}>Expiry date is required</Text>}
            </View>
          </View>

          <MyInput value={remarks} label="Remarks" multiline onValueChange={(text) => setRemarks(text)} numberOfLines={3} />

          <View style={[styles.row, { marginTop: 15 }]}>
            <PrimaryButton title={"Clear"} onPress={clearForm} style={{ flex: 0.5 }} />
            <PrimaryButton title={"Save"} onPress={saveStockEntry} darkMode style={{ flex: 0.5 }} />
          </View>
        </ScrollView>

        <Snackbar ref={snackBarRef} />
      </SafeAreaView>
    </KeyboardAvoidingView>
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

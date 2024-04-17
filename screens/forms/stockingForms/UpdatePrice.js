import { View, Text, SafeAreaView, StyleSheet, Animated } from "react-native";
import React, { useContext, useState, useEffect, useRef } from "react";
import TopHeader from "../../../components/TopHeader";
import AppStatusBar from "../../../components/AppStatusBar";
import { BaseStyle } from "../../../utils/BaseStyle";
import ChipButton from "../../../components/buttons/ChipButton";
import { UserContext } from "../../../context/UserContext";
import Colors from "../../../constants/Colors";
import MyInput from "../../../components/MyInput";
import Loader from "../../../components/Loader";
import DataRow from "../../../components/cardComponents/DataRow";
import {
  formatNumberWithCommas,
  hasNull,
  isValidNumber,
} from "../../../utils/Utils";
import { SHOP_PRODUCTS_ENDPOINT } from "../../../utils/EndPointUtils";
import { BaseApiService } from "../../../utils/BaseApiService";
import Snackbar from "../../../components/Snackbar";
import { StackActions } from "@react-navigation/native";
import { LANDING_SCREEN } from "../../../navigation/ScreenNames";

const UpdatePrice = ({ navigation, route }) => {
  const [dob, setDOB] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSaleUnits, setSelectedSaleUnits] = useState([]);

  const { selectedShop } = useContext(UserContext);

  const snackBarRef = useRef(null);

  const populateForm = () => {
    if (route.params) {
      const selectedRecord = {
        ...route.params,
      };
      console.log(selectedRecord);
      if (selectedRecord?.multipleSaleUnits) {
        setSelectedSaleUnits(selectedRecord?.multipleSaleUnits);
      }
      setSelectedProduct(selectedRecord);
      setLoading(false);
    }
  };

  const saveProduct = () => {
    setSubmitted(true);
    const apiUrl = `${SHOP_PRODUCTS_ENDPOINT}/${selectedProduct?.id}`;
    let payload = {
      manufacturerId: selectedProduct?.manufacturerId,
      shopId: selectedShop?.id,
      productId: selectedProduct?.productId,
      saleUnitId: selectedProduct?.saleUnitId,
      salesPrice: Number(price),
      remarks: selectedProduct?.remarks,
      hasMultipleSaleUnits: selectedProduct?.hasMultipleSaleUnits,
      multipleSaleUnits: selectedSaleUnits,
    };

    if (!isValidNumber(price)) {
      setError("Invalid price");
    } else {
      setLoading(true);
      setError(null);
      new BaseApiService(apiUrl)
        .saveRequestWithJsonResponse(payload, true)
        .then((response) => {
          //   clearForm();
          setSubmitted(false);
          setLoading(false);
          snackBarRef.current.show("Price updated successfully.");
          setTimeout(
            () => navigation.dispatch(StackActions.replace(LANDING_SCREEN)),
            3000
          );
        })
        .catch((error) => {
          setError(error?.message);
          setLoading(false);
          setSubmitted(false);
        });
    }
  };

  useEffect(() => {
    populateForm();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStatusBar />

      <TopHeader title="Update " />
      <Snackbar ref={snackBarRef} />

      <Loader loading={loading} />
      <View style={BaseStyle.shadowedContainer}>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
          }}
        >
          Selling price details
        </Text>

        <View style={{ gap: 5, paddingHorizontal: 5, marginVertical: 10 }}>
          {error && (
            <Text numberOfLines={20} style={{ color: Colors.error }}>
              {error}
            </Text>
          )}

          <DataRow
            label={"Product"}
            value={selectedProduct?.productName}
            labelTextStyle={styles.label}
            valueTextStyle={styles.label}
          />
          <DataRow
            label={"Barcode"}
            value={selectedProduct?.barcode}
            labelTextStyle={styles.label}
            valueTextStyle={styles.label}
          />
          <DataRow
            showCurrency
            label={"Current price"}
            value={formatNumberWithCommas(selectedProduct?.salesPrice)}
            labelTextStyle={styles.label}
            valueTextStyle={styles.label}
          />
          <DataRow
            label={"Container unit"}
            value={selectedProduct?.packageUnitName}
            labelTextStyle={styles.label}
            valueTextStyle={styles.label}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <MyInput
              label="Selling price"
              inputMode="numeric"
              value={price}
              onValueChange={(text) => setPrice(text)}
            />
          </View>
          <MyInput
            mt={-8}
            label="Date "
            value={dob}
            isDateInput
            onValueChange={(date) => setDOB(date)}
          />
        </View>

        <MyInput
          label="Remarks"
          multiline
          value={remarks}
          numberOfLines={2}
          onValueChange={(text) => setRemarks(text)}
        />

        <View style={styles.btnContainer}>
          <ChipButton title={"Cancel"} onPress={() => navigation.goBack()} />
          <ChipButton darkMode title={"Confirm"} onPress={saveProduct} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: 500,
  },
});
export default UpdatePrice;

import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import AppStatusBar from "@components/AppStatusBar";
import EnterSaleQtyModal from "./components/EnterSaleQtyModal";
import Colors from "@constants/Colors";
import { screenHeight, screenWidth } from "@constants/Constants";
import { SaleEntryContext } from "context/SaleEntryContext";
import { UserSessionUtils } from "@utils/UserSessionUtils";

const BarCodeScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);

  const { products } = route?.params;

  const {
    setQuantity,
    setSelection,
    scanned,
    setScanned,
    setLoading,
    setShowModal,
    setSaleUnits,
    setSelectedSaleUnit,
    setInitialUnitCost,
    setUnitCost,
  } = useContext(SaleEntryContext);

  const handleBarCodeScanned = ({ data }) => {
    try {
      console.log(data);
      setScanned(true);
      fetchProductByBarCode(data);
    } catch (e) {
      console.error(e);
      setScanned(false);
      setLoading(false);
    }
  };

  const fetchProductByBarCode = async (barcode) => {
    setLoading(true);
    console.log("scanning");
    let item;
    if (products) {
      item = products.find((item) => item.barcode === barcode);
      console.log("looking through instock pdts");
    } else {
      item = await UserSessionUtils.getProductByBarcode(barcode);
    }

    if (!item) {
      setLoading(false);
      setQuantity(null);
      Alert.alert("Cannot find product in your shop", "", [
        {
          text: "Ok",
          onPress: () => setScanned(false),
          style: "cancel",
        },
      ]);
    } else {
      setShowModal(true);

      const { multipleSaleUnits, saleUnitName, salesPrice } = item;

      let defUnit = {
        productSaleUnitName: saleUnitName,
        unitPrice: salesPrice,
      };
      setSelection(item);

      setShowModal(true);

      if (multipleSaleUnits) {
        setSaleUnits([defUnit, ...multipleSaleUnits]);
      } else {
        setSaleUnits([{ ...defUnit }]);
        setSelectedSaleUnit(defUnit);
        setInitialUnitCost(salesPrice);
        setUnitCost(String(salesPrice));
      }
      setScanned(true);
      setShowModal(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <AppStatusBar />

      <EnterSaleQtyModal />

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
            onPress={() => navigation.goBack()}
            style={{
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: Colors.primary,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.dark,
              height: 50,
              width: 300,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 500,
                color: Colors.dark,
                alignSelf: "center",
                fontSize: 20,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BarCodeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
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
    justifyContent: "center",
    alignItems: "center",
  },

  focusedContainer: {
    //scan area
    borderColor: Colors.primary,
    borderWidth: 2,
    height: 150,
    borderRadius: 5,
    width: screenWidth / 1.2,
  },
});

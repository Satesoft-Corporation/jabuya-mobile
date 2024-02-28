import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Colors from "../constants/Colors";
import { dummy, screenHeight, screenWidth } from "../constants/Constants";
import Loader from "../components/Loader";
import { SalesQtyInputDialog } from "../components/Dialogs";
import { BarCodeScanner } from "expo-barcode-scanner";
import AppStatusBar from "../components/AppStatusBar";
import { UserContext } from "../context/UserContext";
import { BaseApiService } from "../utils/BaseApiService";
import { SaleEntryContext } from "../context/SaleEntryContext";

const BarCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);

  const { userParams, selectedShop } = useContext(UserContext);

  const {
    setQuantity,
    setSelection,
    scanned,
    setScanned,
    loading,
    setLoading,
    setShowModal,
  } = useContext(SaleEntryContext);

  const { isShopAttendant, attendantShopId } = userParams;

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    fetchProductByBarCode(data);
  };

  const fetchProductByBarCode = (barcode) => {
    setLoading(true);

    let searchParameters = {
      offset: 0,
      limit: 0,
      shopId: isShopAttendant ? attendantShopId : selectedShop?.id,
      barCode: barcode,
    };

    new BaseApiService("/shop-products")
      .getRequestWithJsonResponse(searchParameters)
      .then(async (response) => {
        if (response.records.length === 0) {
          Alert.alert("Cannot find product in your shop", "", [
            {
              text: "Ok",
              onPress: () => setScanned(false),
              style: "cancel",
            },
          ]);
          setLoading(false);
          setQuantity(null);
        } else {
          setSelection(dummy);
          setShowModal(true);
          //   setSelection(response.records[0]);
          //   setUnitCost(String(response.records[0]?.salesPrice));
          setScanned(true);
          setShowModal(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        Alert.alert("Error!", error?.message);
        setLoading(false);
        setScanned(false);
      });
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

      <Loader loading={loading} />

      <SalesQtyInputDialog />

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

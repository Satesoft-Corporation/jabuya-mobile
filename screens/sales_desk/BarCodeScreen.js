import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import EnterSaleQtyModal from "./components/EnterSaleQtyModal";
import Colors from "@constants/Colors";
import { screenHeight, screenWidth } from "@constants/Constants";
import { useDispatch } from "react-redux";
import { makeProductSelection } from "actions/shopActions";

const BarCodeScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [showMoodal, setShowModal] = useState(false);
  const [scanned, setScanned] = useState(false);

  const { products } = route?.params;

  const dispatch = useDispatch();

  const makeSelection = (item) => {
    dispatch(makeProductSelection(item));
    setShowModal(true);
    setScanned(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    try {
      console.log(data);
      setScanned(true);
      fetchProductByBarCode(data);
    } catch (e) {
      console.error(e);
      setScanned(false);
    }
  };

  const fetchProductByBarCode = async (barcode) => {
    console.log("scanning");
    if (products) {
      const item = products.find((item) => item.barcode === barcode);
      console.log(item, "ghgggh", products);
      if (!item) {
        Alert.alert("Cannot find product in your shop", "", [
          {
            text: "Ok",
            onPress: () => setScanned(false),
            style: "cancel",
          },
        ]);
      } else {
        makeSelection(item);
      }
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
      <EnterSaleQtyModal showMoodal={showMoodal} setShowModal={setShowModal} />

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

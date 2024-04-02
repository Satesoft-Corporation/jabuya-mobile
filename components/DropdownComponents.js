import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../constants/Colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const SalesDropdownComponent = ({
  products,
  handleChange,
  setLoading,
  makeSelection,
  setScanned,
  value,
  disable,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          {
            borderColor: Colors.primary,
            opacity: disable ? 0.8 : 1,
            height: 35,
          },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={products}
        search
        maxHeight={screenHeight / 2}
        labelField="productName"
        valueField="productName"
        placeholder={!isFocus ? "Select product" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          setLoading(false);
          makeSelection(item);
        }}
        onChangeText={(text) => handleChange(text)}
        disable={disable}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          disabled={disable}
          onPress={() => setScanned()}
          style={{
            borderColor: Colors.primary,
            borderWidth: 1,
            height: 30,
            alignSelf: "center",
            marginStart: 8,
            padding: 10,
            justifyContent: "center",
            borderRadius: 5,
            paddingVertical: 17,
            opacity: disable ? 0.7 : 1,
          }}
        >
          <Image
            source={require("../assets/icons/icons8-barcode-24.png")}
            style={{
              width: 35,
              height: 30,
              tintColor: Colors.primary,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const MyDropDown = ({
  onChange,
  style = {},
  data,
  labelField,
  valueField,
  value,
  placeholder = "Select item",
  disable = false,
  search = true,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={{ marginBottom: 1 }}>
      <Dropdown
        disable={disable}
        style={[
          {
            height: 40,
            borderColor: Colors.dark,
            borderWidth: 0.5,
            borderRadius: 5,
            paddingHorizontal: 13,
            backgroundColor: Colors.primary,
            width: "100%",
          },
          isFocus && { borderColor: Colors.primary },
          style,
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={screenHeight / 2}
        labelField={labelField}
        valueField={valueField}
        placeholder={!isFocus ? placeholder : "..."}
        searchPlaceholder="Search..."
        value={value}
        search={search}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          onChange(item);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  dropdown: {
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 13,
    backgroundColor: Colors.primary,
    marginBottom: 0,
    width: "80%",
    alignSelf: "center",
  },
  icon: {
    marginRight: 5,
  },

  label: {
    position: "absolute",
    // backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

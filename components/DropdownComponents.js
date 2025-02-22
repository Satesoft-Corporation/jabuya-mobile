import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Text, ActivityIndicator } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import Colors from "../constants/Colors";
import Icon from "./Icon";
import { formatNumberWithCommas, isNotEmpty } from "@utils/Utils";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export const SalesDropdownComponent = ({ products, handleChange, makeSelection, setScanned, value, disable }) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    return (
      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingVertical: 10, alignItems: "center", width: "92%" }}>
        {isNotEmpty(item?.imageUrl) ? (
          <Image source={{ uri: item?.imageUrl }} style={{ width: 70, height: 40 }} />
        ) : (
          <Icon name="file-image" groupName="FontAwesome6" size={25} color={Colors.gray} style={{ paddingHorizontal: 10 }} />
        )}
        <View>
          <Text style={{ fontWeight: "bold" }} numberOfLines={2}>
            {item?.productName?.trim()}
          </Text>
          <Text numberOfLines={2}>Price: {formatNumberWithCommas(item?.salesPrice, item?.currency)}</Text>
        </View>
      </View>
    );
  };

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
        maxHeight={screenHeight / 1.5}
        labelField="productName"
        valueField="productName"
        placeholder={!isFocus ? "Select product" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          makeSelection(item);
        }}
        onChangeText={(text) => handleChange(text)}
        disable={disable}
        renderItem={renderItem}
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
              alignSelf: "center",
            }}
            tintColor={Colors.primary}
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
  label,
  disable = false,
  showError = false,
  isSubmitted,
  divStyle = {},
  renderItem = null,
  onChangeText = () => {},
  required = false,
  loading = false,
  forceSearch = false,
  placeholder,
  searchPlaceholder,
  modal = false,
  mutliSelect = false,
  ...otherProps
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const shouldShowError = isSubmitted && showError && !value;

  const props = {
    disable,
    style: [
      {
        height: 40,
        borderColor: shouldShowError ? Colors.error : Colors.dark,
        borderWidth: shouldShowError ? 1 : 0.5,
        borderRadius: 5,
        paddingHorizontal: 13,
        width: "100%",
      },
      isFocus && { borderColor: Colors.primary },
      style,
    ],
    placeholderStyle: styles.placeholderStyle,
    selectedTextStyle: styles.selectedTextStyle,
    inputSearchStyle: styles.inputSearchStyle,
    iconStyle: styles.iconStyle,
    data,
    maxHeight: 600, // Adjust based on screen size
    labelField,
    valueField,
    placeholder: placeholder ?? "Select item",
    searchPlaceholder: searchPlaceholder || "Type here to search...",
    value,
    search: forceSearch ? true : data?.length > 6,
    onFocus: () => setIsFocus(true),
    onBlur: () => setIsFocus(false),
    onChange: (item) => {
      setIsFocus(false);
      onChange(item);
    },
    onChangeText: (text) => onChangeText(text),
    renderItem: renderItem ? (item) => renderItem(item) : null,
    renderRightIcon: () => (loading ? <ActivityIndicator color={"#000"} /> : <Icon name="angle-down" size={20} color={"#000"} />),
    mode: modal ? "modal" : "default",
  };

  return (
    <View style={[{ width: "100%" }, divStyle]}>
      {/* <Text>{String(shouldShowError)}</Text> */}
      {label && (
        <Text style={{ fontSize: 15, marginBottom: 5 }}>
          {label}
          {required && <Text style={{ color: Colors.error }}>*</Text>}
        </Text>
      )}

      {mutliSelect === false ? <Dropdown {...props} /> : <MultiSelect {...props} {...otherProps} activeColor={Colors.gray} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8, flexDirection: "row", justifyContent: "center", paddingHorizontal: 8 },
  dropdown: {
    height: 35,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 13,
    backgroundColor: Colors.primary,
    marginBottom: 0,
    width: "80%",
    alignSelf: "center",
  },
  icon: { marginRight: 5 },

  label: {
    position: "absolute",
    // backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: { fontSize: 15 },
  selectedTextStyle: { fontSize: 15 },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 16 },
});

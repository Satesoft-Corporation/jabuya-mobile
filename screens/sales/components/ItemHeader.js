import { View, Text } from "react-native";
import React from "react";
import RenderCurrency from "@components/RenderCurrency";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { getSelectedShop } from "reducers/selectors";

const ItemHeader = ({ title, value, isCurrency = false }) => {
  const selectedShop = useSelector(getSelectedShop);
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 3 }}>
      <Text
        style={{
          fontSize: 12,
          color: Colors.primary,
          alignSelf: "center",
          opacity: 0.6,
        }}
      >
        {title}
      </Text>
      {isCurrency ? (
        <RenderCurrency value={value} color={Colors.primary} currencySymbol={selectedShop?.currency || ""} />
      ) : (
        <Text style={{ fontSize: scale(13), color: Colors.primary }}>{value}</Text>
      )}
    </View>
  );
};

export default ItemHeader;

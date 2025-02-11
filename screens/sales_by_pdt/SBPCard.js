import { View, Text } from "react-native";
import React from "react";
import { BaseStyle } from "@utils/BaseStyle";
import DataColumn from "@components/card_components/DataColumn";

/**
 *
 * @returns Sales by product card
 */
const SBPCard = ({ product }) => {
  const { inStock, itemsSold, name, purchasedQuantity } = product ?? {};
  return (
    <View style={BaseStyle.card}>
      <View style={{ gap: 3 }}>
        <Text>Product</Text>
        <Text>{name}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <DataColumn title={"Purchased"} value={purchasedQuantity} />
        <DataColumn title={"Stock"} value={inStock} />
        <DataColumn title={"Sold"} value={itemsSold} />
      </View>
    </View>
  );
};

export default SBPCard;

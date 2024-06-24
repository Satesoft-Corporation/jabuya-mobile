import { View, Text, ScrollView } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { screenHeight } from "@constants/Constants";
import { formatNumberWithCommas } from "@utils/Utils";
import { userData } from "context/UserContext";

const SalesTable = ({ sales = [], fixHeight = true }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 25,
          paddingEnd: 10,
          borderBottomColor: Colors.gray,
          borderBottomWidth: 0.3,
        }}
      >
        <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
        <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
          Qty
        </Text>

        <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
          Cost
        </Text>

        <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
          Amount
        </Text>
      </View>
      <ScrollView
        style={
          fixHeight
            ? {
                height: screenHeight / 4,
              }
            : {
                maxHeight: screenHeight / 4,
              }
        }
      >
        {[...sales]?.map((item, i) => (
          <SaleListItem data={item} key={i} />
        ))}
      </ScrollView>
    </View>
  );
};

export const SaleListItem = ({ data }) => {
  // table item on sales entry
  const { productName, shopProductName, saleUnitName } = data;

  let unitName = saleUnitName ? " - " + saleUnitName : "";

  const { selectedShop } = userData();

  return (
    <View
      key={productName}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.3,
        alignItems: "center",
        height: "fit-content",
        paddingVertical: 8,
      }}
    >
      <Text style={{ flex: 2.5, justifyContent: "center" }}>
        {productName || shopProductName + unitName}
      </Text>
      <Text style={{ flex: 0.5, textAlign: "center" }}>{data?.quantity}</Text>
      <Text style={{ flex: 1, textAlign: "right" }}>
        <Text style={{ fontSize: 8, fontWeight: 400 }}>
          {selectedShop?.currency}{" "}
        </Text>
        {formatNumberWithCommas(data?.unitCost)}
      </Text>
      <Text style={{ flex: 1, textAlign: "right", paddingEnd: 10 }}>
        <Text style={{ fontSize: 8, fontWeight: 400 }}>
          {selectedShop?.currency}{" "}
        </Text>
        {formatNumberWithCommas(data?.totalCost)}
      </Text>
    </View>
  );
};
export default SalesTable;

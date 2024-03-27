import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SaleListItem } from "../TransactionItems";
import Colors from "../../constants/Colors";
import { screenHeight } from "../../constants/Constants";

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
        {[...sales]?.map((item) => (
          <SaleListItem data={item} key={item.productName} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SalesTable;

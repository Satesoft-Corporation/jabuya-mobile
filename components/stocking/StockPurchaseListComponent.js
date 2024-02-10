import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatDate, formatNumberWithCommas } from "../../utils/Utils";
import Colors from "../../constants/Colors";
import { memo } from "react";

const StockPurchaseListComponent = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setExpanded((prevExpanded) => !prevExpanded);
  }, []);

  const totalQuantity = useMemo(
    () => data?.packedQuantity * data?.purchasedQuantity,
    [data]
  );

  return (
    <View
      style={{
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.dark,
            marginBottom: 2,
          }}
        >
          SN: {data?.serialNumber}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(data?.dateCreated)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <View style={{ alignItems: "left" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Product
          </Text>
          <Text>{data?.productName}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Qty
          </Text>
          <Text>{totalQuantity}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Amount
          </Text>
          <Text style={{ alignSelf: "flex-end", marginEnd: 2 }}>
            {formatNumberWithCommas(data?.purchasePrice)}
          </Text>
        </View>
      </View>
      {expanded && (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: 400, fontSize: 12 }}>Barcode: </Text>
            <Text style={{ fontWeight: 300, fontSize: 12 }}>
              {data?.barcode}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: 400, fontSize: 12 }}>
              Restock date:{" "}
            </Text>
            <Text style={{ fontWeight: 300, fontSize: 12 }}>
              {formatDate(data?.dateChanged, true)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 2,
            }}
          >
            <Text style={{ fontWeight: 400, fontSize: 12 }}>Expiry date: </Text>
            <Text style={{ fontWeight: 600, fontSize: 12 }}>
              {formatDate(data?.expiryDate, true)}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: 400, fontSize: 12, marginBottom: 10 }}>
              Supplier:{" "}
            </Text>
            <Text style={{ fontWeight: 300, fontSize: 12 }}>
              {data?.supplierName}
            </Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>
            Restock by:{" "}
            <Text style={{ fontWeight: 300, fontSize: 12 }}>
              {data?.createdByFullName}
            </Text>
          </Text>
          <Text style={{ fontWeight: 300, fontSize: 12 }}>
            {data?.shopName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleExpand}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.dark,
            borderRadius: 3,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{ color: Colors.primary, fontSize: 13, fontWeight: 300 }}
          >
            {expanded ? "Hide" : "More"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StockPurchaseListComponent;

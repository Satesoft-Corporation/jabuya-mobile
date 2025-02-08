import { View, Text, ScrollView } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { screenHeight } from "@constants/Constants";
import { formatNumberWithCommas } from "@utils/Utils";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "@components/Icon";
import { useRef } from "react";

const SalesTable = ({ sales = [], fixHeight = true, disableSwipe = true, onDelete = () => {}, returned = false, editItem }) => {
  const listViewRef = useRef(null);

  const renderHiddenItem = (data) => {
    if (data?.item?.status !== "CANCELLED") {
      return (
        <View
          style={{
            alignItems: "center",
            backgroundColor: Colors.light_3,
            flex: 1,
            justifyContent: "flex-end",
            paddingRight: 15,
            flexDirection: "row",
            gap: 15,
          }}
        >
          {!returned ? (
            <>
              <Icon name={"edit"} color={Colors.green} size={17} onPress={() => editItem(data?.item)} />
              <Icon name={"trash-alt"} color={Colors.error} size={17} onPress={() => onDelete(data)} />
            </>
          ) : (
            <Icon name={"return-down-back"} size={20} onPress={() => onDelete(data)} groupName={"Ionicons"} />
          )}
        </View>
      );
    }
  };

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
        <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>Qty</Text>

        <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>Cost</Text>

        <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>Amount</Text>
      </View>
      <ScrollView style={fixHeight ? { height: screenHeight / 4 } : { maxHeight: screenHeight }}>
        <SwipeListView
          ref={listViewRef}
          data={sales}
          renderItem={(data, rowMap) => <SaleListItem data={data.item} key={data?.index} />}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          disableLeftSwipe={disableSwipe}
        />
      </ScrollView>
    </View>
  );
};

const SaleListItem = ({ data }) => {
  const { productName, shopProductName, saleUnitName, cancellationReason } = data;

  let unitName = saleUnitName ? " - " + saleUnitName : "";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.3,
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ flex: 2.5, justifyContent: "center", textDecorationLine: cancellationReason ? "line-through" : "" }} numberOfLines={2}>
        {productName?.trim() || shopProductName?.trim() + unitName}
      </Text>
      <Text style={{ flex: 0.5, textAlign: "center", textDecorationLine: cancellationReason ? "line-through" : "" }}>{data?.quantity}</Text>

      <Text style={{ flex: 1, textAlign: "right", textDecorationLine: cancellationReason ? "line-through" : "" }}>
        {formatNumberWithCommas(data?.unitCost)}
      </Text>
      <Text style={{ flex: 1, textAlign: "right", paddingEnd: 10, textDecorationLine: cancellationReason ? "line-through" : "" }}>
        {formatNumberWithCommas(data?.totalCost)}
      </Text>
    </View>
  );
};
export default SalesTable;

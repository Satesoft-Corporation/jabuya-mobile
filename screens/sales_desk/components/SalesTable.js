import { View, Text, ScrollView } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { screenHeight } from "@constants/Constants";
import { formatNumberWithCommas } from "@utils/Utils";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "@components/Icon";
import { useDispatch } from "react-redux";
import { removeItemFromCart } from "actions/shopActions";
import { useRef } from "react";

const SalesTable = ({ sales = [], fixHeight = true, disableSwipe = false }) => {
  const dispatch = useDispatch();
  const listViewRef = useRef(null);

  const renderHiddenItem = (data) => (
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
      <Icon
        name="trash-alt"
        color={Colors.error}
        size={17}
        onPress={() => {
          dispatch(removeItemFromCart(data?.item));
        }}
      />
    </View>
  );

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
                height: screenHeight / 3,
              }
            : {
                maxHeight: screenHeight / 4,
              }
        }
      >
        <SwipeListView
          ref={listViewRef}
          data={sales}
          renderItem={(data, rowMap) => (
            <SaleListItem data={data.item} key={data?.index} />
          )}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-50}
          disableRightSwipe
          disableLeftSwipe={disableSwipe}
        />
      </ScrollView>
    </View>
  );
};

const SaleListItem = ({ data }) => {
  const { productName, shopProductName, saleUnitName } = data;

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
      <Text style={{ flex: 2.5, justifyContent: "center" }} numberOfLines={2}>
        {productName || shopProductName + unitName}
      </Text>
      <Text style={{ flex: 0.5, textAlign: "center" }}>{data?.quantity}</Text>

      <Text style={{ flex: 1, textAlign: "right" }}>
        {formatNumberWithCommas(data?.unitCost)}
      </Text>
      <Text style={{ flex: 1, textAlign: "right", paddingEnd: 10 }}>
        {formatNumberWithCommas(data?.totalCost)}
      </Text>
    </View>
  );
};
export default SalesTable;

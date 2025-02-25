import { View, Text, FlatList } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { formatNumberWithCommas } from "@utils/Utils";
import { useRef } from "react";

const UserTable = ({ data = [] }) => {
  const listViewRef = useRef(null);

  return (
    <View style={{ flex: 1 }}>
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
        <Text style={{ flex: 2.5, fontWeight: 600 }}>User</Text>
        <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>Txn</Text>

        <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Sales</Text>

        <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Debt</Text>
      </View>
      <FlatList
        ref={listViewRef}
        data={data}
        renderItem={({ item, index }) => (
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
              {item?.firstName} {item?.lastName}
            </Text>
            <Text style={{ flex: 0.5, textAlign: "center" }}>{formatNumberWithCommas(index)}</Text>

            <Text style={{ flex: 1, textAlign: "center" }}>{formatNumberWithCommas(item?.totalSalesValue)}</Text>
            <Text style={{ flex: 1, textAlign: "center", paddingEnd: 10 }}>{formatNumberWithCommas(item?.totalSalesValue)}</Text>
          </View>
        )}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

export default UserTable;

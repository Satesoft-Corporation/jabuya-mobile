import { View, Text, FlatList } from "react-native";
import React from "react";
import Colors from "@constants/Colors";
import { formatNumberWithCommas } from "@utils/Utils";
import { useRef } from "react";

const UserTable = ({ data }) => {
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
        {/* <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>Txn</Text> */}

        <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Sales</Text>

        <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Debt</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.userId?.toString()}
        renderItem={({ item, index }) => (
          <View
            key={index}
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
              {item?.userFullName}
            </Text>
            {/* <Text style={{ flex: 0.5, textAlign: "center" }}>{formatNumberWithCommas(index)}</Text> */}

            <Text style={{ flex: 1, textAlign: "center" }}>{formatNumberWithCommas(item?.totalSalesMade)}</Text>
            <Text style={{ flex: 1, textAlign: "center", paddingEnd: 10 }}>{formatNumberWithCommas(item?.totalDebtsCollected)}</Text>
          </View>
        )}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

export default UserTable;

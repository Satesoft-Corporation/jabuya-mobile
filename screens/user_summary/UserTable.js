import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@constants/Colors";
import { formatNumberWithCommas } from "@utils/Utils";

const UserTable = ({ data, offersDebt }) => {
  const [tSales, setTSales] = useState(0);
  const [paid, setPaid] = useState(0);
  const [debt, setDebt] = useState(0);
  const [saleCount, setSaleCount] = useState(0);

  useEffect(() => {
    const saleSum = data?.reduce((a, b) => a + b?.totalSalesMade, 0);
    const paidSum = data?.reduce((a, b) => a + b?.totalDebtsCollected, 0);
    const saleC = data?.reduce((a, b) => a + b?.totalSalesCount, 0);

    setPaid(paidSum);
    setTSales(saleSum);
    setSaleCount(saleC);
  }, []);

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
        <Text style={{ flex: 1, fontWeight: 600 }}>User</Text>

        <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Sales</Text>

        {offersDebt == true && (
          <>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Paid</Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>Debt</Text>
          </>
        )}
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
            <Text style={{ flex: 1, justifyContent: "center" }} numberOfLines={2}>
              {item?.userFullName?.split(" ")[0]}
            </Text>

            <Text style={{ flex: 1, textAlign: "center" }}>{formatNumberWithCommas(item?.totalSalesMade)}</Text>
            {offersDebt == true && (
              <>
                <Text style={{ flex: 1, textAlign: "center" }}>{formatNumberWithCommas(item?.totalDebtsCollected)}</Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{formatNumberWithCommas(0)}</Text>
              </>
            )}
          </View>
        )}
        ListFooterComponent={
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
            <Text style={{ flex: 1, justifyContent: "center", fontWeight: 600 }}>Total</Text>

            <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>{formatNumberWithCommas(tSales)}</Text>
            {offersDebt == true && (
              <>
                <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>{formatNumberWithCommas(paid)}</Text>
                <Text style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>{formatNumberWithCommas(debt)}</Text>
              </>
            )}
          </View>
        }
        showsVerticalScrollIndicator
      />

      <View style={{ paddingEnd: 8, marginTop: 20 }}>
        <Text style={{ fontWeight: "600" }}>Transaction summary</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ gap: 5 }}>
            <Text></Text>
            <Text>Sales</Text>
            <Text>Paid</Text>
            <Text style={{ paddingTop: 2, paddingBottom: 10 }}>Total</Text>
            <Text>Debt</Text>
            <Text>Returns</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 50 }}>
            <View style={{ alignItems: "center", gap: 5 }}>
              <Text style={style.text}>Txn</Text>
              <Text style={style.text}>{saleCount}</Text>
              <Text style={style.text}>{0}</Text>
              <Text style={[style.text, { paddingTop: 2, paddingBottom: 10 }]}>{saleCount}</Text>
              <Text style={style.text}>{0}</Text>
              <Text style={style.text}>{0}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 5 }}>
              <Text style={style.text}>Amount</Text>
              <Text style={style.text}>{formatNumberWithCommas(tSales)}</Text>
              <Text style={style.text}>{formatNumberWithCommas(paid)}</Text>
              <Text style={[style.text, { paddingTop: 2, paddingBottom: 10 }]}>{formatNumberWithCommas(tSales + paid)}</Text>
              <Text style={style.text}>{0}</Text>
              <Text style={style.text}>{0}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserTable;

const style = StyleSheet.create({
  text: { fontWeight: "600" },
});

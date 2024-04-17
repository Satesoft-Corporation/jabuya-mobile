import React, { useState } from "react";
import { View, Text } from "react-native";
import { formatDate, formatNumberWithCommas } from "../../../utils/Utils";
import DataRow from "../../../components/cardComponents/DataRow";
import CardHeader from "../../../components/cardComponents/CardHeader";
import CardFooter1 from "../../../components/cardComponents/CardFooter1";
import CardFooter2 from "../../../components/cardComponents/CardFooter2";
import { useNavigation } from "@react-navigation/native";
import { UPDATE_PRICE } from "../../../navigation/ScreenNames";

function StockLevelItem({ data }) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const summary = data?.performanceSummary;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  let remainingStock =
    summary?.totalQuantityStocked - summary?.totalQuantitySold;

  if (
    remainingStock === undefined ||
    isNaN(remainingStock) ||
    remainingStock < 1
  ) {
    remainingStock = 0;
  }
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
      <CardHeader
        value1={`SN: ${data?.serialNumber}`}
        value2={formatDate(data?.dateCreated)}
      />

      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <View style={{ alignItems: "left", flex: 2 }}>
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

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Sold
          </Text>
          <Text
            style={{
              alignSelf: "center",
              marginEnd: 2,
            }}
          >
            {summary?.totalQuantitySold || 0}
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Stock
          </Text>
          <Text style={{ fontWeight: 600 }}>{remainingStock}</Text>
        </View>

        <View style={{ alignItems: "flex-end", flex: 1, marginEnd: 0 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Amount
          </Text>
          <Text style={{ fontWeight: 600 }}>
            {formatNumberWithCommas(remainingStock * data?.salesPrice)}
          </Text>
        </View>
      </View>

      {expanded && (
        <View
          style={{
            justifyContent: "space-between",
          }}
        >
          <DataRow
            label={"Selling prie"}
            value={`UGX${formatNumberWithCommas(data?.salesPrice)}`}
          />
          <DataRow
            label={"Last restock"}
            value={formatDate(data?.dateChanged, true)}
          />
          <DataRow label={"Barcode"} value={data?.barcode} />
          <DataRow label={"Category"} value={data?.categoryName} />
          <DataRow label={"Status"} value={data?.recordStatus} />
          <DataRow label={"Container portion"} value={data?.saleUnitName} />
          <DataRow label={"Listed by"} value={data?.createdByFullName} />
          <DataRow
            label={"Last restocked by"}
            value={data?.changedByFullName}
          />
          <CardFooter1
            btnTitle1="Price"
            btnTitle2="Hide"
            onClick2={toggleExpand}
            onClick1={() => navigation.navigate(UPDATE_PRICE,data)}
          />
        </View>
      )}

      {!expanded && <CardFooter2 btnTitle={"More"} onBtnPress={toggleExpand} />}
    </View>
  );
}

export default StockLevelItem;

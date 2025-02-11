import CardHeader from "@components/card_components/CardHeader";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import { PDT_ENTRY } from "@navigation/ScreenNames";
import { useNavigation } from "@react-navigation/native";
import { formatNumberWithCommas } from "@utils/Utils";
import React, { useState } from "react";
import { View, Text } from "react-native";
import CardFooter from "@components/card_components/CardFooter";
import { getCanCreateUpdateMyShopStock, getCanViewShopCapital } from "duqactStore/selectors/permissionSelectors";
import { useSelector } from "react-redux";

function StockLevelCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const canViewCapital = useSelector(getCanViewShopCapital);
  const canDoStockCrud = useSelector(getCanCreateUpdateMyShopStock);

  const summary = data?.performanceSummary;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  let remainingStock = summary?.totalQuantityStocked - summary?.totalQuantitySold;

  if (remainingStock === undefined || isNaN(remainingStock) || remainingStock < 1) {
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
      <CardHeader value1={`SN: ${data?.serialNumber}`} date={data?.dateCreated} shop={data?.shopName} />

      <View style={{ flexDirection: "row", marginVertical: 10, justifyContent: "space-between" }}>
        <DataColumn title={"Product"} value={data?.productName} left />

        <DataColumn title={"Sold"} value={Math.round(summary?.totalQuantitySold) || 0} />

        <DataColumn title={"Stock"} value={Math.round(remainingStock)} />

        {canViewCapital && <DataColumn title={"Value"} value={formatNumberWithCommas(remainingStock * data?.salesPrice, data?.currency)} />}
      </View>

      {expanded && (
        <View style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <DataRow label={"Product"} value={data?.productName} />
          <DataRow label={"Price"} value={formatNumberWithCommas(data?.salesPrice, data?.currency)} />
          <DataRow label={"Portion"} value={data?.saleUnitName} />
          <DataRow label={"Barcode"} value={data?.barcode} />
          <DataRow label={"Category"} value={data?.categoryName} />

          <DataRow label={"Listed by"} value={data?.createdByFullName} />

          {data?.remarks && (
            <>
              <DataRow label="Remarks" />
              <Text>{data?.remarks}</Text>
            </>
          )}
        </View>
      )}

      <CardFooter
        btnTitle2={expanded ? "Hide" : "More"}
        onClick2={toggleExpand}
        label={expanded ? null : data?.createdByFullName}
        listed={!expanded}
        expanded={expanded}
        edit={canDoStockCrud}
        onEdit={() => navigation.navigate(PDT_ENTRY, data)}
      />
    </View>
  );
}

export default StockLevelCard;

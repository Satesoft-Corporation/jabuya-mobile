import React, { useState } from "react";
import { View, Text } from "react-native";
import { formatDate, formatNumberWithCommas } from "../../../utils/Utils";
import DataRow from "../../../components/card_components/DataRow";
import CardHeader from "../../../components/card_components/CardHeader";
import CardFooter1 from "../../../components/card_components/CardFooter1";
import CardFooter2 from "../../../components/card_components/CardFooter2";
import { useNavigation } from "@react-navigation/native";
import { PDT_ENTRY, UPDATE_PRICE } from "../../../navigation/ScreenNames";
import DataColumn from "../../../components/card_components/DataColumn";

function StockLevelCard({ data }) {
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
        date={data?.dateCreated}
        shop={data?.shopName}
      />

      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <DataColumn title={"Product"} value={data?.productName} left flex={2} />

        <DataColumn
          title={"Sold"}
          value={Math.round(summary?.totalQuantitySold) || 0}
        />
        <DataColumn title={"Stock"} value={Math.round(remainingStock)} />
        <DataColumn
          title={"Value"}
          value={Math.round(remainingStock * data?.salesPrice)}
          end
          isCurrency
        />
      </View>

      {expanded && (
        <View
          style={{
            justifyContent: "space-between",
          }}
        >
          <DataRow
            label={"Price"}
            value={formatNumberWithCommas(data?.salesPrice)}
            showCurrency
          />
          <DataRow
            label={"Status"}
            value={
              data?.recordStatus[0] +
              String(data?.recordStatus).slice(1).toLowerCase()
            }
          />
          <DataRow label={"Portion"} value={data?.saleUnitName} />
          <DataRow label={"Barcode"} value={data?.barcode} />
          <DataRow label={"Category"} value={data?.categoryName} />
          <DataRow label={"Restocked by"} value={data?.changedByFullName} />
          <DataRow
            label={"Last restock"}
            value={formatDate(data?.dateChanged, true)}
          />
          <DataRow label={"Listed by"} value={data?.createdByFullName} />

          {data?.remarks && (
            <>
              <DataRow label="Remarks" />
              <Text>{data?.remarks}</Text>
            </>
          )}

          <CardFooter1
            btnTitle1="Edit"
            btnTitle2="Hide"
            onClick2={toggleExpand}
            onClick1={() => navigation.navigate(PDT_ENTRY, data)}
          />
        </View>
      )}

      {!expanded && (
        <CardFooter2
          btnTitle={"More"}
          onBtnPress={toggleExpand}
          label={<Text>Listed by: {data?.createdByFullName}</Text>}
        />
      )}
    </View>
  );
}

export default StockLevelCard;

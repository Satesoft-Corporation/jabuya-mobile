import CardFooter from "@components/card_components/CardFooter";
import CardHeader from "@components/card_components/CardHeader";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import { STOCK_ENTRY_FORM } from "@navigation/ScreenNames";
import { useNavigation } from "@react-navigation/native";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { getIsShopAttendant } from "reducers/selectors";

const StockEntryCard = ({ data, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const navigation = useNavigation();

  const isShopAttendant = useSelector(getIsShopAttendant);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const { purchasedQuantity, productName, purchasePrice, createdByFullName, dateCreated, barcode, expiryDate, supplierName, batchNumber, remarks } =
    data ?? {};

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
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <DataColumn title={"Product"} left value={productName} key={1} />

        <DataColumn title={"Qty"} value={purchasedQuantity} key={2} />

        {!isShopAttendant && (
          <>
            <DataColumn title={"Cost"} value={formatNumberWithCommas(Math.round(purchasePrice / purchasedQuantity), data?.currency)} key={3} />
            <DataColumn title={"Amount"} value={formatNumberWithCommas(purchasePrice, data?.currency)} key={4} />
          </>
        )}
      </View>

      {expanded && (
        <View style={{ marginBottom: 10 }}>
          <DataRow label={"Product"} value={productName} />

          <DataRow label="Barcode" value={barcode} />
          <DataRow label="Batch no" value={batchNumber} />
          <DataRow label="Expiry date" value={formatDate(expiryDate, true)} />
          <DataRow label="Restock date" value={formatDate(dateCreated, true)} />
          <DataRow label="Supplier" value={supplierName} />
          {remarks && (
            <>
              <DataRow label="Remarks" />
              <Text>{remarks}</Text>
            </>
          )}
        </View>
      )}

      <CardFooter
        restocked
        label={createdByFullName}
        btnTitle1={expanded ? "Edit" : null}
        btnTitle2={expanded ? "Hide" : "More"}
        onClick1={() => navigation?.navigate(STOCK_ENTRY_FORM, data)}
        darkMode={false}
        onClick2={toggleExpand}
        deleteIcon={expanded}
        onDelete={handleDelete}
      />
    </View>
  );
};

export default StockEntryCard;

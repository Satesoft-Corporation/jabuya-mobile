import React, { useState } from "react";
import { View, Text } from "react-native";
import { formatDate } from "../../../utils/Utils";
import { useNavigation } from "@react-navigation/native";
import DataRow from "../../../components/cardComponents/DataRow";
import ChipButton2 from "../../../components/buttons/ChipButton2";
import { STOCK_ENTRY_FORM } from "../../../navigation/ScreenNames";
import CardHeader from "../../../components/cardComponents/CardHeader";
import DataColumn from "../../../components/cardComponents/DataColumn";

const StockEntryCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const navigation = useNavigation();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const {
    purchasedQuantity,
    productName,
    purchasePrice,
    createdByFullName,
    dateCreated,
    barcode,
    expiryDate,
    supplierName,
    batchNumber,
    remarks,
  } = data ?? {};

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
        value1={` SN: ${data?.serialNumber}`}
        value2={formatDate(data?.dateCreated)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <DataColumn
          title={"Product"}
          left
          value={productName}
          flex={2}
          key={1}
        />

        <DataColumn title={"Qty"} value={purchasedQuantity} key={2} />

        <DataColumn
          title={"Cost"}
          value={Math.round(purchasePrice / purchasedQuantity)}
          key={3}
          isCurrency
        />

        <DataColumn
          title={"Amount"}
          value={purchasePrice}
          key={4}
          isCurrency
          end
        />
      </View>

      {expanded && (
        <View>
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>
            Restock by:{" "}
            <Text style={{ fontWeight: 300, fontSize: 12 }}>
              {createdByFullName}
            </Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
          {expanded && (
            <ChipButton2
              onPress={() => navigation?.navigate(STOCK_ENTRY_FORM, data)}
              title={"Edit"}
              darkMode={false}
            />
          )}
          <ChipButton2
            onPress={toggleExpand}
            title={expanded ? "Hide" : "More"}
          />
        </View>
      </View>
    </View>
  );
};

export default StockEntryCard;

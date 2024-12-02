import CardFooter from "@components/card_components/CardFooter";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { memo, useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getShops } from "reducers/selectors";
import { scale } from "react-native-size-matters";
import Colors from "@constants/Colors";

function SaleTxnCard({ data, print, isShopAttendant, onDelete }) {
  // sales report item carduserType === userTypes.isShopAttendant;

  const shops = useSelector(getShops) ?? [];

  const { lineItems, totalCost, amountPaid, balanceGivenOut } = data;

  const [expanded, setExpanded] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [profit, setProfit] = useState(0);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  useEffect(() => {
    if (lineItems !== undefined) {
      let cartQty = lineItems.reduce((a, item) => a + item.quantity, 0);
      let cartProfit = lineItems.reduce((a, i) => a + i.totalProfit, 0);

      setItemCount(cartQty);
      setProfit(Math.round(cartProfit));
    }
  }, [data]);

  const serialNumber = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: !expanded ? 10 : 0,
        }}
      >
        <Text
          style={[
            {
              fontSize: scale(12),
            },
          ]}
        >
          SN: {data?.serialNumber}
        </Text>
        <Text
          style={{
            fontSize: scale(12),
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(data?.dateCreated)}
        </Text>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 3,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: balanceGivenOut < 0 ? 1 : 0,
        gap: 8,
      }}
    >
      {expanded && serialNumber()}

      {!expanded && (
        <View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: scale(14),
            }}
          >
            Items
          </Text>
          <Text numberOfLines={2} style={{ fontWeight: "500" }}>
            {data?.name}
          </Text>
        </View>
      )}

      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <DataColumn title={"Qty"} value={itemCount} />

            <DataColumn
              title={"Recieved"}
              value={amountPaid}
              currency={data?.currency}
            />

            <DataColumn
              title={"Amount"}
              value={totalCost}
              currency={data?.currency}
            />
            <DataColumn
              title={"Balance"}
              value={balanceGivenOut}
              currency={data?.currency}
            />
          </View>
        </>
      )}
      {expanded && (
        <View style={{ flex: 1, marginTop: 10 }}>
          <View style={{ marginVertical: 5 }}>
            <SalesTable
              sales={lineItems}
              fixHeight={false}
              disableSwipe={true}
            />
          </View>
          <DataRow
            key={1}
            label={"Total"}
            value={formatNumberWithCommas(totalCost)}
            style={{ marginTop: 5, marginBottom: 10 }}
            currency={data?.currency}
          />

          <DataRow
            key={2}
            label={"Recieved"}
            value={formatNumberWithCommas(amountPaid)}
            currency={data?.currency}
          />
          <DataRow
            key={3}
            label={`Purchased ${
              itemCount > 1 ? `${itemCount} items` : `${itemCount} item`
            }`}
            value={formatNumberWithCommas(totalCost)}
            currency={data?.currency}
          />

          <DataRow
            key={4}
            label={"Balance"}
            value={formatNumberWithCommas(balanceGivenOut)}
            currency={data?.currency}
          />
          {!isShopAttendant && (
            <DataRow
              key={5}
              label={"Income"}
              value={formatNumberWithCommas(profit)}
              currency={data?.currency}
            />
          )}

          {data?.clientName && (
            <DataRow key={6} label={"Client's name"} value={data?.clientName} />
          )}

          {data?.clientPhoneNumber && (
            <DataRow
              key={7}
              label={"Client's mobile"}
              value={data?.clientPhoneNumber}
            />
          )}
        </View>
      )}

      {shops?.length > 1 && <Text>{data?.shopName}</Text>}

      {!expanded && serialNumber()}

      <CardFooter
        onClick2={toggleExpand}
        btnTitle1={expanded ? "Print" : null}
        label={data?.createdByFullName}
        served
        darkMode={!expanded}
        btnTitle2={expanded ? "Hide" : "More"}
        onClick1={() => print(data)}
        deleteIcon={expanded}
        onDelete={onDelete}
      />
    </View>
  );
}

export default memo(SaleTxnCard);

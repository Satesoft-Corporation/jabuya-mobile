import CardFooter from "@components/card_components/CardFooter";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { memo, useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getShops } from "duqactStore/selectors";
import { scale } from "react-native-size-matters";
import Colors from "@constants/Colors";
import { getCanDeleteSales, getCanViewShopIncome } from "duqactStore/selectors/permissionSelectors";
import ChipButton2 from "@components/buttons/ChipButton2";
import { useNavigation } from "@react-navigation/native";
import { CREDIT_PAYMENTS } from "@navigation/ScreenNames";

function SaleTxnCard({ data, print, onDelete, onSwipe }) {
  const shops = useSelector(getShops) ?? [];
  const canViewIncome = useSelector(getCanViewShopIncome);

  const navigation = useNavigation();
  const canDeleteSales = useSelector(getCanDeleteSales);

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
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: !expanded ? 10 : 0, alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: scale(12) }}>SN: {data?.serialNumber}</Text>

          <Text style={{ fontSize: scale(12), color: Colors.gray, alignSelf: "flex-end" }}>{formatDate(data?.dateCreated)}</Text>
        </View>
        {data?.attendantDailyReceiptCount && <ChipButton2 title={data?.attendantDailyReceiptCount} darkMode={false} />}
      </View>
    );
  };

  if (data?.creditSale) {
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
          gap: 5,
        }}
      >
        <View>
          <Text>Debt payment for {data?.creditSale?.shopClient?.fullName}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <Text>Amount</Text>

            <Text style={{ fontWeight: "600" }}>{formatNumberWithCommas(data?.amount, data?.currency)}</Text>
          </View>

          {serialNumber()}
        </View>

        <CardFooter label={data?.createdByFullName} paid />
      </View>
    );
  }

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
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>Items</Text>

            {data?.clientName && (
              <Text>
                Client:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {data?.clientName} {data?.clientPhoneNumber}
                </Text>
              </Text>
            )}
          </View>
          <Text numberOfLines={2} style={{ fontWeight: 600 }}>
            {data?.name?.trim()}
          </Text>
        </View>
      )}

      {!expanded && (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <DataColumn title={"Qty"} value={itemCount} />

            <DataColumn title={"Recieved"} value={formatNumberWithCommas(amountPaid, data?.currency)} />

            <DataColumn title={"Amount"} value={formatNumberWithCommas(totalCost, data?.currency)} />
            <DataColumn title={"Balance"} value={formatNumberWithCommas(balanceGivenOut, data?.currency)} />
          </View>
        </>
      )}
      {expanded && (
        <View style={{ flex: 1, marginTop: 10 }}>
          <View style={{ marginVertical: 5 }}>
            <SalesTable sales={lineItems} disableSwipe={lineItems?.length < 1} onDelete={onSwipe} returned />
          </View>
          <DataRow key={1} label={"Total"} value={formatNumberWithCommas(totalCost, data?.currency)} style={{ marginTop: 5, marginBottom: 10 }} />

          <DataRow key={2} label={"Recieved"} value={formatNumberWithCommas(amountPaid, data?.currency)} />

          <DataRow
            label={`Purchased ${itemCount > 1 ? `${itemCount} items` : `${itemCount} item`}`}
            value={formatNumberWithCommas(totalCost, data?.currency)}
          />

          {balanceGivenOut !== 0 && <DataRow key={4} label={"Balance"} value={formatNumberWithCommas(balanceGivenOut, data?.currency)} />}

          {data?.debtBalance > 0 && (
            <DataRow key={6} label={"Outstanding balance"} value={formatNumberWithCommas(data?.debtBalance, data?.currency)} />
          )}

          {canViewIncome && <DataRow key={5} label={"Income"} value={formatNumberWithCommas(profit, data?.currency)} />}

          {data?.clientName && <DataRow key={63} label={"Client's name"} value={data?.clientName} />}

          {data?.clientPhoneNumber && <DataRow key={7} label={"Client's mobile"} value={data?.clientPhoneNumber} />}
        </View>
      )}

      {shops?.length > 1 && <Text>{data?.shopName}</Text>}

      {!expanded && serialNumber()}

      <CardFooter
        expanded={expanded}
        onClick2={toggleExpand}
        label={data?.createdByFullName}
        served
        btnTitle2={expanded ? "Hide" : "More"}
        onPrint={print}
        print
        deleteIcon={canDeleteSales}
        onDelete={onDelete}
        debt={balanceGivenOut < 0}
        onPayClick={() => navigation.navigate(CREDIT_PAYMENTS, { ...data, idType: "SaleId" })}
      />
    </View>
  );
}

export default SaleTxnCard;

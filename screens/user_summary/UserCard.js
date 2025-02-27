import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import DataColumn from "@components/card_components/DataColumn";
import CardFooter from "@components/card_components/CardFooter";
import UserTable from "./UserTable";
import { getOffersDebt } from "duqactStore/selectors";
import { useSelector } from "react-redux";

const UserCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const { reportDate, data } = item;
  const [totalSales, setTotalSales] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalTxn, setTotalTxn] = useState(0);

  const offersDebt = useSelector(getOffersDebt);

  useEffect(() => {
    const total = data?.reduce((a, b) => a + b?.totalSalesMade, 0);

    const totalD = data?.reduce((a, b) => a + b?.totalDebtsCollected, 0);

    const totalTs = data?.reduce((a, b) => a + b?.totalSalesCount, 0);

    setTotalSales(total);
    setTotalTxn(totalTs);
    setTotalDebt(totalD);
  }, []);
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
        {!expanded && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <DataColumn title={"Date"} value={formatDate(new Date(reportDate), true)} left />
              <DataColumn title={"Sales"} value={formatNumberWithCommas(totalSales)} />
              {offersDebt && (
                <>
                  <DataColumn title={"Paid"} value={formatNumberWithCommas(totalDebt)} />
                  <DataColumn title={"Debt"} value={formatNumberWithCommas(0)} />
                </>
              )}
            </View>
          </>
        )}

        {expanded && (
          <View style={{ gap: 15 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Sales summary</Text>
              <Text>{formatDate(new Date(reportDate), true)}</Text>
            </View>
            <UserTable data={data} offersDebt={offersDebt} />
          </View>
        )}
        <CardFooter btnTitle2={expanded ? "Hide" : "More"} onClick2={() => setExpanded(!expanded)} />
      </View>
    </View>
  );
};

export default UserCard;

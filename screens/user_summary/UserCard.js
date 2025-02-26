import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import DataColumn from "@components/card_components/DataColumn";
import CardFooter from "@components/card_components/CardFooter";
import UserTable from "./UserTable";

const UserCard = ({ item, users }) => {
  const [expanded, setExpanded] = useState(false);
  const { reportDate, data } = item;
  const [totalSales, setTotalSales] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    const total = data?.reduce((a, b) => a + b?.totalSalesMade, 0);

    const totalD = data?.reduce((a, b) => a + b?.totalDebtsCollected, 0);

    setTotalSales(total);

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
              {/* <DataColumn title={"Txns"} value={data?.length} /> */}
              <DataColumn title={"Sales"} value={formatNumberWithCommas(totalSales)} />
              <DataColumn title={"Debt"} value={formatNumberWithCommas(totalDebt)} />
            </View>
          </>
        )}

        {expanded && (
          <View style={{ gap: 10 }}>
            <Text>{formatDate(new Date(reportDate), true)}</Text>
            <UserTable data={data} />
          </View>
        )}
        <CardFooter btnTitle2={expanded ? "Hide" : "More"} onClick2={() => setExpanded(!expanded)} />
      </View>
    </View>
  );
};

export default UserCard;

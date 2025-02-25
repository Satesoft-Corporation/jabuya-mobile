import { View, Text } from "react-native";
import React, { useState } from "react";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import DataColumn from "@components/card_components/DataColumn";
import CardFooter from "@components/card_components/CardFooter";
import UserTable from "./UserTable";

const UserCard = ({ item, users }) => {
  const [expanded, setExpanded] = useState(false);

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
              <DataColumn title={"Date"} value={formatDate(new Date(), true)} left/>
              <DataColumn title={"Txns"} value={item?.totalItems} />
              <DataColumn title={"Sales"} value={formatNumberWithCommas(item?.totalSalesValue)} />
              <DataColumn title={"Debt"} value={formatNumberWithCommas(item?.totalCapital)} />
            </View>
          </>
        )}

        {expanded && (
          <View style={{ gap: 10 }}>
            <Text>{formatDate(new Date(), true)}</Text>
            <UserTable data={users} />
          </View>
        )}
        <CardFooter btnTitle2={expanded ? "Hide" : "More"} onClick2={() => setExpanded(!expanded)} />
      </View>
    </View>
  );
};

export default UserCard;

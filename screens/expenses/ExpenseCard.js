import { View, Text } from "react-native";
import React from "react";
import { BaseStyle } from "@utils/BaseStyle";
import { formatDate } from "@utils/Utils";
import DataColumn from "@components/card_components/DataColumn";
import Colors from "@constants/Colors";
import CardFooter from "@components/card_components/CardFooter";

const ExpenseCard = ({ exp }) => {
  return (
    <View style={BaseStyle.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {exp?.shopName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(exp?.dateCreated)}
        </Text>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={{ fontWeight: 600 }}>Description</Text>
        <Text numberOfLines={3}>{exp?.description}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          justifyContent: "space-between",
        }}
      >
        <DataColumn value={exp?.categoryName} title={"Category"} left />

        <DataColumn
          value={exp?.amount}
          title={"Amount"}
          currency={exp?.currency}
        />
      </View>

      <CardFooter label={exp?.createdByFullName} entered />
    </View>
  );
};

export default ExpenseCard;

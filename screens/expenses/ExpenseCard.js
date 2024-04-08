import { View, Text } from "react-native";
import React from "react";
import { BaseStyle } from "../../utils/BaseStyle";
import CardHeader from "../../components/cardComponents/CardHeader";
import { formatNumberWithCommas } from "../../utils/Utils";
import CardFooter1 from "../../components/cardComponents/CardFooter1";
import CardFooter2 from "../../components/cardComponents/CardFooter2";

const ExpenseCard = () => {
  let data = {};
  return (
    <View style={BaseStyle.card}>
      <CardHeader value1={"test"} value2={"info"} />
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <View style={{ alignItems: "left", flex: 2 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Description
          </Text>
          <Text>Description</Text>
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Category
          </Text>
          <Text style={{ alignSelf: "center" }}>
            {data?.categoryName || "None"}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", flex: 1, marginEnd: 5 }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Amount
          </Text>
          <Text
            style={{
              marginEnd: 2,
            }}
          >
            {formatNumberWithCommas(20000)}
          </Text>
        </View>
      </View>

      <CardFooter2 btnTitle="More" label={"Entered by"} />
    </View>
  );
};

export default ExpenseCard;

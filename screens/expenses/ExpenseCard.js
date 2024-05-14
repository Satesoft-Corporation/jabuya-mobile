import { View } from "react-native";
import React from "react";
import { BaseStyle } from "../../utils/BaseStyle";
import CardHeader from "../../components/cardComponents/CardHeader";
import { formatDate } from "../../utils/Utils";
import CardFooter2 from "../../components/cardComponents/CardFooter2";
import DataColumn from "../../components/cardComponents/DataColumn";

const ExpenseCard = ({ exp }) => {
  return (
    <View style={BaseStyle.card}>
      <CardHeader
        value1={exp?.shopName}
        value2={formatDate(exp?.dateCreated)}
      />
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <DataColumn value={exp?.description} title={"Description"} left />

        <DataColumn value={exp?.categoryName} title={"Category"} />
        <DataColumn value={exp?.amount} title={"Amount"} end isCurrency />
      </View>

      <CardFooter2
        btnTitle="More"
        label={`Entered by ${exp?.createdByFullName}`}
        renderBtn={false}
      />
    </View>
  );
};

export default ExpenseCard;

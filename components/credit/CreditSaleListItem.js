import { View, Text } from "react-native";
import React from "react";
import CardHeader from "../cardComponents/CardHeader";
import { formatDate, formatNumberWithCommas } from "../../utils/Utils";
import CardFooter1 from "../cardComponents/CardFooter1";
import CardFooter2 from "../cardComponents/CardFooter2";
import { useNavigation } from "@react-navigation/native";

const CreditSaleListItem = ({ sale }) => {
  const navigation = useNavigation();
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
        value1={`CSN: ${sale?.serialNumber}`}
        value2={formatDate(sale?.dateCreated)}
      />
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "left" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 3,
            }}
          >
            Client
          </Text>
          <Text style={{ fontWeight: 500 }}>{sale?.shopClient?.fullName}</Text>
          <Text style={{ fontWeight: 400, fontSize: 12 }}>
            Mob: {sale?.shopClient?.phoneNumber}
          </Text>
        </View>

        {/* <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Txns
          </Text>
          <Text>{"0"}</Text>
        </View> */}

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Credit
          </Text>
          <Text>{formatNumberWithCommas(sale?.amountLoaned)}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Paid
          </Text>
          <Text>{formatNumberWithCommas(sale?.amountRepaid)}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Balance
          </Text>
          <Text>
            {formatNumberWithCommas(sale?.amountLoaned - sale?.amountRepaid)}
          </Text>
        </View>
      </View>

      <CardFooter2
        label={`Served by: ${sale?.createdByFullName}`}
        btnTitle="Pay"
        onBtnPress={() => {
          navigation.navigate("credit_payments", sale);
        }}
      />
    </View>
  );
};

export default CreditSaleListItem;

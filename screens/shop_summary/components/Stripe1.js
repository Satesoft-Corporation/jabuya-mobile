import { View, Text } from "react-native";
import React from "react";
import { formatNumberWithCommas } from "../../../utils/Utils";
import Colors from "../../../constants/Colors";
import { Image } from "react-native";

const Stripe = ({ label1, label2, value, icon }) => {
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
        borderRadius: 3,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Image
          source={require("../../../assets/icons/icons8-box-501.png")}
          style={{
            width: 40,
            height: 40,
            tintColor: Colors.dark,
            marginEnd: 10,
          }}
        />
        <View>
          <Text style={{ fontWeight: 400, }}>Stock</Text>
          <Text style={{ fontWeight: 300, fontSize: 10 }}>Total Value</Text>
        </View>
      </View>

      <View>
        <Text style={{ fontWeight: 500, fontSize: 20, marginEnd: 10 }}>
          {formatNumberWithCommas(value)}
        </Text>
      </View>
    </View>
  );
};

export default Stripe;

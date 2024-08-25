import { View, Text } from "react-native";
import React from "react";
import { extractTime, formatDate } from "@utils/Utils";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const CardHeader = ({ value1, date = new Date(), value1Style, shop }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            fontSize: scale(12),
            fontWeight: "bold",
          }}
        >
          {shop}
        </Text>

        <Text
          style={[
            {
              fontSize: scale(12),
            },
            value1Style,
          ]}
        >
          {value1}
        </Text>
      </View>

      <View>
        <Text
          style={{
            fontSize: scale(12),
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(date, true)}
        </Text>

        <Text
          style={{
            fontSize: scale(12),
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {extractTime(date)}
        </Text>
      </View>
    </View>
  );
};

export default CardHeader;

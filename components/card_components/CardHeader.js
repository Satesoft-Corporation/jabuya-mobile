import { View, Text } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { extractTime, formatDate } from "../../utils/Utils";

const CardHeader = ({ value1, date = new Date(), value1Style, shop }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: 5 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {shop}
        </Text>

        <Text
          style={[
            {
              fontSize: 12,
            },
            value1Style,
          ]}
        >
          {value1}
        </Text>
      </View>

      <View style={{ gap: 5 }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {formatDate(date, true)}
        </Text>

        <Text
          style={{
            fontSize: 12,
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

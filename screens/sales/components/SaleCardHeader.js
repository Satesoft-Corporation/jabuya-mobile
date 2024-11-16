import { View, Text } from "react-native";
import React from "react";
import { extractTime, formatDate } from "@utils/Utils";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const SaleCardHeader = ({ data, expanded }) => {
  return (
    <View style={{ gap: 10 }}>
      {expanded && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              {
                fontSize: scale(12),
              },
            ]}
          >
            SN: {data?.serialNumber}
          </Text>
          <Text
            style={{
              fontSize: scale(12),
              color: Colors.gray,
              alignSelf: "flex-end",
            }}
          >
            {formatDate(data?.dateCreated)}
          </Text>
        </View>
      )}

      {!expanded && (
        <View>
          <Text
            style={{
              fontWeight: 600,
              fontSize: scale(14),
            }}
          >
            Items
          </Text>
          <Text numberOfLines={2} style={{ fontWeight: "500" }}>
            {data?.name}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SaleCardHeader;

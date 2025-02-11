import { View, Text } from "react-native";
import React from "react";
import { extractTime, formatDate } from "@utils/Utils";
import Colors from "@constants/Colors";
import { scale } from "react-native-size-matters";

const LeadCardHeader = ({ data, expanded }) => {
  return (
    <View style={{ gap: 10 }}>
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
          LID: {data?.id}
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

      {expanded === false && (
        <View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: scale(11),
            }}
          >
            Shop name
          </Text>
          <Text numberOfLines={2} style={{ fontWeight: "500" }}>
            {data?.shopName}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LeadCardHeader;

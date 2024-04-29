import { View, Text } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const CardHeader = ({ value1, value2, value1Style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.dark,
            marginBottom: 2,
          },
          value1Style,
        ]}
      >
        {value1}
      </Text>

      <View>
        <Text
          style={{
            fontSize: 12,
            color: Colors.gray,
            alignSelf: "flex-end",
          }}
        >
          {value2}
        </Text>
      </View>
    </View>
  );
};

export default CardHeader;

import { View, Text } from "react-native";
import React from "react";
import RenderCurrency from "../RenderCurrency";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const DataColumn = ({
  title,
  value,
  value2,
  currency,
  left = false,
  end = false,
}) => {
  const align = left ? "left" : end ? "flex-end" : "center";

  return (
    <View style={{ maxWidth: 120 }}>
      <Text
        style={{
          fontWeight: 600,
          fontSize: scale(14),
          textAlign: align,
        }}
      >
        {title}
      </Text>
      {currency ? (
        <RenderCurrency value={value} currencySymbol={currency} />
      ) : (
        <Text
          style={{ fontSize: scale(13), textAlign: align }}
          numberOfLines={2}
        >
          {value}
        </Text>
      )}

      {value2 && (
        <Text style={{ fontSize: 13, textAlign: align }}>{value2}</Text>
      )}
    </View>
  );
};

export default DataColumn;

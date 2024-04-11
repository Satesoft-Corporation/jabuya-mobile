import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";

const CardFooter2 = ({
  label,
  btnTitle = "",
  onBtnPress,
  renderBtn = true,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <View>
        <Text style={{ fontSize: 13, fontWeight: 600 }}>
          <Text style={{ fontWeight: 400 }}>{label}</Text>
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        {renderBtn && <ChipButton2 title={btnTitle} onPress={onBtnPress} />}
      </View>
    </View>
  );
};

export default CardFooter2;

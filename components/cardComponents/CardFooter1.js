import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";

const CardFooter1 = ({ label, btnTitle1, btnTitle2, onClick1, onClick2 }) => {
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
        <ChipButton2 darkMode={false} title={"Pay"} />
        <ChipButton2 title={"More"} />
      </View>
    </View>
  );
};

export default CardFooter1;

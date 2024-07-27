import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";

const CardFooter2 = ({
  label,
  btnTitle = "",
  btnTitle1 = "label1",
  btnTitle2 = "label2",
  onClick1,
  onClick2,
  onBtnPress,
  renderBtn = true,
  style,
  renderLeft = () => {},
  restocked = false,
  entered = false,
  listed = false,
  served = false,
  cleared = false,
  darkMode = true,
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        style,
      ]}
    >
      {renderLeft()}
      <Text style={{ fontSize: 13, fontWeight: 600 }}>
        {restocked === true && "Restocked by: "}
        {entered === true && "Entered by: "}
        {listed === true && "Listed by: "}
        {served === true && "Served by: "}
        {cleared === true && "Cleared by: "}
        <Text style={{ fontWeight: 400 }}>{label}</Text>
      </Text>

      {renderBtn && (
        <ChipButton2
          title={btnTitle}
          onPress={onBtnPress}
          darkMode={darkMode}
        />
      )}
    </View>
  );
};

export default CardFooter2;

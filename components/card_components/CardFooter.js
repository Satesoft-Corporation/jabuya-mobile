import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";
import Icon from "@components/Icon";
import { useSelector } from "react-redux";
import { getUserType } from "reducers/selectors";
import { userTypes } from "@constants/Constants";

const CardFooter = ({
  label,
  btnTitle1,
  btnTitle2,
  onClick1,
  onClick2,
  onDelete,
  style,
  renderLeft = () => {},
  restocked = false,
  entered = false,
  listed = false,
  served = false,
  cleared = false,
  darkMode = true,
  deleteIcon = false,
}) => {
  const userType = useSelector(getUserType);
  const isShopAttendant = userType === userTypes.isShopAttendant;
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
      <Text style={{ fontSize: 13, fontWeight: 400 }}>
        {restocked === true && "Restocked by: "}
        {entered === true && "Entered by: "}
        {listed === true && "Listed by: "}
        {served === true && "Served by: "}
        {cleared === true && "Cleared by: "}
        <Text style={{ fontWeight: 600 }}>{label}</Text>
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {deleteIcon && !isShopAttendant && (
          <ChipButton2
            title={<Icon name="trash" />}
            onPress={onDelete}
            darkMode={false}
          />
        )}

        {btnTitle1 && (
          <ChipButton2
            title={btnTitle1}
            onPress={onClick1}
            darkMode={darkMode}
          />
        )}
        {btnTitle2 && <ChipButton2 title={btnTitle2} onPress={onClick2} />}
      </View>
    </View>
  );
};

export default CardFooter;

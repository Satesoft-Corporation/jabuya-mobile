import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";
import Icon from "@components/Icon";
import { useSelector } from "react-redux";
import { getIsShopAttendant, getUserType } from "duqactStore/selectors";

const CardFooter = ({
  label,
  btnTitle1,
  btnTitle2,
  onClick1,
  onClick2,
  onDelete,
  onPrint,
  onEdit,
  handleDamage,
  renderLeft = () => {},
  restocked = false,
  entered = false,
  listed = false,
  served = false,
  cleared = false,
  deleteIcon = false,
  print = false,
  edit = false,
  damage = false,
  expanded,
}) => {
  const userType = useSelector(getUserType);
  const isShopAttendant = useSelector(getIsShopAttendant);
  return (
    <View style={{ gap: 3 }}>
      <View>
        {renderLeft()}
        <Text style={{ fontSize: 13, fontWeight: 400 }}>
          {restocked === true && "Restocked by: "}
          {entered === true && "Entered by: "}
          {listed === true && "Listed by: "}
          {served === true && "Served by: "}
          {cleared === true && "Cleared by: "}
          {label && <Text style={{ fontWeight: 600 }}>{label}</Text>}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 10, alignSelf: "flex-end", alignItems: "center" }}>
        {expanded == true && (
          <>
            {deleteIcon && !isShopAttendant && <Icon name="trash" borderd onPress={onDelete} size={13} />}
            {edit && !isShopAttendant && <Icon name="pen" size={13} borderd onPress={onEdit} />}
            {damage && !isShopAttendant && <Icon name="broken-image" groupName="MaterialIcons" size={16} borderd onPress={handleDamage} />}

            {print && <Icon name="printer" groupName="Feather" borderd onPress={onPrint} />}
          </>
        )}

        {btnTitle1 && <ChipButton2 title={btnTitle1} onPress={onClick1} darkMode={false} />}
        {btnTitle2 && <ChipButton2 title={btnTitle2} onPress={onClick2} />}
      </View>
    </View>
  );
};

export default CardFooter;

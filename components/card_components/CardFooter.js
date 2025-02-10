import { View, Text } from "react-native";
import React from "react";
import ChipButton2 from "../buttons/ChipButton2";
import Icon from "@components/Icon";

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
  onPayClick,
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
  debt = false,

  expanded,
}) => {
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
            {debt && <ChipButton2 title={"Pay"} onPress={onPayClick} darkMode={false} />}

            {deleteIcon === true && <Icon name="trash" borderd onPress={onDelete} size={13} />}
            {edit === true && <Icon name="pen" size={13} borderd onPress={onEdit} />}
            {damage === true && <Icon name="broken-image" groupName="MaterialIcons" size={16} borderd onPress={handleDamage} />}

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

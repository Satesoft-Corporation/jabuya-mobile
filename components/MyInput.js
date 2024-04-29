import { View, Text, TextInput } from "react-native";
import React, { memo, useState } from "react";
import Colors from "../constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "./Icon";
import { TouchableOpacity } from "react-native";
import { toReadableDate } from "../utils/Utils";

const MyInput = ({
  onValueChange,
  isPassword = false,
  label = "",
  inputMode = "text",
  isDateInput = false,
  style,
  editable = true,
  numberOfLines = 1,
  multiline = false,
  value,
  dateValue = new Date(),
  onDateChange,
}) => {
  const [visible, setVisible] = useState(false);

  const onChange = (event, selectedDate) => {
    setVisible(false);
    onDateChange(selectedDate);
  };

  return (
    <View style={[{ gap: 5 }, style]}>
      {label !== "" && <Text style={{ paddingHorizontal: 4 }}>{label}</Text>}
      <View
        style={{
          height: 40,
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: Colors.light,
          borderRadius: 5,
          padding: 6,
          borderWidth: 0.6,
          borderColor: Colors.dark,
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          value={isDateInput ? toReadableDate(dateValue) : value}
          onChangeText={onValueChange}
          secureTextEntry={isPassword}
          inputMode={inputMode}
          cursorColor={Colors.dark}
          editable={isDateInput ? false : editable}
          numberOfLines={numberOfLines}
          multiline={multiline}
          style={{
            color: Colors.dark,
            textAlign: inputMode === "numeric" ? "right" : "left",
            flex: 1,
          }}
        />

        {isDateInput && (
          <>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Icon name="calendar-alt" size={20} />
            </TouchableOpacity>
            {visible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateValue}
                mode={"date"}
                onChange={onChange}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default memo(MyInput);

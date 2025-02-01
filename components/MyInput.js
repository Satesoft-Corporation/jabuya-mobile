import { View, Text, TextInput, Pressable } from "react-native";
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
  maximumDate = false,
  minimumDate = false,
  onDateChange,
  darkMode = false,
  showError = false,
  isSubmitted,
  required = false,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [viewPassword, setViewPassword] = useState(isPassword);

  const togglePassword = (e) => setViewPassword(!viewPassword);

  const onChange = (event, selectedDate) => {
    setVisible(false);
    onDateChange(selectedDate);
  };

  return (
    <View style={[{}, style]}>
      {label !== "" && (
        <Text
          style={{
            paddingHorizontal: 4,
            color: darkMode ? Colors.primary : Colors.dark,
            marginBottom: 5,
          }}
        >
          {label}
          {required && <Text style={{ color: Colors.error }}>*</Text>}
        </Text>
      )}
      <Pressable
        onPress={() => {
          if (isDateInput) {
            setVisible(true);
          }
        }}
        style={{
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: darkMode ? Colors.dark : Colors.light,
          borderRadius: 5,
          padding: 6,
          borderWidth: 0.6,
          borderColor: darkMode ? Colors.primary : Colors.dark,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <TextInput
          value={isDateInput ? toReadableDate(dateValue) : value}
          onChangeText={onValueChange}
          secureTextEntry={viewPassword}
          inputMode={inputMode}
          cursorColor={darkMode ? Colors.primary : Colors.dark}
          editable={isDateInput ? false : editable}
          numberOfLines={numberOfLines}
          multiline={multiline}
          style={{
            color: darkMode ? Colors.primary : Colors.dark,
            textAlign: inputMode === "numeric" ? "right" : "left",
            flex: 1,
          }}
          {...props}
        />
        {isPassword && (
          <Icon
            size={18}
            name={viewPassword ? "eye" : "eye-off"}
            groupName="Feather"
            onPress={togglePassword}
            color={darkMode ? Colors.primary : ""}
          />
        )}
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
                style={{ fontSize: 10 }}
                maximumDate={maximumDate ? new Date() : null}
                minimumDate={minimumDate ? new Date() : null}
              />
            )}
          </>
        )}
      </Pressable>
      {isSubmitted && showError && !value && <Text style={{ fontSize: 12, color: Colors.error }}>{label} is required</Text>}
    </View>
  );
};

export default MyInput;

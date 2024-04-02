import { View, Text, TextInput } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { DatePickerInput, DatePickerModal } from "react-native-paper-dates";

const MyInput = ({
  value,
  onValueChange,
  isPassword = false,
  label = "Label",
  inputMode = "text",
  isDateInput = false,
  style,
}) => {
  if (isDateInput === false) {
    return (
      <View style={[{ gap: 5, marginBottom: 10 }, style]}>
        <Text>{label}</Text>

        <TextInput
          value={value}
          onChangeText={onValueChange}
          secureTextEntry={isPassword}
          inputMode={inputMode}
          cursorColor={Colors.dark}
          style={{
            backgroundColor: Colors.light,
            borderRadius: 5,
            padding: 6,
            borderWidth: 0.6,
            borderColor: Colors.dark,
            paddingHorizontal: 10,
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, gap: 5 }}>
        <Text>{label}</Text>
        <DatePickerInput
          locale="en"
          value={value}
          withModal={true}
          withDateFormatInLabel={false}
          placeholder="MM-DD-YYYY"
          onChange={onValueChange}
          inputMode="start"
          style={{
            height: 40,
            justifyContent: "center",
            // marginTop: -5,
          }}
          mode="outlined"
        />
      </View>
    );
  }
};

export default MyInput;

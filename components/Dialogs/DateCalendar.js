import { Calendar } from "react-native-calendars";
import ModalContent from "../ModalContent";
import { View } from "react-native";
import MaterialButton from "../MaterialButton";
import Colors from "../../constants/Colors";

export function DateCalender({
  selectedEndDate,
  visible,
  selectedStartDate,
  handleDayPress,
  setVisible,
  onFinish,
  setSelectedEndDate,
  setSelectedStartDate,
  singleSelection = false,
  titles = ["Cancel", "Apply"],
  moreCancelActions,
}) {
  const calendarTheme = {
    calendarBackground: "black",
    arrowColor: Colors.primary,
    todayTextColor: Colors.primary,
    monthTextColor: Colors.light,
    selectedDayBackgroundColor: Colors.primary,
    textDisabledColor: Colors.gray, //other months dates
    textSectionTitleColor: Colors.light, // days
    dayTextColor: Colors.light,
    selectedDayTextColor: "black",
  };

  const markedDates = () => {
    if (singleSelection === true) {
      return {
        [selectedStartDate]: {
          selected: true,
          startingDay: true,
          endingDay: true,
        },
      };
    }
    return {
      [selectedStartDate]: {
        selected: true,
        startingDay: true,
        endingDay: selectedEndDate === selectedStartDate,
      },
      [selectedEndDate]: {
        selected: true,
        endingDay: true,
      },
    };
  };
  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Calendar
        theme={calendarTheme}
        onDayPress={handleDayPress}
        markedDates={markedDates()}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 15,
        }}
      >
        <MaterialButton
          title={titles[0]}
          style={{
            backgroundColor: "transparent",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.dark,
            marginStart: -2,
            margin: 10,
            height: 40,
          }}
          titleStyle={{
            fontWeight: "bold",
            color: Colors.dark,
          }}
          buttonPress={() => {
            moreCancelActions();
            setVisible(false);
            setSelectedEndDate(null);
            setSelectedStartDate(null);
          }}
        />
        <MaterialButton
          title={titles[1]}
          style={{
            backgroundColor: Colors.dark,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.dark,
            marginStart: 2,
            marginEnd: -2,
            margin: 10,
            height: 40,
          }}
          titleStyle={{
            fontWeight: "bold",
            color: Colors.primary,
          }}
          buttonPress={() => {
            setVisible(false);
            onFinish();
            setSelectedEndDate(null);
            setSelectedStartDate(null);
          }}
          disabled={!selectedStartDate && !selectedEndDate}
        />
      </View>
    </ModalContent>
  );
}

import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";

import Card from "./Card";
import ModalContent from "./ModalContent";
import MaterialButton from "./MaterialButton";
import { SaleItem } from "./TransactionItems";

import Colors from "../constants/Colors";
import { formatDate, formatNumberWithCommas } from "../utils/Utils";

export function SalesQtyInputDialog({
  showMoodal,
  selection,
  errors,
  setErrors,
  setShowModal,
  quantity,
  setQuantity,
  saveSelection,
  setUnitCost,
  unitCost,
  setSelection,
}) {
  return (
    <ModalContent visible={showMoodal} style={{ padding: 35 }}>
      <Card
        style={{
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 2,
          }}
        >
          <View
            style={{
              marginTop: 10,
              marginBottom: 5,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 20,
                marginBottom: 5,
              }}
            >
              Successfull
            </Text>
            <Text>{selection && selection.productName} has been selected.</Text>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              Quantity
            </Text>
          </View>

          <TextInput
            onFocus={() => setErrors(null)}
            onBlur={() => setErrors(null)}
            textAlign="right"
            inputMode="numeric"
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
            maxLength={3}
            style={{
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderWidth: 1,
              borderColor: errors?.qtyZeroError ? Colors.error : "transparent",
            }}
          />
          {errors?.qtyZeroError && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              {errors?.qtyZeroError}
            </Text>
          )}
          <Text
            style={{
              fontWeight: "600",
              fontSize: 13,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            Unit cost
          </Text>
          <TextInput
            textAlign="right"
            value={unitCost}
            inputMode="numeric"
            onChangeText={(e) => setUnitCost(e)}
            style={{
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderColor: errors?.lessPriceError
                ? Colors.error
                : "transparent",
            }}
          />
          {errors?.lessPriceError && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              {errors?.lessPriceError}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            <MaterialButton
              title="Cancel"
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
                setShowModal(false);
                setErrors({});
                setSelection(null);
              }}
            />
            <MaterialButton
              title="Confirm"
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
                saveSelection();
              }}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export function ConfirmSalesDialog({
  visible,
  addSale,
  sales,
  total,
  setVisible,
  length,
  balanceGivenOut,
  amountPaid,
  resetList,
  dateCreated,
}) {
  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Card
        style={{
          alignSelf: "center",
          minHeight: 120,
          maxHeight: 490,
          width: 315,
          paddingBottom: 7,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.light,
            padding: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
                marginStart: 1,
              }}
            >
              Confirm sale
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible();
                resetList();
              }}
            >
              <Image
                source={require("../assets/icons/ic_close.png")}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: "contain",
                  marginStart: 15,
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 12,
                color: Colors.gray,
                alignSelf: "flex-end",
              }}
            >
              {formatDate(dateCreated)}
            </Text>
            <Text>Currency : UGX</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 25,
              paddingEnd: 10,
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.3,
              marginTop: 10,
            }}
          >
            <Text style={{ flex: 2.5, fontWeight: 600 }}>Item</Text>
            <Text style={{ flex: 0.5, textAlign: "center", fontWeight: 600 }}>
              Qty
            </Text>
            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Cost
            </Text>

            <Text style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
              Amount
            </Text>
          </View>
          <FlatList
            data={sales}
            renderItem={({ item }) => (
              <SaleItem data={item} itemCount={length} total={total} />
            )}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Recieved </Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(amountPaid)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 3,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Sold{" "}
              <Text style={{ fontWeight: "400" }}>
                {length >= 1 && (
                  <Text>
                    {length}
                    {length > 1 ? <Text> items</Text> : <Text> item</Text>}
                  </Text>
                )}
              </Text>
            </Text>

            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
              }}
            >
              {formatNumberWithCommas(total)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Balance</Text>
            <Text
              style={{
                alignSelf: "flex-end",
                fontWeight: "bold",
                marginEnd: 4,
                fontSize: 15,
              }}
            >
              {formatNumberWithCommas(balanceGivenOut)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <MaterialButton
              title="Cancel"
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
                setVisible();
                resetList();
              }}
            />
            <MaterialButton
              title="OK"
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
              buttonPress={() => addSale()}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export function SalesDateRangePicker({
  selectedEndDate,
  visible,
  selectedStartDate,
  handleDayPress,
  setFiltering,
  setVisible,
  onFinish,
  setSelectedEndDate,
  setSelectedStartDate,
  singleSelection = false,
  titles = ["Cancel", "Apply"],
  moreCancelActions
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
            moreCancelActions()
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
            setFiltering(true);
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

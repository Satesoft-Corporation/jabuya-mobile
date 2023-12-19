import { Text, View } from "react-native";
import Card from "./Card";
import ModalContent from "./ModalContent";
import MaterialButton from "./MaterialButton";
import Colors from "../constants/Colors";
import React from "react";
import { TextInput } from "react-native-paper";

export const SalesInfoDialog = ({
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
}) => {
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
            borderColor: errors?.lessPriceError ? Colors.error : "transparent",
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
  </ModalContent>;
};

import { Text, View, FlatList, TextInput } from "react-native";
import React, { useContext, useState } from "react";
import { SaleEntryContext } from "../../context/SaleEntryContext";
import ModalContent from "../ModalContent";
import Card from "../Card";
import ChipButton from "../buttons/ChipButton";
import PrimaryButton from "../buttons/PrimaryButton";
import Colors from "../../constants/Colors";

export default function EnterSaleQtyModal() {
  const [submitted, setSubmitted] = useState(false);

  const {
    selection,
    setSelection,
    setSelectedSaleUnit,
    selectedSaleUnit,
    setUnitCost,
    setScanned,
    saveSelection,
    setQuantity,
    quantity,
    setErrors,
    errors,
    unitCost,
    showMoodal,
    setShowModal,
    onChipPress,
    saleUnits,
    setInitialUnitCost,
  } = useContext(SaleEntryContext);

  const handlePress = () => {
    if (selectedSaleUnit) {
      saveSelection();
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  };

  const renderFooter = () => {
    if (submitted && !selectedSaleUnit) {
      return (
        <Text
          style={{
            fontSize: 12,
            color: Colors.error,
          }}
        >
          Sale unit is required
        </Text>
      );
    }
  };

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

            {!selectedSaleUnit && (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Select sale unit
                </Text>

                <FlatList
                  data={saleUnits}
                  renderItem={({ item }) => (
                    <ChipButton
                      title={item?.productSaleUnitName}
                      isSelected={
                        selectedSaleUnit?.productSaleUnitName ===
                        item?.productSaleUnitName
                      }
                      onPress={() => onChipPress(item)}
                    />
                  )}
                  keyExtractor={(item) => item.productSaleUnitName.toString()}
                  numColumns={3}
                  ListFooterComponent={renderFooter}
                />
              </View>
            )}
          </View>

          {selectedSaleUnit && (
            <View>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 13,
                  marginTop: 10,
                  marginLeft: 4,
                }}
              >
                Quantity
              </Text>
              <TextInput
                onFocus={() => setErrors(null)}
                onBlur={() => setErrors(null)}
                textAlign="right"
                inputMode="numeric"
                value={quantity}
                onChangeText={(text) => setQuantity(text)}
                maxLength={3}
                cursorColor={Colors.dark}
                autoFocus
                style={{
                  marginTop: 5,
                  backgroundColor: Colors.light_3,
                  borderRadius: 5,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: errors?.qtyZeroError
                    ? Colors.error
                    : "transparent",
                  fontSize: 18,
                  paddingEnd: 10,
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
                  marginLeft: 4,
                }}
              >
                Unit cost
              </Text>
              <TextInput
                textAlign="right"
                value={unitCost}
                inputMode="numeric"
                cursorColor={Colors.dark}
                onChangeText={(e) => setUnitCost(e)}
                style={{
                  backgroundColor: Colors.light_3,
                  borderRadius: 5,
                  padding: 6,
                  borderColor: errors?.lessPriceError
                    ? Colors.error
                    : "transparent",
                  fontSize: 18,
                  paddingEnd: 10,
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
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 20,
              gap: 5,
            }}
          >
            <PrimaryButton
              darkMode={false}
              title={"Cancel"}
              onPress={() => {
                setShowModal(false);
                setErrors({});
                setSelection(null);
                setScanned(false);
                setSelectedSaleUnit(null);
                setSubmitted(false);
                setUnitCost("");
                setInitialUnitCost(null);
              }}
            />
            {selectedSaleUnit && (
              <PrimaryButton title={"Confirm"} onPress={handlePress} />
            )}
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

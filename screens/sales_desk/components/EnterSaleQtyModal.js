import { Text, View, FlatList, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import ModalContent from "@components/ModalContent";
import ChipButton from "@components/buttons/ChipButton";
import Colors from "@constants/Colors";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { getCartSelection } from "reducers/selectors";
import { isValidNumber } from "@utils/Utils";
import { addItemToCart, makeProductSelection } from "actions/shopActions";

export default function EnterSaleQtyModal({ showMoodal, setShowModal }) {
  const selection = useSelector(getCartSelection);

  const dispatch = useDispatch();

  const { selectedSaleUnit, saleUnits, salesPrice } = selection ?? {};

  const [submitted, setSubmitted] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState(0);
  const [unitCost, setUnitCost] = useState("");
  const [unitSalesPrice, setUnitSalesPrice] = useState(""); //price for a sale unit
  const [saleUnit, setSaleUnit] = useState(null); //selected if multiple

  const hide = () => {
    dispatch(makeProductSelection(null));
    setUnitCost("");
    setQuantity("");
    setShowModal(false);
  };

  const onChipPress = (item) => {
    setSaleUnit(item);
    setUnitCost(String(item?.unitPrice));
    setUnitSalesPrice(item?.unitPrice);
  };

  const handlePress = () => {
    if (saleUnit) {
      const parsedQuantity = Number(quantity);
      const itemUnitCost = Number(unitCost);

      const cost = Math.round(itemUnitCost * parsedQuantity);

      const isValidQuantity = isValidNumber(parsedQuantity) && parsedQuantity > 0;

      const isValidCost = isValidNumber(itemUnitCost) && itemUnitCost >= unitSalesPrice;

      if (itemUnitCost < unitSalesPrice) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            lessPriceError: `Unit cost for ${selection.productName} should be greater than ${unitSalesPrice}`,
          };
        });
      }

      if (!isValidNumber(itemUnitCost)) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            lessPriceError: "Invalid input for unit cost",
          };
        });
      }

      if (parsedQuantity === 0) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            qtyZeroError: "Quantity should be greater than 0",
          };
        });
      }

      if (!isValidNumber(parsedQuantity)) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            qtyZeroError: "Invalid quantity input",
          };
        });
      }

      if (isValidQuantity && isValidCost) {
        const { productSaleUnitName } = saleUnit;
        const name = productSaleUnitName !== "Whole" ? " - " + productSaleUnitName : "";

        const readyItem = {
          id: selection.id,
          productName: selection?.productName + name,
          shopProductId: selection.id,
          quantity: parsedQuantity, // Use the parsed quantity
          totalCost: cost,
          unitCost: Number(unitCost),
          saleUnitId: saleUnit?.id || null,
        };

        dispatch(addItemToCart(readyItem));
        hide();
      }
    } else {
      setSubmitted(true);
    }
  };

  const renderFooter = () => {
    if (submitted && !saleUnit) {
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

  useEffect(() => {
    setUnitCost(String(salesPrice));
    setSaleUnit(selectedSaleUnit);
    setUnitSalesPrice(salesPrice);
  }, [selection]);

  return (
    <ModalContent visible={showMoodal} style={{ padding: 30 }}>
      <View style={{ paddingHorizontal: 5 }}>
        <View
          style={{
            marginTop: 10,
            marginBottom: 5,
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
          <Text>{selection?.productName} has been selected.</Text>

          {!saleUnit && (
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
                    isSelected={saleUnit?.productSaleUnitName === item?.productSaleUnitName}
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

        {saleUnit && (
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
                borderColor: errors?.qtyZeroError ? Colors.error : "transparent",
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
                borderColor: errors?.lessPriceError ? Colors.error : "transparent",
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
            marginTop: 40,
            marginBottom: 10,
            gap: 5,
          }}
        >
          <PrimaryButton
            darkMode={false}
            title={"Cancel"}
            onPress={() => {
              setShowModal(false);
              dispatch(makeProductSelection(null));
            }}
          />
          {saleUnit && <PrimaryButton title={"Confirm"} onPress={handlePress} />}
        </View>
      </View>
    </ModalContent>
  );
}

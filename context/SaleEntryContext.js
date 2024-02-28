import { createContext, useState } from "react";
import { isValidNumber } from "../utils/Utils";

export const SaleEntryContext = createContext();

export const SaleEntryProvider = ({ children }) => {
  //
  //items to do with the sales desk and barcode screen
  const [quantity, setQuantity] = useState("");
  const [selections, setSelections] = useState([]); // products in the table(filtered)
  const [selection, setSelection] = useState(null);
  const [initialUnitCost, setInitialUnitCost] = useState(null);
  const [selectedSaleUnit, setSelectedSaleUnit] = useState(null);
  const [unitCost, setUnitCost] = useState(null);
  const [errors, setErrors] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState("");
  const [totalQty, setTotalQty] = useState(0);
  const [showMoodal, setShowModal] = useState(false);

  const saveSelection = () => {
    // saving the item into the data table

    const parsedQuantity = Number(quantity);
    const itemUnitCost = Number(unitCost); //the entered value in the inputfield

    let cost = Math.round(itemUnitCost * parsedQuantity);

    const isValidQuantity = isValidNumber(parsedQuantity) && parsedQuantity > 0;

    const isValidCost =
      isValidNumber(itemUnitCost) && itemUnitCost >= initialUnitCost;

    if (itemUnitCost < initialUnitCost) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          lessPriceError: `Unit cost for ${selection.productName} should be greater than ${initialUnitCost}`,
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
      setLoading(true);

      setTotalCost(totalCost + cost);

      setTotalQty(totalQty + parsedQuantity); //updating total items purchased

      const productIndex = selections.findIndex(
        //locating the duplicate item in selection array
        (product) => product.productName === selection.productName
      );

      if (productIndex !== -1) {
        //if the already exists, update quantity and total cost
        let prevQty = selections[productIndex].quantity;
        let prevTotalCost = selections[productIndex].totalCost;

        selections[productIndex].quantity = Number(quantity) + prevQty;
        selections[productIndex].totalCost = prevTotalCost + cost;
        setLoading(false);
        setScanned(false);
      } else {
        setSelections((prev) => [
          ...prev,
          {
            id: selection.id,
            productName: selection.productName,
            shopProductId: selection.id,
            quantity: parsedQuantity, // Use the parsed quantity
            totalCost: cost,
            unitCost: Number(unitCost),
          },
        ]);
      }
      setScanned(false);
      setSelection(null);
      setQuantity(null);
      setShowModal(false);
      setSelectedSaleUnit(null);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    setLoading(false);
  };

  const onChipPress = (item) => {
    setSelectedSaleUnit(item);
    setInitialUnitCost(item?.unitPrice);
    setUnitCost(String(item?.unitPrice));
  };

  const clearEverything = () => {
    setQuantity("");
    setSelection(null);
    setTotalCost(0);
    setRecievedAmount("");
    setSelections([]);
    setTotalQty(0);
    setErrors({});
    setSelectedSaleUnit(null);
  };

  const data = {
    onChipPress,
    clearEverything,
    totalQty,
    setTotalQty,
    recievedAmount,
    setRecievedAmount,
    totalCost,
    setTotalCost,
    saveSelection,
    errors,
    setErrors,
    quantity,
    setQuantity,
    selections,
    setSelections,
    selection,
    setSelection,
    initialUnitCost,
    setInitialUnitCost,
    selectedSaleUnit,
    setSelectedSaleUnit,
    unitCost,
    setUnitCost,
    scanned,
    setScanned,
    loading,
    setLoading,
    showMoodal,
    setShowModal,
  };

  return (
    <SaleEntryContext.Provider value={data}>
      {children}
    </SaleEntryContext.Provider>
  );
};

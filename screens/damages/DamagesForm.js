import { View, Text } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { BaseApiService } from "@utils/BaseApiService";
import { damageTypes } from "@constants/Constants";
import { DAMAGES_ENDPOINT } from "@utils/EndPointUtils";
import Modal from "react-native-modal";
import { MyDropDown } from "@components/DropdownComponents";
import MyInput from "@components/MyInput";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { useSelector } from "react-redux";
import { getLookUps } from "reducers/selectors";

const DamagesForm = ({ visible, setVisible, stockEntry, saleRecord, onSave }) => {
  const [selectedDamageType, setSelectedDamageType] = useState(damageTypes[0]);
  const [unitOfQty, setUnitOfQty] = useState(null);
  const [units, setUnits] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [qtyLost, setQtyLost] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);

  const lookUps = useSelector(getLookUps);

  const fetchContainerUnits = async () => {
    setUnits(lookUps?.filter((item) => item.typeId === 2));
  };

  const hideDialog = () => {
    if (!isLoading) {
      setVisible(false);
      setSubmitted(false);
      setUnitOfQty(null);
      setQtyLost(0);
      setIsLoading(false);
      setRemarks("");
    }
  };

  const saveDamage = async () => {
    setSubmitted(true);

    const payload = {
      id: 0,
      quantityLost: Number(qtyLost),
      unitOfQuantityId: unitOfQty?.id,
      type: selectedDamageType?.type,
      ...(saleRecord && { saleLineItemId: saleRecord?.id }),
      ...(stockEntry && {
        stockEntryId: stockEntry?.id,
        shopId: stockEntry?.shopId,
      }),
      notes: remarks,
    };

    if (!isLoading) {
      setIsLoading(true);

      await new BaseApiService(DAMAGES_ENDPOINT)
        .postRequestWithJsonResponse(payload)
        .then((response) => {
          onSave();
          hideDialog();
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          setError(error?.message);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchContainerUnits();
  }, []);

  return (
    <Modal isVisible={visible} onBackButtonPress={hideDialog} animationIn={"fadeIn"} animationOut={"fadeOut"}>
      <View style={{ backgroundColor: "#fff", borderRadius: 5, padding: 10, gap: 10, paddingHorizontal: 15 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 17, fontWeight: "600" }} numberOfLines={2}>
            Damage Information
          </Text>
          <Text numberOfLines={2}>Product: {stockEntry?.productName}</Text>

          {error && (
            <Text style={{ color: "red", fontSize: 14 }} numberOfLines={2}>
              {error}
            </Text>
          )}
        </View>

        <MyDropDown
          label={"Damage type"}
          data={damageTypes}
          value={selectedDamageType}
          labelField={"name"}
          onChange={(e) => setSelectedDamageType(e)}
          valueField={"name"}
        />

        <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
          <MyInput
            style={{ flex: 0.5 }}
            isSubmitted={submitted}
            value={qtyLost}
            onValueChange={(e) => setQtyLost(e)}
            label="Qty lost"
            inputMode="numeric"
            showError
          />
          <MyDropDown
            label={"Unit"}
            data={units}
            value={unitOfQty}
            labelField={"value"}
            onChange={(e) => setUnitOfQty(e)}
            valueField={"value"}
            isSubmitted={submitted}
            showError
            divStyle={{ flex: 0.5 }}
          />
        </View>

        <MyInput value={remarks} onValueChange={(e) => setRemarks(e)} label="Remark" multiline />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 5, paddingBottom: 10 }}>
          <PrimaryButton title={"Cancel"} style={{ flex: 0.5 }} onPress={hideDialog} />
          <PrimaryButton darkMode title={"Save"} style={{ flex: 0.5 }} loading={isLoading} onPress={saveDamage} />
        </View>
      </View>
    </Modal>
  );
};

export default DamagesForm;

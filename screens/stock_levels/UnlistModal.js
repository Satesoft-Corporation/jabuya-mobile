import { Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import ModalContent from "@components/ModalContent";
import Colors from "@constants/Colors";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { BaseApiService } from "@utils/BaseApiService";
import { SHOP_PRODUCTS_ENDPOINT } from "@utils/EndPointUtils";

export default function UnlistModal({ showMoodal, setShowModal, selectedItem, onComplete }) {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const hide = () => {
    setPassword("");
    setReason("");
    setShowModal(false);
    setError(null);
    setLoading(false);
  };

  const handlePress = async () => {
    setSubmitted(true);
    setError(null);
    if (selectedItem) {
      setLoading(true);
      await new BaseApiService(`${SHOP_PRODUCTS_ENDPOINT}/${selectedItem?.id}/unlist`)
        .postRequestWithJsonResponse()
        .then((response) => {
          hide();
          onComplete();
          setLoading(false);
          setSubmitted(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(error?.message);
          setSubmitted(false);
        });

      return;
    }
  };
  return (
    <ModalContent visible={showMoodal} style={{ padding: 30 }}>
      <View style={{ paddingHorizontal: 5 }}>
        <View style={{ marginTop: 10, marginBottom: 5 }}>
          <Text style={{ fontWeight: "600", fontSize: 20, marginBottom: 5 }}>Confirm</Text>
          <Text style={{ textAlign: "center" }}>
            Do you want to remove this product <Text style={{ fontWeight: "600" }}>{selectedItem?.productName}</Text>
          </Text>
        </View>

        {error && (
          <View style={{ marginVertical: 3 }}>
            <Text numberOfLines={4} style={{ color: Colors.error, fontWeight: 500 }}>
              {error}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 10, gap: 5 }}>
          <PrimaryButton
            title={"Cancel"}
            onPress={() => {
              if (!loading) {
                setShowModal(false);
              }
            }}
            style={{ flex: 0.5 }}
          />
          <PrimaryButton darkMode title={"Remove"} onPress={handlePress} style={{ flex: 0.5 }} loading={loading} />
        </View>
      </View>
    </ModalContent>
  );
}

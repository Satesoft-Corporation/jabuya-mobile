import { Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import ModalContent from "@components/ModalContent";
import Colors from "@constants/Colors";
import PrimaryButton from "@components/buttons/PrimaryButton";
import { BaseApiService } from "@utils/BaseApiService";

export default function DeleteSaleModal({ showMoodal, setShowModal, selectedSale, onComplete }) {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const hide = () => {
    setPassword("");
    setReason("");
    setShowModal(false);
  };

  const handlePress = async () => {
    setSubmitted(true);

    if (reason && password && !loading) {
      await new BaseApiService("/shop-sales/" + selectedSale?.id)
        .deleteRequestWithJsonResponse({ reason, password })
        .then((response) => {
          hide();
          onComplete();
          setLoading(false);
          setSubmitted(false);
        })
        .catch((error) => {
          setError(error?.message);
          setSubmitted(false);
        });
    }
  };
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
            Confirm
          </Text>
          <Text>Do you want to delete this sale</Text>
        </View>

        {error && (
          <View style={{ marginVertical: 3 }}>
            <Text
              numberOfLines={4}
              style={{
                color: Colors.error,
                fontWeight: 500,
              }}
            >
              {error}
            </Text>
          </View>
        )}

        <View>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 13,
              marginTop: 10,
              marginLeft: 4,
            }}
          >
            Reason
          </Text>
          <TextInput
            value={reason}
            onChangeText={(text) => setReason(text)}
            cursorColor={Colors.dark}
            autoFocus
            style={{
              marginTop: 5,
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderWidth: 1,
              borderColor: "transparent",
              fontSize: 18,
              paddingEnd: 10,
            }}
          />
          {submitted && !reason && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              Reason is required
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
            Password
          </Text>
          <TextInput
            value={password}
            cursorColor={Colors.dark}
            onChangeText={(e) => setPassword(e)}
            secureTextEntry
            style={{
              backgroundColor: Colors.light_3,
              borderRadius: 5,
              padding: 6,
              borderColor: "transparent",
              fontSize: 18,
              paddingEnd: 10,
            }}
          />
          {submitted && !password && (
            <Text
              style={{
                fontSize: 12,
                color: Colors.error,
              }}
            >
              Password is required
            </Text>
          )}
        </View>

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
            }}
          />
          <PrimaryButton title={"Delete"} onPress={handlePress} />
        </View>
      </View>
    </ModalContent>
  );
}

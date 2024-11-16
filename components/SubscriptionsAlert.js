import { View, Text, Clipboard } from "react-native";
import React, { useState } from "react";
import ModalContent from "./ModalContent";
import ChipButton from "./buttons/ChipButton";
import Colors from "@constants/Colors";

const SubscriptionsAlert = ({ showModal, setShowModal }) => {
  const accNo = "1001202222937";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <ModalContent
      visible={showModal}
      style={{ padding: 30 }}
      onBackDropPress={() => {
        setShowModal(false);
      }}
    >
      <View style={{ paddingHorizontal: 5, gap: 2, paddingVertical: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          Make your payment to
        </Text>

        <View
          style={{ justifyContent: "center", flexDirection: "row", gap: 5 }}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>Bank name:</Text>
          <Text
            style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
          >
            Equity Bank
          </Text>
        </View>

        <View
          style={{ justifyContent: "center", flexDirection: "row", gap: 5 }}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>A/C no:</Text>
          <Text
            style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}
          >
            {accNo}
          </Text>
        </View>

        {copied && (
          <Text style={{ color: Colors.green, textAlign: "center" }}>
            copied!
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <ChipButton
            title={"Copy"}
            onPress={() => {
              try {
                Clipboard.setString(String(accNo));
                handleCopy();
              } catch (e) {
                console.log(e);
              }
            }}
          />
        </View>
      </View>
    </ModalContent>
  );
};

export default SubscriptionsAlert;

import { Text } from "react-native";
import ModalContent from "../ModalContent";
import { View } from "react-native";
import PrimaryButton from "../buttons/PrimaryButton";

export default function DisplayMessage({
  message,
  onAgree,
  showModal,
  agreeText = "OK",
  canCancel = false,
  setShowModal,
}) {
  return (
    <ModalContent visible={showModal} style={{ padding: 20 }}>
      <Text style={{ textAlign: "center", paddingVertical: 10 }}>
        {message}
      </Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {canCancel && (
          <PrimaryButton
            title={"Cancel"}
            onPress={() => setShowModal(false)}
            darkMode={false}
            style={{ margin: 10, height: 35 }}
          />
        )}

        <PrimaryButton
          title={agreeText}
          onPress={() => onAgree()}
          style={{ margin: 10, height: 35 }}
        />
      </View>
    </ModalContent>
  );
}

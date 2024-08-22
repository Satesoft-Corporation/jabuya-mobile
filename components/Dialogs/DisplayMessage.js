import { Text } from "react-native";
import { View } from "react-native";
import ChipButton2 from "@components/buttons/ChipButton2";
import Modal from "react-native-modal";
import Colors from "@constants/Colors";
export default function DisplayMessage({
  message,
  onAgree,
  showModal,
  agreeText,
  canCancel = false,
  setShowModal,
}) {
  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <Modal
      isVisible={showModal}
      style={{
        padding: 10,
      }}
      onBackButtonPress={hideModal}
    >
      <View
        style={{
          borderRadius: 5,
          padding: 15,
          backgroundColor: Colors.light,
          gap: 10,
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 16 }}>{message}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignSelf: "flex-end",
            marginTop: 10,
          }}
        >
          {canCancel && (
            <ChipButton2
              title={"Cancel"}
              onPress={hideModal}
              darkMode={false}
            />
          )}

          {agreeText && (
            <ChipButton2 title={agreeText} onPress={() => onAgree()} />
          )}
        </View>
      </View>
    </Modal>
  );
}

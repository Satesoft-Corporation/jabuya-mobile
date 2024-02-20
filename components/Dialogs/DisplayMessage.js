import { Text } from "react-native";
import Card from "../Card";
import ModalContent from "../ModalContent";
import { View } from "react-native";
import MaterialButton from "../MaterialButton";
import Colors from "../../constants/Colors";

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
      <Card
        style={{
          paddingHorizontal: 8,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", marginTop: 10 }}>
          <Text style={{ textAlign: "center", paddingVertical: 10 }}>
            {message}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {canCancel && (
            <MaterialButton
              title={"Cancel"}
              style={{
                backgroundColor: Colors.light,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                margin: 10,
                height: 35,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.dark,
              }}
              buttonPress={() => setShowModal(false)}
            />
          )}
          <MaterialButton
            title={agreeText}
            style={{
              backgroundColor: Colors.dark,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.dark,

              margin: 10,
              height: 35,
            }}
            titleStyle={{
              fontWeight: "bold",
              color: Colors.primary,
            }}
            buttonPress={() => onAgree()}
          />
        </View>
      </Card>
    </ModalContent>
  );
}

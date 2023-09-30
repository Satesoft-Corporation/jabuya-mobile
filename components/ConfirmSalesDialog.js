import { Text, View, FlatList, Image } from "react-native";
import React from "react";
import ModalContent from "./ModalContent";
import Card from "./Card";
import Colors from "../constants/Colors";
import MaterialButton from "./MaterialButton";

function ConfirmSalesDialog({ visible, navigation, addSale }) {
  return (
    <ModalContent visible={visible} style={{ padding: 35 }}>
      <Card style={{ alignSelf: "center", minHeight: 120 }}>
        <View
          style={{
            backgroundColor: Colors.light,
            padding: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 5,
                marginStart: 10,
              }}
            >
              Sale Confirmed
            </Text>
            <Image
              source={require("../assets/icons/green_tick.png")}
              style={{
                height: 30,
                width: 30,
                resizeMode: "contain",
                marginStart: 15,
                alignSelf: "center",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // alignItems:'center',
              alignSelf: "center",
              margin: 10,
            }}
          >
            <MaterialButton
              title="Add Sale"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.primary,
                width: 100,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={() => addSale()}
            />
            <MaterialButton
              title="View Sales"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.primary,
                width: 100,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={() => {
                navigation.navigate("viewSales");
                addSale();
              }}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export default ConfirmSalesDialog;

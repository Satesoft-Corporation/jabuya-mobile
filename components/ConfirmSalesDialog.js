import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import ModalContent from "./ModalContent";
import Card from "./Card";
import Colors from "../constants/Colors";
import MaterialButton from "./MaterialButton";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";

function ConfirmSalesDialog({
  visible,
  addSale,
  sales,
  total,
  setVisible,
  transID,
  length,
  balanceGivenOut,
  amountPaid,
  resetList,
}) {
  const tableHead = ["Item", "Qty", "Price", "Amount"];

  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Card
        style={{
          alignSelf: "center",
          minHeight: 120,
          maxHeight: 490,
          width: 315,
          paddingBottom:7
        }}
      >
        <View
          style={{
            backgroundColor: Colors.light,
            padding: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
                marginStart: 1,
              }}
            >
              Confirm sale
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible();
                resetList();
              }}
            >
              <Image
                source={require("../assets/icons/ic_close.png")}
                style={{
                  height: 12,
                  width: 12,
                  resizeMode: "contain",
                  marginStart: 15,
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>
              Txn ID : <Text> {transID}</Text>
            </Text>

            <Text>Currency : UGX</Text>
          </View>

          <Table>
            <Row
              data={tableHead}
              style={{ height: 40 }}
              textStyle={{
                fontWeight: "bold",
              }}
              flexArr={[2, 1, 1, 1]}
            />
            <ScrollView style={{ height: 200 }}>
              <Rows
                data={sales}
                textStyle={{
                  margin: 5,
                  textAlign: "left",
                }}
                flexArr={[2, 1, 1, 1]}
              />
            </ScrollView>

            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: 15,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Total </Text>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  marginEnd: 4,
                }}
              >
                {length}
              </Text>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  marginEnd: 4,
                }}
              >
                {total}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Recieved </Text>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  marginEnd: 4,
                }}
              >
                {amountPaid}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Purchased </Text>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  marginEnd: 4,
                }}
              >
                {total}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Balance</Text>
              <Text
                style={{
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  marginEnd: 4,
                  fontSize: 15,
                }}
              >
                {balanceGivenOut}
              </Text>
            </View>
          </Table>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <MaterialButton
              title="Cancel"
              style={{
                backgroundColor: "transparent",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.dark,
              }}
              buttonPress={() => {
                setVisible();
                resetList();
              }}
            />
            <MaterialButton
              title="OK"
              style={{
                backgroundColor: Colors.dark,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.dark,
                marginStart: 2,
                marginEnd: -2,
                margin: 10,
                height: 40,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: Colors.primary,
              }}
              buttonPress={() => addSale()}
            />
          </View>
        </View>
      </Card>
    </ModalContent>
  );
}

export default ConfirmSalesDialog;

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
}) {
  const tableHead = ["Item", "Qty", "Price", "Amount"];

  return (
    <ModalContent visible={visible} style={{ padding: 10 }}>
      <Card
        style={{
          alignSelf: "center",
          minHeight: 120,
          maxHeight: 400,
          width: 315,
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false}>
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
                  marginBottom: 5,
                  marginStart: 1,
                }}
              >
                Confirm Sale
              </Text>
              <TouchableOpacity>
                <Image
                  source={require("../assets/icons/ic_close.png")}
                  style={{
                    height: 12,
                    width: 12,
                    resizeMode: "contain",
                    marginStart: 15,
                    alignSelf: "center",
                    marginBottom: 4,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>Txn ID :</Text>
              <Text> {transID}</Text>
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

              <TableWrapper style={{ flexDirection: "row" }}>
                <Rows
                  data={sales}
                  textStyle={{
                    margin: 5,
                    textAlign: "left",
                  }}
                  flexArr={[2, 1, 1, 1]}
                />
              </TableWrapper>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 5,
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
                  <Text style={{ fontSize: 11, color: Colors.gray }}>UGX</Text>{" "}
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
                  <Text style={{ fontSize: 11, color: Colors.gray }}>UGX</Text>{" "}
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
                  <Text style={{ fontSize: 11, color: Colors.gray }}>UGX</Text>{" "}
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
                  }}
                >
                  <Text style={{ fontSize: 11, color: Colors.gray }}>UGX</Text>{" "}
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
        </ScrollView>
      </Card>
    </ModalContent>
  );
}

export default ConfirmSalesDialog;

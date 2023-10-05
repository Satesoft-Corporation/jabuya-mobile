import { Text, View, FlatList, Image, ScrollView } from "react-native";
import React from "react";
import ModalContent from "./ModalContent";
import Card from "./Card";
import Colors from "../constants/Colors";
import MaterialButton from "./MaterialButton";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";

function ConfirmSalesDialog({ visible, navigation, addSale, sales, total,setVisible,clear }) {
  const tableHead = ["Product", "Qnty", "Amount"];

  return (
    <ModalContent visible={visible} style={{ padding: 30 }}>
      <Card style={{ alignSelf: "center", minHeight: 120, maxHeight: 400 }}>
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

            <Table>
              <Row
                data={tableHead}
                style={{ height: 40 }}
                textStyle={{
                  fontWeight: "bold",
                }}
                flexArr={[2, 1, 1]}
              />

              <TableWrapper style={{ flexDirection: "row" }}>
                <Rows
                  data={sales}
                  textStyle={{
                    margin: 5,
                    textAlign: "left",
                  }}
                  flexArr={[2, 1, 1]}
                />
              </TableWrapper>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Total Cost</Text>
                <Text
                  style={{
                    alignSelf: "flex-end",
                    fontWeight: "bold",
                    marginEnd: 4,
                  }}
                >
                  UGX {total}
                </Text>
              </View>
            </Table>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignSelf: "center",
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
                buttonPress={() =>{
                  setVisible()
                  clear()
                  navigation.navigate('viewSales')
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </ModalContent>
  );
}

export default ConfirmSalesDialog;

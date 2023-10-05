import { View, Text, ScrollView } from "react-native";
import React from "react";
import ModalContent from "./ModalContent";
import Card from "./Card";
import ButtonClose from "./ButtonClose";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import Colors from "../constants/Colors";

const tableHead = ["Product", "Unit Price", "Qnty", "Amount"];

export default function SaleSummaryDialog({ closeSummary, sale, lineItems,visible }) {
  return (
    <ModalContent
      visible={visible}
      onBackDropPress={() => closeSummary()}
      style={{ padding: 15 }}
    >
      <Card style={{ maxHeight: 400, paddingBottom: 20, minHeight: 120 }}>
        <View style={{ height: 40 }}>
          <ButtonClose onClose={() => closeSummary()} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 5,
            marginStart: 10,
          }}
        >
          Sale Summary
        </Text>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Table style={{ paddingBottom: 10 }}>
              <Row
                data={tableHead}
                style={{ height: 40 }}
                textStyle={{
                  fontWeight: 600,
                }}
                flexArr={[2.5, 1, 0.8, 0.8]}
              />

              <TableWrapper style={{ flexDirection: "row" }}>
                <Rows
                  style={{
                    borderTopColor: Colors.dark,
                    borderTopWidth: 0.5,
                  }}
                  data={lineItems}
                  textStyle={{
                    margin: 5,
                    textAlign: "left",
                  }}
                  flexArr={[2.5, 1, 0.8, 0.8]}
                />
              </TableWrapper>
            </Table>
            <View
              style={{
                backgroundColor: Colors.light,
                borderRadius: 5,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold" }}>Recieved Amount</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontWeight: 500,
                  }}
                >
                  UGX {sale && sale.totalCost}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Card>
    </ModalContent>
  );
}

import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import TopHeader from "@components/TopHeader";
import EntryBar from "@components/EntryBar";
import {
  CLIENT_FORM,
  EXPENSE_FORM,
  PDT_ENTRY,
  STOCK_ENTRY_FORM,
} from "@navigation/ScreenNames";
import Colors from "@constants/Colors";

const Entries = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Entries" />

      <View
        style={{
          paddingHorizontal: 10,
          flex: 1,
          marginTop: 10,
          backgroundColor: Colors.light, //121111
        }}
      >
        <View
          style={{
            borderRadius: 5,
            borderWidth: 0.5,
          }}
        >
          <EntryBar
            title={"Add Stock"}
            target={STOCK_ENTRY_FORM}
            icon="store"
          />
          <EntryBar
            title={"List new product"}
            target={PDT_ENTRY}
            icon="cart-plus"
          />
          <EntryBar title={"Add Expense"} target={EXPENSE_FORM} icon="wallet" />
          <EntryBar
            title={"Add Debtor"}
            target={CLIENT_FORM}
            isLast
            icon="hand-holding"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Entries;

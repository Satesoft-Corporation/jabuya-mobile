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

const Entries = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Entries" />

      <View style={{ paddingHorizontal: 10, flex: 1, marginTop: 10 }}>
        <EntryBar title={"Add Stock"} target={STOCK_ENTRY_FORM} />
        <EntryBar title={"List new product"} target={PDT_ENTRY} />
        <EntryBar title={"Add Expense"} target={EXPENSE_FORM} />
        <EntryBar title={"Add Debtor"} target={CLIENT_FORM} />
      </View>
    </SafeAreaView>
  );
};

export default Entries;

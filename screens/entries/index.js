import { View, SafeAreaView, FlatList, Pressable, Text } from "react-native";
import React from "react";
import TopHeader from "@components/TopHeader";
import { CLIENT_FORM, EXPENSE_FORM, LEADS_FORM, PDT_ENTRY, STOCK_ENTRY_FORM } from "@navigation/ScreenNames";
import { useSelector } from "react-redux";
import { getIsAdmin, getOffersDebt } from "reducers/selectors";
import { screenWidth } from "@constants/Constants";
import Colors from "@constants/Colors";
import Icon from "@components/Icon";
import { useNavigation } from "@react-navigation/native";

const Entries = () => {
  const offersDebt = useSelector(getOffersDebt);

  const isAdmin = useSelector(getIsAdmin);

  const navigation = useNavigation();

  const list = [
    { title: "Add Purchase", target: STOCK_ENTRY_FORM, icon: "store" },
    { title: "Add Expense", target: EXPENSE_FORM, icon: "wallet" },
    { title: "Add Product", target: PDT_ENTRY, icon: "cart-plus" },
    ...(offersDebt ? [{ title: "Add Client", target: CLIENT_FORM, icon: "hand-holding" }] : []),
    ...(isAdmin ? [{ title: "Add Lead", target: LEADS_FORM, icon: "user-plus" }] : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopHeader title="Entries" />

      <View style={{ paddingHorizontal: 10, flex: 1, marginTop: 10 }}>
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={list}
          renderItem={({ item }) => (
            <Pressable
              style={{
                backgroundColor: Colors.light,
                borderRadius: 6,
                maxWidth: screenWidth / 2 - 30,
                margin: 10,
                elevation: 2,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                flex: 1,
              }}
              onPress={() => navigation.navigate(item.target)}
            >
              <View style={{ paddingVertical: 10, paddingHorizontal: 10, alignItems: "center", gap: 10 }}>
                <Icon name={item?.icon} size={20} />

                <Text style={{ fontWeight: 600 }}>{item?.title}</Text>
              </View>
            </Pressable>
          )}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

export default Entries;

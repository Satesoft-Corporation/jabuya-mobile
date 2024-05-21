import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import { useNavigation } from "@react-navigation/native";
import { EXPENSE_FORM } from "../../navigation/ScreenNames";
import ExpenseCard from "./ExpenseCard";
import { BaseApiService } from "../../utils/BaseApiService";
import { userData } from "../../context/UserContext";
import { EXPENSES_ENDPOINT } from "../../utils/EndPointUtils";
import ItemHeader from "../sales/components/ItemHeader";
import VerticalSeparator from "../../components/VerticalSeparator";

const Expenses = ({}) => {
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const [expenseValue, setExpenseValue] = useState(0);
  const [categories, setCategories] = useState(0);

  const [loading, setLoading] = useState(true);

  const { getRequestParams, selectedShop } = userData();

  const fetchExpenses = async () => {
    try {
      setMessage(null);
      setLoading(true);

      const searchParameters = {
        limit: 0,
        offset: 0,
        ...getRequestParams(),
      };

      const response = await new BaseApiService(
        EXPENSES_ENDPOINT
      ).getRequestWithJsonResponse(searchParameters);

      setExpenses(response?.records);
      setTotalItems(response?.totalItems);

      setExpenseValue(response?.records?.reduce((a, b) => a + b?.amount, 0));

      let cats = [
        ...new Set(response?.records?.map((exp) => exp?.categoryName)),
      ]?.length;

      setCategories(cats);

      setLoading(false);
      if (response?.totalItems === 0) {
        setMessage("No expenses found");
      }
    } catch (error) {
      setMessage("Error fetching expense records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedShop]);
  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader
        title="Expenses"
        showMenuDots
        showShops
        menuItems={[
          {
            name: "Add expense",
            onClick: () => navigation.navigate(EXPENSE_FORM),
          },
        ]}
      />

      <View
        style={{
          flexDirection: "row",
          paddingTop: 15,
          justifyContent: "space-between",
          paddingHorizontal: 12,
          backgroundColor: "#000",
          paddingBottom: 10,
        }}
      >
        <ItemHeader value={categories} title="Categories" />

        <VerticalSeparator />
        <ItemHeader title="Qty" value={totalItems} />

        <VerticalSeparator />
        <ItemHeader title="Value " value={expenseValue} isCurrency />
      </View>

      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard exp={item} />}
        refreshing={loading}
        onRefresh={() => fetchExpenses()}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {totalItems === 0 && <Text>{message}</Text>}
          </View>
        )}
      />
    </View>
  );
};

export default Expenses;

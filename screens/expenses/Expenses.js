import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import AppStatusBar from "../../components/AppStatusBar";
import TopHeader from "../../components/TopHeader";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { EXPENSE_FORM } from "../../navigation/ScreenNames";
import ExpenseCard from "./ExpenseCard";
import { BaseApiService } from "../../utils/BaseApiService";
import { MAXIMUM_RECORDS_PER_FETCH } from "../../constants/Constants";
import { ActivityIndicator } from "react-native";
import { UserContext } from "../../context/UserContext";

const Expenses = ({}) => {
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([]);
  const [showFooter, setShowFooter] = useState(true);
  const [message, setMessage] = useState(null);
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const snackbarRef = useRef(null);
  const { userParams, reload, setReload, selectedShop } =
    useContext(UserContext);

  const fetchExpenses = async () => {
    try {
      setMessage(null);
      setLoading(true);
      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        shopId: selectedShop?.id,
        offset: offset,
      };

      const response = await new BaseApiService(
        "/shop/expenses"
      ).getRequestWithJsonResponse(searchParameters);
      setExpenses((prevEntries) => [...prevEntries, ...response?.records]);

      setTotalItems(response?.totalItems);
      setLoading(false);
      if (response?.totalItems === 0) {
        setMessage("No expenses found in this shop");
        setShowFooter(false);
      }
    } catch (error) {
      setMessage("Error fetching stock records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader
        title="Expenses"
        showMenuDots
        menuItems={[
          {
            name: "Add expense",
            onClick: () => navigation.navigate(EXPENSE_FORM),
          },
        ]}
      />

      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard />}
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

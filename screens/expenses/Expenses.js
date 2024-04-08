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
  const snackbarRef = useRef(null);
  const { userParams, reload, setReload, selectedShop } =
    useContext(UserContext);

  const { isShopOwner, isShopAttendant, attendantShopId, shopOwnerId } =
    userParams;

  const fetchExpenses = async () => {
    try {
      setShowFooter(true);
      setMessage(null);

      const searchParameters = {
        limit: MAXIMUM_RECORDS_PER_FETCH,
        shopId: selectedShop?.id,
        offset: offset,
      };

      const response = await new BaseApiService(
        "/shop/expenses"
      ).getRequestWithJsonResponse(searchParameters);
      console.log(response.records);
      setExpenses((prevEntries) => [...prevEntries, ...response?.records]);

      setTotalItems(response?.totalItems);

      if (response?.totalItems === 0) {
        setMessage("No expenses found in this shop");
        setShowFooter(false);
      }
    } catch (error) {
      setShowFooter(false);
      setMessage("Error fetching stock records");
    }
  };

  const addBtn = () => (
    <TouchableOpacity onPress={() => navigation.navigate(EXPENSE_FORM)}>
      <Image
        source={require("../../assets/icons/ic_plus.png")}
        style={{ height: 40, width: 30, tintColor: Colors.primary }}
      />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (showFooter === true) {
      if (expenses.length === totalItems && expenses.length > 0) {
        return null;
      }

      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator animating size="large" color={Colors.dark} />
        </View>
      );
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <AppStatusBar />
      <TopHeader title="Expenses" renderExtraIcon={addBtn} />

      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard />}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {totalItems === 0 && <Text>{message}</Text>}
          </View>
        )}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default Expenses;

import { View, FlatList } from "react-native";
import React from "react";
import { CREDIT_SALES, EXPENSES, SALES_REPORTS, STOCK_ENTRY, STOCK_LEVELS } from "@navigation/ScreenNames";
import Colors from "@constants/Colors";
import AppStatusBar from "@components/AppStatusBar";
import TopHeader from "@components/TopHeader";
import StockingIcon from "@components/StockingIcon";
import { useSelector } from "react-redux";
import { getOffersDebt } from "reducers/selectors";
import { useNavigation } from "@react-navigation/native";

const ReportsMenu = () => {
  const offersDebt = useSelector(getOffersDebt);
  const navigation = useNavigation();

  let list = [
    {
      title: "Daily sales",
      target: SALES_REPORTS,
    },
    // {
    //   title: "Sales by product",
    //   target: SALES_BY_PDT,
    // },
    {
      title: "Debts",
      target: CREDIT_SALES,
    },
    {
      title: "Stock purchases",
      target: STOCK_ENTRY,
    },

    {
      title: "Stock levels",
      target: STOCK_LEVELS,
    },
    {
      title: "Expenses",
      target: EXPENSES,
    },
  ].filter((i) => (!offersDebt ? i.target !== CREDIT_SALES : i));

  const onPress = (item) => {
    if (item.target) {
      navigation.navigate(item?.target);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.light_2,
      }}
    >
      <AppStatusBar content="light-content" bgColor="black" />

      <TopHeader title="Reports" />
      <FlatList
        style={{ flex: 1, marginTop: 10, paddingHorizontal: 10 }}
        data={list}
        renderItem={({ item }) => <StockingIcon disabled={!item.target} title={item.title} onPress={() => onPress(item)} />}
        numColumns={2}
      />
    </View>
  );
};

export default ReportsMenu;

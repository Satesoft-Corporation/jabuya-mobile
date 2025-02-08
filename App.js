import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import LandingScreen from "@screens/landing_screen";
import ViewSales from "@screens/sales";
import BarCodeScreen from "@screens/sales_desk/BarCodeScreen";
import ShopSummary from "@screens/shop_summary/ShopSummary";
import Settings from "@screens/settings";
import LockSetUp from "@screens/applock/LockSetUp";
import CreditSales from "@screens/credit/CreditSales";
import CreditPayment from "@screens/credit/CreditPayment";
import NewClient from "@screens/credit/NewClient";
import Expenses from "@screens/expenses";
import ExpenseForm from "@screens/expenses/ExpenseForm";
import OfflineSales from "@screens/sales/OfflineSales";
import ClientDebts from "@screens/credit/ClientDebts";
import SalesDesk from "@screens/sales_desk";
import * as s from "@navigation/ScreenNames";
import Login from "@screens/auth";
import ReportsMenu from "@screens/reports";
import ComingSoon from "@screens/coming_soon";
import Entries from "@screens/entries";
import AppStatusBar from "@components/AppStatusBar";
import { Provider } from "react-redux";
import LoadingScreen from "@screens/landing_screen/LoadingScreen";
import { duqactStore } from "duqactStore";
import SalesByProduct from "@screens/sales_by_pdt";
import Leads from "@screens/leads";
import LeadsForm from "@screens/leads/LeadsForm";
import StockLevels from "@screens/stock_levels";
import StockEntries from "@screens/stock_entries";
import StockEntryForm from "@screens/stock_entries/StockEntryForm";
import ProductEntry from "@screens/stock_levels/ProductEntry";
import Damages from "@screens/damages";
import ContactBook from "@screens/contacts";
import ContactDetails from "@screens/contacts/ContactDetails";
import { navigatorRef } from "./navigation";
import CheckOut from "@screens/sales_desk/CheckOut";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={duqactStore}>
      <MenuProvider>
        <NavigationContainer ref={navigatorRef}>
          <AppStatusBar />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"Loading"} component={LoadingScreen} />
            <Stack.Screen name={s.LANDING_SCREEN} component={LandingScreen} />
            <Stack.Screen name={s.LOGIN} component={Login} />
            <Stack.Screen name={s.SALES_DESK} component={SalesDesk} />
            <Stack.Screen name={s.SALES_REPORTS} component={ViewSales} />
            <Stack.Screen name={s.BARCODE_SCREEN} component={BarCodeScreen} />
            <Stack.Screen name={s.SHOP_SUMMARY} component={ShopSummary} />
            <Stack.Screen name={s.STOCK_ENTRY} component={StockEntries} />
            <Stack.Screen name={s.STOCK_LEVELS} component={StockLevels} />
            <Stack.Screen name={s.PDT_ENTRY} component={ProductEntry} />
            <Stack.Screen name={s.STOCK_ENTRY_FORM} component={StockEntryForm} />
            <Stack.Screen name={s.SETTINGS} component={Settings} />
            <Stack.Screen name={s.LOCK_SETuP} component={LockSetUp} />
            <Stack.Screen name={s.CREDIT_SALES} component={CreditSales} />
            <Stack.Screen name={s.CREDIT_PAYMENTS} component={CreditPayment} />
            <Stack.Screen name={s.CLIENT_FORM} component={NewClient} />
            <Stack.Screen name={s.CONTACT_BOOK} component={ContactBook} />
            <Stack.Screen name={s.EXPENSES} component={Expenses} />
            <Stack.Screen name={s.EXPENSE_FORM} component={ExpenseForm} />
            <Stack.Screen name={s.OFFLINE_SALES} component={OfflineSales} />
            <Stack.Screen name={s.CLIENT_DEBTS} component={ClientDebts} />
            <Stack.Screen name={s.REPORTS_MENU} component={ReportsMenu} />
            <Stack.Screen name={s.COMING_SOON} component={ComingSoon} />
            <Stack.Screen name={s.ENTRIES} component={Entries} />
            <Stack.Screen name={s.SALES_BY_PDT} component={SalesByProduct} />
            <Stack.Screen name={s.LEADS} component={Leads} />
            <Stack.Screen name={s.LEADS_FORM} component={LeadsForm} />
            <Stack.Screen name={s.DAMAGES} component={Damages} />
            <Stack.Screen name={s.CONTACT_DETAILS} component={ContactDetails} />
            <Stack.Screen name={s.CHECK_OUT} component={CheckOut} />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </Provider>
  );
}

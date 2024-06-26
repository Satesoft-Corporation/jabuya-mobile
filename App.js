import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import ProductEntry from "@forms/stockingForms/ProductEntry";
import LandingScreen from "@screens/landing_screen";
import ViewSales from "@screens/sales";
import BarCodeScreen from "@screens/sales_desk/BarCodeScreen";
import ShopSummary from "@screens/shop_summary/ShopSummary";
import StockingMenu from "@screens/stocking";
import StockEntries from "@screens/stocking/StockEntries";
import StockLevel from "@screens/stocking/StockLevels";
import StockPurchaseForm from "@forms/stockingForms/StockPurchaseForm";
import Settings from "@screens/settings";
import LockScreen from "@screens/applock/LockScreen";
import LockSetUp from "@screens/applock/LockSetUp";
import CreditSales from "@screens/credit/CreditSales";
import CreditPayment from "@forms/CreditPayment";
import NewClient from "@forms/NewClient";
import ClientRegister from "@screens/credit/ClientRegister";
import ContactBook from "@screens/ContactBook";
import Expenses from "@screens/expenses";
import ExpenseForm from "@forms/ExpenseForm";
import IncomeGraph from "@screens/perfomance_graphs/IncomeGraph";
import OfflineSales from "@screens/sales/OfflineSales";
import ClientDebts from "@screens/credit/ClientDebts";
import { UserProvider } from "context/UserContext";
import { SaleEntryProvider } from "context/SaleEntryContext";
import SalesDesk from "@screens/sales_desk";
import * as s from "@navigation/ScreenNames";
import Login from "@screens/auth";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <MenuProvider>
      <UserProvider>
        <SaleEntryProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name={s.LANDING_SCREEN} component={LandingScreen} />

              <Stack.Screen name={s.LOGIN} component={Login} />

              <Stack.Screen name={s.SALES_DESK} component={SalesDesk} />
              <Stack.Screen name={s.SALES_REPORTS} component={ViewSales} />
              <Stack.Screen name={s.BARCODE_SCREEN} component={BarCodeScreen} />

              <Stack.Screen name={s.SHOP_SUMMARY} component={ShopSummary} />

              <Stack.Screen name={s.STOCKNG} component={StockingMenu} />
              <Stack.Screen name={s.STOCK_ENTRY} component={StockEntries} />
              <Stack.Screen name={s.STOCK_LEVELS} component={StockLevel} />

              <Stack.Screen name={s.PDT_ENTRY} component={ProductEntry} />
              <Stack.Screen
                name={s.STOCK_ENTRY_FORM}
                component={StockPurchaseForm}
              />

              <Stack.Screen name={s.SETTINGS} component={Settings} />
              <Stack.Screen name={s.LOCK_SCREEN} component={LockScreen} />
              <Stack.Screen name={s.LOCK_SETuP} component={LockSetUp} />

              <Stack.Screen name={s.CREDIT_SALES} component={CreditSales} />
              <Stack.Screen
                name={s.CREDIT_PAYMENTS}
                component={CreditPayment}
              />

              <Stack.Screen name={s.CLIENT_FORM} component={NewClient} />
              <Stack.Screen
                name={s.CLIENT_REGISTER}
                component={ClientRegister}
              />
              <Stack.Screen name={s.CONTACT_BOOK} component={ContactBook} />

              <Stack.Screen name={s.EXPENSES} component={Expenses} />
              <Stack.Screen name={s.EXPENSE_FORM} component={ExpenseForm} />

              <Stack.Screen name={s.INCOME_GRAPHS} component={IncomeGraph} />

              <Stack.Screen name={s.OFFLINE_SALES} component={OfflineSales} />

              <Stack.Screen name={s.CLIENT_DEBTS} component={ClientDebts} />
            </Stack.Navigator>
          </NavigationContainer>
        </SaleEntryProvider>
      </UserProvider>
    </MenuProvider>
  );
}

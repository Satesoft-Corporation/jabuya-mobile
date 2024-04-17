import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import ViewSales from "./screens/sales/ViewSales";
import SalesEntry from "./screens/salesDesk/SalesEntry";
import ShopSummary from "./screens/ShopSummary";
import StockingMenu from "./screens/stocking/StockingMenu";
import StockPurchaseForm from "./screens/forms/stockingForms/StockPurchaseForm";
import { UserProvider } from "./context/UserContext";
import { SaleEntryProvider } from "./context/SaleEntryContext";
import UpdateScreen from "./screens/UpdateScreen";
import SelectShops from "./screens/SelectShops";
import ProductEntry from "./screens/forms/stockingForms/ProductEntry";
import BarCodeScreen from "./screens/salesDesk/BarCodeScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Colors from "./constants/Colors";
import LockScreen from "./screens/applock/LockScreen";
import Settings from "./screens/settings/Settings";
import LockSetUp from "./screens/applock/LockSetUp";
import CreditMenu from "./screens/sales/credit/CreditMenu";
import CreditSales from "./screens/sales/credit/CreditSales";
import NewClient from "./screens/forms/NewClient";
import ClientRegister from "./screens/sales/credit/ClientRegister";
import CreditPayment from "./screens/forms/CreditPayment";
import ContactBook from "./screens/ContactBook";
import * as s from "./navigation/ScreenNames";
import LandingScreen from "./screens/landingScreen/LandingScreen";
import Expenses from "./screens/expenses/Expenses";
import ExpenseForm from "./screens/expenses/ExpenseForm";
import { MenuProvider } from "react-native-popup-menu";
import StockLevel from "./screens/stocking/StockLevels";
import StockPurchase from "./screens/stocking/StockPurchase";
import IncomeGraph from "./screens/perfomanceGraphs/IncomeGraph";
const Stack = createNativeStackNavigator();

export default function App() {
  //changing the border and text color of the date input fields
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.dark,
      text: Colors.dark,
      background: Colors.light,
    },
  };

  return (
    <MenuProvider>
      <PaperProvider theme={theme}>
        <UserProvider>
          <SaleEntryProvider>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name={s.LANDING_SCREEN}
                  component={LandingScreen}
                />

                <Stack.Screen name={s.LOGIN} component={Login} />

                <Stack.Screen name={s.SALES_DESK} component={SalesEntry} />
                <Stack.Screen name={s.SALES_REPORTS} component={ViewSales} />
                <Stack.Screen
                  name={s.BARCODE_SCREEN}
                  component={BarCodeScreen}
                />

                <Stack.Screen name={s.SHOP_SUMMARY} component={ShopSummary} />
                <Stack.Screen name={s.SHOP_SELECTION} component={SelectShops} />

                <Stack.Screen name={s.STOCKNG} component={StockingMenu} />
                <Stack.Screen name={s.STOCK_ENTRY} component={StockPurchase} />
                <Stack.Screen name={s.STOCK_LEVELS} component={StockLevel} />
                <Stack.Screen name={s.PDT_ENTRY} component={ProductEntry} />
                <Stack.Screen
                  name={s.STOCK_ENTRY_FORM}
                  component={StockPurchaseForm}
                />

                <Stack.Screen name={s.SETTINGS} component={Settings} />
                <Stack.Screen name={s.LOCK_SCREEN} component={LockScreen} />
                <Stack.Screen name={s.LOCK_SETuP} component={LockSetUp} />

                <Stack.Screen name={s.CREDIT_MENU} component={CreditMenu} />
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
              </Stack.Navigator>
            </NavigationContainer>
          </SaleEntryProvider>
        </UserProvider>
      </PaperProvider>
    </MenuProvider>
  );
}

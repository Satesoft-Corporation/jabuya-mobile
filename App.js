import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import LandingScreen from "./screens/LandingScreen";
import SalesEntry from "./screens/SalesEntry";
import ViewSales from "./screens/ViewSales";
import ShopSummary from "./screens/ShopSummary";
import Stocking from "./screens/Stocking";
import StockPurchaseForm from "./forms/StockPurchaseForm";
import { UserProvider } from "./context/UserContext";
import { SaleEntryProvider } from "./context/SaleEntryContext";
import UpdateScreen from "./screens/UpdateScreen";
import StockLevels from "./screens/StockLevels";
import StockListing from "./screens/StockListing";
import StockPurchase from "./screens/StockPurchase";
import SelectShops from "./screens/SelectShops";
import ProductEntry from "./forms/ProductEntry";
import BarCodeScreen from "./screens/BarCodeScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Colors from "./constants/Colors";
import LockScreen from "./screens/applock/LockScreen";
import Settings from "./screens/settings/Settings";
import LockSetUp from "./screens/applock/LockSetUp";

const Stack = createNativeStackNavigator();

export default function App() {
  //changing the borderan text color of the date input fields
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
    <PaperProvider theme={theme}>
      <UserProvider>
        <SaleEntryProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="welcome" component={LandingScreen} />

              <Stack.Screen name="login" component={Login} />

              <Stack.Screen name="salesEntry" component={SalesEntry} />

              <Stack.Screen name="viewSales" component={ViewSales} />

              <Stack.Screen name="barcodeScreen" component={BarCodeScreen} />

              <Stack.Screen name="shopSummary" component={ShopSummary} />

              <Stack.Screen name="stocking" component={Stocking} />

              <Stack.Screen name="stockEntries" component={StockPurchase} />

              <Stack.Screen name="stockLevels" component={StockLevels} />

              <Stack.Screen name="stockListing" component={StockListing} />

              <Stack.Screen name="selectShops" component={SelectShops} />

              <Stack.Screen name="productEntry" component={ProductEntry} />

              <Stack.Screen
                name="newStockEntry"
                component={StockPurchaseForm}
              />

              <Stack.Screen name="settings" component={Settings} />

              <Stack.Screen name="lockscreen" component={LockScreen} />

              <Stack.Screen name="locksetup" component={LockSetUp} />
            </Stack.Navigator>
          </NavigationContainer>
        </SaleEntryProvider>
      </UserProvider>
    </PaperProvider>
  );
}

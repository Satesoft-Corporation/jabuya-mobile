import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import LandingScreen from "./screens/LandingScreen";
import SalesEntry from "./screens/SalesEntry";
import ViewSales from "./screens/ViewSales";
import ShopSummary from "./screens/ShopSummary";
import Stocking from "./screens/Stocking";
import StockPurchaseForm from "./forms/StockPurchaseForm";
import { SearchProvider } from "./context/SearchContext";
import { UserProvider } from "./context/UserContext";
import LandingScreen2 from "./screens/LandingScreen2";
import Stocking2 from "./screens/Stocking2";
import UpdateScreen from "./screens/UpdateScreen";
import StockingModel from "./screens/StockingModel";
import StockLevels from "./screens/StockLevels";
import StockListing from "./screens/StockListing";
import StockPurchase from "./screens/StockPurchase";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="welcome" component={LandingScreen2} />

            <Stack.Screen name="login" component={Login} />

            <Stack.Screen name="salesEntry" component={SalesEntry} />

            <Stack.Screen name="viewSales" component={ViewSales} />

            <Stack.Screen name="shopSummary" component={ShopSummary} />

            <Stack.Screen name="stocking" component={Stocking} />

            <Stack.Screen name="stockPurchase" component={StockPurchase} />

            <Stack.Screen name="stockLevels" component={StockLevels} />

            <Stack.Screen name="stockListing" component={StockListing} />

            <Stack.Screen name="stocking2" component={Stocking2} />

            <Stack.Screen
              name="stockPurchaseForm"
              component={StockPurchaseForm}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SearchProvider>
    </UserProvider>
  );
}

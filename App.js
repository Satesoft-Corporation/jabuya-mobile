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
import { UserProvider } from "./context/UserContext";
import UpdateScreen from "./screens/UpdateScreen";
import StockLevels from "./screens/StockLevels";
import StockListing from "./screens/StockListing";
import StockPurchase from "./screens/StockPurchase";
import SelectShops from "./screens/SelectShops";
import AppCalendar from "./components/AppCalendar";
import ProductEntry from "./forms/ProductEntry";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
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

          <Stack.Screen name="shopSummary" component={ShopSummary} />

          <Stack.Screen name="stocking" component={Stocking} />

          <Stack.Screen name="stockPurchase" component={StockPurchase} />

          <Stack.Screen name="stockLevels" component={StockLevels} />

          <Stack.Screen name="stockListing" component={StockListing} />

          <Stack.Screen name="selectShops" component={SelectShops} />

          <Stack.Screen name="productEntry" component={ProductEntry} />

          <Stack.Screen
            name="stockPurchaseForm"
            component={StockPurchaseForm}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Footer from "../components/layout/Footer";
import SearchScreen from "../screens/more/SearchScreen";
import Product_DetailScreen from "../screens/more/Product_DetailScreen";
import PaymentDetailScreen from "../screens/more/PaymentDetailScreen";
import InvoiceScreen from "../screens/more/InvoiceScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import LanguageScreen from "../screens/startup/LanguageScreen";
import FlashScreen from "../screens/startup/FlashScreen";

const Stack = createStackNavigator();

export const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="FlashScreen">
      <Stack.Screen
        name="FlashScreen"
        component={FlashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Footer"
        component={Footer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductDetail"
        component={Product_DetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PaymentDetail"
        component={PaymentDetailScreen}
        options={{ headerShown: false }} />
      <Stack.Screen name="InvoiceScreen"
        component={InvoiceScreen}
        options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
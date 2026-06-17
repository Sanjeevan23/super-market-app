import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Footer from "../components/layout/Footer";
import SearchScreen from "../screens/more/SearchScreen";
import Product_DetailScreen from "../screens/more/Product_DetailScreen";
import PaymentDetailScreen from "../screens/more/PaymentDetailScreen";
import InvoiceScreen from "../screens/more/InvoiceScreen";
import CountryCodeScreen from "../screens/more/CountryCodeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import VerificationScreen from "../screens/auth/VerificationScreen";
import LocationScreen from "../screens/location/LocationScreen";
import Manual_LocationScreen from "../screens/location/Manual_LocationScreen";
import AddLocationFormScreen from "../screens/location/AddLocationFormScreen";
import LanguageScreen from "../screens/startup/LanguageScreen";
import FlashScreen from "../screens/startup/FlashScreen";
import ChooseScreen from "../screens/startup/ChooseScreen";

const Stack = createStackNavigator();

export const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Footer">
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
        name="ChooseScreen"
        component={ChooseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LocationScreen"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Manual_LocationScreen"
        component={Manual_LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLocationFormScreen"
        component={AddLocationFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CountryCodeScreen"
        component={CountryCodeScreen}
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
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Footer from "../components/layout/Footer";

const Stack = createStackNavigator();

export const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Footer">
      <Stack.Screen
        name="Footer"
        component={Footer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
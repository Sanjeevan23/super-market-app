import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StackNavigator } from "./src/navigator/StackNavigator";
import { LangProvider } from "./src/context/LangContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LangProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#07C187" />
            <StackNavigator />
          </NavigationContainer>
        </LangProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

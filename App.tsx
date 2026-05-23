import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StackNavigator } from "./src/navigator/StackNavigator";
import { LangProvider } from "./src/context/LangContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <LangProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#07C187" />
            <StackNavigator />
          </NavigationContainer>
        </LangProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

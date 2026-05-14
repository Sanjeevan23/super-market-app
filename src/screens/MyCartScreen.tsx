import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyCartScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Cart Screen</Text>
    </View>
  );
};

export default MyCartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
});
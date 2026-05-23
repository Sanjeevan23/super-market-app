// FlashScreen.tsx

import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const FlashScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("LanguageScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#07C187"
        translucent={false}
      />

      <Image
        source={require("../../assets/image/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default FlashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07C187",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 220 * base,
    height: 220 * base,
  },
});
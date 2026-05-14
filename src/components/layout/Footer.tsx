import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  HomeIcon,
  MyCartIcon,
  OrderHistoryIcon,
  ProfileIcon,
} from "../../assets/Icons";

import HomeScreen from "../../screens/HomeScreen";
import MyCartScreen from "../../screens/MyCartScreen";
import OrderHistoryScreen from "../../screens/OrderHistoryScreen";
import ProfileScreen from "../../screens/ProfileScreen";

type TabKey = "home" | "cart" | "orders" | "profile";

const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "cart":
        return <MyCartScreen />;
      case "orders":
        return <OrderHistoryScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.footerWrapper}>
        <Pressable style={styles.item} onPress={() => setActiveTab("home")}>
          <HomeIcon active={activeTab === "home"} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setActiveTab("cart")}>
          <MyCartIcon active={activeTab === "cart"} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setActiveTab("orders")}>
          <OrderHistoryIcon active={activeTab === "orders"} />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setActiveTab("profile")}>
          <ProfileIcon active={activeTab === "profile"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  footerWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal:30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // width: Dimensions.get("window").width,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HomeIcon,
  MyCartIcon,
  OrderHistoryIcon,
  ProfileIcon,
} from "../../assets/Icons";
import { useRoute } from "@react-navigation/native";
import HomeScreen from "../../screens/main/HomeScreen";
import MyCartScreen from "../../screens/main/MyCartScreen";
import OrderHistoryScreen from "../../screens/main/OrderHistoryScreen";
import ProfileScreen from "../../screens/main/ProfileScreen";
import { base } from "../../theme/colors";

type TabKey = "home" | "cart" | "orders" | "profile";

const Footer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();

  const [activeTab, setActiveTab] = useState<TabKey>(
    route.params?.tab ?? "home"
  );

  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route.params?.tab]);

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

      <View style={[styles.footerWrapper, { paddingBottom: insets.bottom || 12 }]}>
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
    paddingHorizontal: 30 * base,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // width: Dimensions.get("window").width,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  },
});
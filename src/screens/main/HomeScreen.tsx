import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { SectionCard } from "../../components/ui/home/SectionCard";
import { useNavigation } from "@react-navigation/native";
import { HOME_BRANDS, HOME_CATEGORIES, SEARCH_PRODUCTS } from "../../data/searchData";
import Carousel from "../../components/ui/home/Carousel";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;
const OFFER_PRODUCTS = SEARCH_PRODUCTS.filter(
  (item) => item.originalPrice && item.offerTag
);
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLang();

  return (
    <ScreenLayout variant="home" onPressSearch={() => navigation.navigate("Search")}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.body}>
          <Carousel />

          <SectionCard
            title={t("shopByCategories")}
            data={HOME_CATEGORIES}
            variant="simple"
            onPressMore={() => {
              // navigate to category screen
            }}
            onPressItem={(item) => {
              navigation.navigate("Search", {
                initialCategory: item.title,
              });
            }}
          />

          <SectionCard
            title={t("shopByBrands")}
            data={HOME_BRANDS}
            variant="simple"
            onPressMore={() => {
              // navigate to brand screen
            }}
            onPressItem={(item) => {
              navigation.navigate("Search", {
                initialBrand: item.title,
              });
            }}
          />

          <SectionCard
            title={t("bestOffers")}
            data={OFFER_PRODUCTS}
            variant="offer"
            onPressMore={() => {
              // navigate to offers screen
            }}
            onPressItem={(item) => {
              navigation.navigate("ProductDetail", {
                item,
              });
            }}
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: 20 * base,
    paddingBottom: 24,
  },
});
import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Dimensions, ImageSourcePropType } from "react-native";
import { AddIcon } from "../../assets/Icons";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

export type ProductCardItem = {
  image: ImageSourcePropType;
  brandName: string;
  title: string;
  measurement: string;
  price: string;
  originalPrice?: string;
  offerTag?: string;
};

type ProductCardProps = {
  item: ProductCardItem;
  width?: number;
  imageHeight?: number;
  onPress?: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  width = 194 * base,
  imageHeight = 120,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]}>
      <View style={[styles.imageWrap, { width, height: imageHeight }]}>
        <Image source={item.image} style={[styles.image, { width, height: imageHeight }]} resizeMode="cover" />

        {item.offerTag ? (
          <View style={styles.offerTag}>
            <Text style={styles.offerTagText}>{item.offerTag}</Text>
          </View>
        ) : null}

        <View style={styles.addIconWrap}>
          <AddIcon />
        </View>
      </View>

      <Text style={styles.brandName} numberOfLines={1}>
        {item.brandName}
      </Text>
      <Text style={styles.productName} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.measurement} numberOfLines={1}>
        {item.measurement}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceText}>{item.price}</Text>
        {item.originalPrice ? <Text style={styles.originalPrice}>{item.originalPrice}</Text> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  imageWrap: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F2F2F3",
  },
  image: {
    borderRadius: 8,
  },
  offerTag: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF000A",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "400",
  },
  addIconWrap: {
    position: "absolute",
    right: 6,
    bottom: 6,
  },
  brandName: {
    marginTop: 6,
    fontSize: 8,
    fontWeight: "500",
    color: "#72828A",
  },
  productName: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
  },
  measurement: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: "400",
    color: "#72828A",
  },
  priceRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
  },
  originalPrice: {
    marginLeft: 6,
    fontSize: 8,
    fontWeight: "400",
    color: "#72828A",
    textDecorationLine: "line-through",
  },
});
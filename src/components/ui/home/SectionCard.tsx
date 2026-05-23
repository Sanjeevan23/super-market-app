import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ImageSourcePropType,
  Dimensions,
  TextStyle,
} from "react-native";
import { AddIcon, MoreIcon } from "../../../assets/Icons";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

type SectionItem = {
  id: string;
  image: ImageSourcePropType;
  title?: string;
  brandName?: string;
  measurement?: string;
  price?: string;
  originalPrice?: string;
  offerTag?: string;
  about?: string;
};

type SectionCardProps = {
  title: string;
  data: SectionItem[];
  variant?: "simple" | "offer";
  onPressMore?: () => void;
  onPressItem?: (item: SectionItem) => void;
  cardWidth?: number;
  imageHeight?: number;
  itemTitleStyle?: TextStyle;
};

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  data,
  variant = "simple",
  onPressMore,
  onPressItem,
  cardWidth = 126 * base,
  imageHeight = 100,
  itemTitleStyle,
}) => {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{title}</Text>

        <Pressable onPress={onPressMore} hitSlop={10}>
          <MoreIcon />
        </Pressable>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPressItem?.(item)}
            style={[styles.card, { width: cardWidth }]}
          >
            <View style={[styles.imageWrap, { width: cardWidth, height: imageHeight }]}>
              <Image
                source={item.image}
                style={[styles.image, { width: cardWidth, height: imageHeight }]}
                resizeMode="cover"
              />

              {variant === "offer" && item.offerTag ? (
                <View style={styles.offerTag}>
                  <Text style={styles.offerTagText}>{item.offerTag}</Text>
                </View>
              ) : null}

              {variant === "offer" ? (
                <View style={styles.addIconWrap}>
                  <AddIcon />
                </View>
              ) : null}
            </View>

            {variant === "simple" ? (
              item.title ? (
                <View style={styles.simpleTextWrap}>
                  <Text style={[styles.simpleTitle, itemTitleStyle]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              ) : null
            ) : (
              <View style={styles.offerTextWrap}>
                {item.brandName ? (
                  <Text style={styles.brandName} numberOfLines={1}>
                    {item.brandName}
                  </Text>
                ) : null}

                {item.title ? (
                  <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                ) : null}

                {item.measurement ? (
                  <Text style={styles.measurement} numberOfLines={1}>
                    {item.measurement}
                  </Text>
                ) : null}

                <View style={styles.priceRow}>
                  {item.price ? (
                    <Text style={styles.priceText}>{item.price}</Text>
                  ) : null}

                  {item.originalPrice ? (
                    <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                  ) : null}
                </View>
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#000000",
  },
  listContent: {
  },
  itemGap: {
    width: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
  },

  imageWrap: {
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    borderRadius: 8,
  },

  simpleTextWrap: {
    marginTop: 2,
    alignItems: "center",
  },
  simpleTitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    textAlign: "center",
  },

  offerTag: {
    position: "absolute",
    top: 6,
    right: 6 * base,
    backgroundColor: "#FF000A",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
  },
  offerTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "400",
  },
  addIconWrap: {
    position: "absolute",
    right: 6 * base,
    bottom: 6,
  },

  offerTextWrap: {
    marginTop: 6,
    alignItems: "flex-start",
  },
  brandName: {
    fontSize: 8,
    fontWeight: "500",
    color: "#72828A",
  },
  productName: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    width:'90%',
    color: "#000000",
  },
  measurement: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: "400",
    color: "#72828A",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
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
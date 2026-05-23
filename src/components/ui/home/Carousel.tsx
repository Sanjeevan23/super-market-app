// src/components/ui/Carousel.tsx

import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const SPACING = 10;
const ITEM_WIDTH = screenWidth * 0.90;
const ITEM_HEIGHT = ITEM_WIDTH * (169 / 400);

const base = screenWidth / 440;

/* ------------------ IMAGES ------------------ */

const images = [
  require("../../../assets/image/carouseal1.png"),
  require("../../../assets/image/carouseal2.png"),
  require("../../../assets/image/carouseal3.png"),
];


const data =
  images.length > 1
    ? [images[images.length - 1], ...images, images[0]]
    : images;

const Carousel: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const didInit = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!flatListRef.current) return;

      const nextIndex = currentIndex + 2;

      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);


  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / (ITEM_WIDTH + SPACING));

    let adjustedIndex = index - 1;

    if (adjustedIndex < 0) {
      adjustedIndex = images.length - 1;
    }

    if (adjustedIndex >= images.length) {
      adjustedIndex = 0;
    }

    setCurrentIndex(adjustedIndex);
  };


  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!flatListRef.current || images.length <= 1) return;

    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / (ITEM_WIDTH + SPACING));

    if (index === 0) {
      flatListRef.current.scrollToIndex({
        index: images.length,
        animated: false,
      });
    }

    if (index === images.length + 1) {
      flatListRef.current.scrollToIndex({
        index: 1,
        animated: false,
      });
    }
  };


  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        bounces={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{
          paddingRight: SPACING,
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + SPACING,
          offset: (ITEM_WIDTH + SPACING) * index,
          index,
        })}
        onContentSizeChange={() => {
          if (!didInit.current && data.length > 1) {
            flatListRef.current?.scrollToIndex({
              index: 1,
              animated: false,
            });

            didInit.current = true;
          }
        }}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={item}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.paginationWrapper}>
        {images.map((_, index) => {
          const active = currentIndex === index;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                active && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default Carousel;


const styles = StyleSheet.create({
  wrapper: {
  },

  imageWrapper: {
    marginRight: SPACING,
  },

  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
  },

  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#DEDEDE",
  },

  activeDot: {
    width: 25,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#07C187",
  },
});
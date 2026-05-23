import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  StatusBar,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FloatingCartIcon } from "../../assets/Icons";

type Props = {
  count: number;
  onPress: () => void;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  draggable?: boolean;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const FloatingButton: React.FC<Props> = ({
  count,
  onPress,
  initialX,
  initialY,
  width = 70,
  height = 70,
  draggable = true,
}) => {
  const insets = useSafeAreaInsets();
  const marginRight = 20;

  const defaultPosX = Math.max(8, screenWidth - (width + 20) - marginRight);
  const defaultPosY = Math.max(8, screenHeight - (height + 160) - 160);

  const initX = typeof initialX === "number" ? initialX : defaultPosX;
  const initY = typeof initialY === "number" ? initialY : defaultPosY;

  const pan = useRef(
    new Animated.ValueXY({
      x: initX,
      y: initY,
    })
  ).current;

  const androidStatusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

  const topLimit =
    insets.top + (Platform.OS === "android" ? androidStatusBarHeight + 8 : 8);
  const bottomLimit = screenHeight - height - Math.max(80, 56 - insets.bottom);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        draggable && (Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6),

      onPanResponderMove: (_, gesture) => {
        if (!draggable) return;

        let newY = gesture.moveY - height / 2;
        if (newY < topLimit) newY = topLimit;
        if (newY > bottomLimit) newY = bottomLimit;

        pan.setValue({
          x: gesture.moveX - width / 2,
          y: newY,
        });
      },

      onPanResponderRelease: (_, gesture) => {
        if (!draggable) return;

        const snapBackX = Math.max(8, screenWidth - width - marginRight);

        let finalY = gesture.moveY - height / 2;
        if (finalY < topLimit) finalY = topLimit;
        if (finalY > bottomLimit) finalY = bottomLimit;

        Animated.spring(pan, {
          toValue: { x: snapBackX, y: finalY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    pan.setValue({ x: initX, y: initY });
  }, [pan, initX, initY]);

  return (
    <Animated.View
      {...(draggable ? panResponder.panHandlers : {})}
      style={[
        {
          position: "absolute",
          width,
          height,
          zIndex: 999,
        },
        pan.getLayout(),
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FloatingCartIcon />
          {count > 0 ? (
            <View
              style={{
                position: "absolute",
                top: 6,
                right: 14,
                minWidth: 16,
                height: 16,
                borderRadius: 100,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#07C187", fontSize: 8, fontWeight: "500" }}>
                {count}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
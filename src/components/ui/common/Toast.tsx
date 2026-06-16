import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "warning";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const BG: Record<ToastType, string> = {
  success: "#1A9E5E",
  error:   "#EC1C24",
  warning: "#E08C00",
};

const ToastItem: React.FC<{ item: ToastMessage; onHide: (id: number) => void }> = ({
  item,
  onHide,
}) => {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide(item.id));
  }, [item.id, onHide, opacity]);

  return (
    <Animated.View style={[styles.toast, { backgroundColor: BG[item.type], opacity }]}>
      <Text style={styles.text}>{item.message}</Text>
    </Animated.View>
  );
};

interface ToastContainerProps {
  messages: ToastMessage[];
  onHide: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onHide }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { top: top + 12 }]} pointerEvents="none">
      {messages.map((item) => (
        <ToastItem key={item.id} item={item} onHide={onHide} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

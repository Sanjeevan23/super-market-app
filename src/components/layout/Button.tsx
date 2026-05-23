import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  GestureResponderEvent,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  DimensionValue,
} from 'react-native';

export interface ButtonProps {
  text?: string;
  onPress?: (e?: GestureResponderEvent) => void;
  containerStyle?: ViewStyle | ViewStyle[];
  backgroundColor?: string;
  width?: DimensionValue;
  height?: number;
  textStyle?: TextStyle | TextStyle[];
  loading?: boolean;
  loaderColor?: string;
  disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  containerStyle,
  backgroundColor,
  width,
  height,
  textStyle,
  loading = false,
  loaderColor,
  disabled = false,
}) => {
  const isDisabled = disabled && !loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.base,
        isDisabled && { backgroundColor: "#72828A" },
        !isDisabled && backgroundColor && { backgroundColor },
        width !== undefined ? { width } : undefined,
        height !== undefined ? { height } : undefined,
        containerStyle,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
        {loading && (
          <ActivityIndicator
            size="small"
            color={loaderColor ?? '#fff'}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#07C187",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: 'center',
  },
});

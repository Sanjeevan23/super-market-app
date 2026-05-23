import React, { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  Animated,
} from "react-native";

interface InputBoxProps extends TextInputProps {
  setValue?: (value: string) => void;
  label?: string;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onPress?: () => void;
  borderColor?: string;
  errorMessage?: string;
}

const InputBox = forwardRef<TextInput, InputBoxProps>((props, ref) => {
  const {
    style,
    placeholder,
    secureTextEntry,
    keyboardType,
    value,
    setValue,
    multiline,
    label,
    rightIcon,
    onRightIconPress,
    onPress,
    borderColor = "#F2F2F3",
    editable = true,
    errorMessage = "",
    inputStyle,
    ...rest
  } = props;

  const effectiveBorderColor = errorMessage ? "#FF4B2B" : borderColor;

  return (
    <View style={localStyles.wrapper}>
      {label ? <Text style={localStyles.label}>{label}</Text> : null}

      <Animated.View style={localStyles.rowM}>
        <TouchableOpacity activeOpacity={onPress ? 0.8 : 1} onPress={onPress} disabled={!onPress}>
          <View style={localStyles.rowContainer}>
            <View style={[localStyles.row, { borderColor: effectiveBorderColor }]}>
              <TextInput
                ref={ref}
                placeholder={placeholder}
                placeholderTextColor="#72828A"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onChangeText={setValue}
                multiline={multiline}
                value={value}
                style={[localStyles.input, style, inputStyle]}
                textAlignVertical={multiline ? "top" : "center"}
                editable={editable && !onPress}
                pointerEvents={onPress ? "none" : "auto"}
                {...rest}
              />

              {rightIcon ? (
                <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.8}>
                  <View style={localStyles.iconWrap}>{rightIcon}</View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {errorMessage ? <Text style={localStyles.error}>{errorMessage}</Text> : null}
    </View>
  );
});

const localStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    letterSpacing: 0.3,
  },
  rowM: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F2F2F3",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 17,
    color: "#000000",
  },
  iconWrap: {
    paddingRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#FF4B2B",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 8,
    marginLeft: 4,
  },
});

export default InputBox;
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

interface PhoneInputBoxProps extends TextInputProps {
  label?: string;
  setValue?: (value: string) => void;
  errorMessage?: string;
  flagIcon?: React.ReactNode;
  onFlagPress?: () => void;
  borderColor?: string;
}

const PhoneInputBox: React.FC<PhoneInputBoxProps> = ({
  label,
  value,
  setValue,
  placeholder,
  errorMessage = "",
  flagIcon,
  onFlagPress,
  borderColor = "#F2F2F3",
  keyboardType = "phone-pad",
  ...rest
}) => {
  const effectiveBorderColor = errorMessage ? "#FF4B2B" : borderColor;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.row, { borderColor: effectiveBorderColor }]}>
        <TouchableOpacity
          onPress={onFlagPress}
          activeOpacity={onFlagPress ? 0.7 : 1}
          style={styles.flagArea}
          disabled={!onFlagPress}
        >
          {flagIcon}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#72828A"
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          {...rest}
        />
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

export default PhoneInputBox;

const styles = StyleSheet.create({
  wrapper: {},
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F2F2F3",
    overflow: "hidden",
  },
  flagArea: {
    paddingHorizontal: 14,
    paddingVertical: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#D1D5DB",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 17,
    color: "#000000",
  },
  error: {
    color: "#FF4B2B",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 8,
    marginLeft: 4,
  },
});

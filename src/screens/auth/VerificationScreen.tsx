import React, { useRef, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import { base, Colors } from "../../theme/colors";
import { useLang } from "../../context/LangContext";
import { useCountdownTimer } from "../../utils/useCountdownTimer";

// Replace with real OTP from API
const OTP = "123456";
const OTP_LENGTH = 6;
const TIMER_SECONDS = 3 * 60;

const { width: deviceWidth } = Dimensions.get("window");

const maskEmail = (email: string): string => {
    const [local, domain] = email.split("@");
    if (!domain || local.length < 2) return email;
    return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
};

const VerificationScreen: React.FC = () => {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const email: string = route.params?.email ?? "";

    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const { formatted, isExpired, restart } = useCountdownTimer(TIMER_SECONDS);

    const handleChange = (text: string, index: number) => {
        const digit = text.replace(/[^0-9]/g, "").slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        setError("");
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        if (isExpired) {
            setError(t("otpExpired"));
            return;
        }
        const entered = digits.join("");
        if (entered.length < OTP_LENGTH) {
            setError(t("invalidOtp"));
            return;
        }
        if (entered !== OTP) {
            setError(t("invalidOtp"));
            return;
        }
        navigation.navigate("LocationScreen");
    };

    const handleResend = () => {
        setDigits(Array(OTP_LENGTH).fill(""));
        setError("");
        restart();
        inputRefs.current[0]?.focus();
    };

    return (
        <ScreenLayout variant="inner" title={t("emailVerification")}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior="padding"
            >
            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.screen}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>{t("enterOtpNumber")}</Text>

                <Text style={styles.subtext}>
                    {t("otpSentTo")}{"\n"}
                    <Text style={styles.emailText}>{maskEmail(email)}</Text>
                </Text>

                <View style={styles.otpRow}>
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <TextInput
                            key={i}
                            ref={r => { inputRefs.current[i] = r; }}
                            style={[
                                styles.otpBox,
                                digits[i] ? styles.otpBox : null,
                                error ? styles.otpBoxError : null,
                            ]}
                            keyboardType="number-pad"
                            placeholder="-"
                            maxLength={1}
                            value={digits[i]}
                            onChangeText={text => handleChange(text, i)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                            textAlign="center"
                            caretHidden
                        />
                    ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.timerRow}>
                    <Text style={styles.timerLabel}>{t("codeExpiresIn")} </Text>
                    <Text style={[styles.timerValue, isExpired && styles.timerExpired]}>
                        {formatted}
                    </Text>
                </View>

                <View style={styles.resendRow}>
                    <Text style={styles.resendLabel}>{t("didntReceiveCode")} </Text>
                    <Pressable onPress={handleResend}>
                        <Text style={[styles.resendLink, isExpired && styles.resendLinkActive]}>
                            {t("resend")}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    text={t("verify")}
                    onPress={handleVerify}
                    disabled={digits.join("").length < OTP_LENGTH}
                />
            </View>
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
};

export default VerificationScreen;

// const boxSize = (deviceWidth - 40 * base * 2 - 8 * base * 5) / OTP_LENGTH;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    screen: {
        paddingHorizontal: 20 * base,
        paddingTop: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.black,
    },
    subtext: {
        marginTop: 16 * base,
        fontSize: 14,
        color: Colors.subText,
        lineHeight: 22,
    },
    emailText: {
        color: Colors.black,
        fontWeight: "500",
    },
    otpRow: {
        flexDirection: "row",
        gap: 8 * base,
        marginTop: 20 * base,
    },
    otpBox: {
        width: 60 * base,
        height: 51 * base,
        borderRadius: 10,
        backgroundColor: Colors.boxBg,
        fontSize: 20,
        color: Colors.black,
        borderWidth: 1,
        borderColor: "transparent",
    },
    otpBoxError: {
        borderColor: Colors.error,
    },
    errorText: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.error,
        marginLeft: 4,
    },
    timerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    timerLabel: {
        fontSize: 14,
        color: Colors.subText,
    },
    timerValue: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.black,
    },
    timerExpired: {
        color: Colors.error,
    },
    resendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    resendLabel: {
        fontSize: 14,
        color: Colors.subText,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.subText,
    },
    resendLinkActive: {
        color: Colors.primary,
    },
    footer: {
        paddingHorizontal: 20 * base,
        paddingBottom: 16,
    },
});

import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/layout/Button";
import { CheckBoxIcon, EyeOpenIcon, EyeCloseIcon, GoogleIcon, AppleIcon, FaceBookIcon } from "../../assets/Icons";
import { useLang, TranslationKey } from "../../context/LangContext";
import { validateEmailLive } from "../../utils/emailValidator";
import { validatePasswordLive } from "../../utils/passwordValidator";
import InputBox from "../../components/layout/InputBox";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { findUserByIdentifier } from "../../data/user";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const emailErrorMap: Record<string, TranslationKey> = {
    EMAIL_MISSING_AT: "EMAIL_MISSING_AT",
    EMAIL_LOCAL_TOO_SHORT: "EMAIL_LOCAL_TOO_SHORT",
    EMAIL_DOMAIN_MISSING: "EMAIL_DOMAIN_MISSING",
    EMAIL_TLD_MISSING: "EMAIL_TLD_MISSING",
    EMAIL_DOMAIN_INVALID: "EMAIL_DOMAIN_INVALID",
    EMAIL_TLD_INVALID: "EMAIL_TLD_INVALID",
    EMAIL_FORMAT_INVALID: "EMAIL_FORMAT_INVALID",
};

const passwordErrorMap: Record<string, TranslationKey> = {
    PWD_FIRST_CHAR_LETTER: "PWD_FIRST_CHAR_LETTER",
    PWD_FIRST_CAPITAL: "PWD_FIRST_CAPITAL",
    PWD_TOO_SHORT: "PWD_TOO_SHORT",
    PWD_NO_NUMBER: "PWD_NO_NUMBER",
    PWD_NO_SYMBOL: "PWD_NO_SYMBOL",
};

const LoginScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { t } = useLang();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [identifierError, setIdentifierError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleIdentifierChange = (value: string) => {
        setIdentifier(value);
        setIdentifierError("");

        const trimmed = value.trim();
        if (trimmed.includes("@")) {
            const code = validateEmailLive(trimmed);
            setIdentifierError(code ? t(emailErrorMap[code]) : "");
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordError("");

        if (value) {
            const code = validatePasswordLive(value);
            setPasswordError(code ? t(passwordErrorMap[code]) : "");
        }
    };

    const handleContinue = () => {
        const cleanIdentifier = identifier.trim();
        const cleanPassword = password.trim();

        let hasError = false;

        setIdentifierError("");
        setPasswordError("");

        if (!cleanIdentifier) {
            setIdentifierError(t("emailOrUsernameRequired"));
            hasError = true;
        }

        if (!cleanPassword) {
            setPasswordError(t("passwordRequired"));
            hasError = true;
        }

        if (hasError) return;

        if (cleanIdentifier.includes("@")) {
            const emailCode = validateEmailLive(cleanIdentifier);
            if (emailCode) {
                setIdentifierError(t(emailErrorMap[emailCode]));
                return;
            }
        }

        const user = findUserByIdentifier(cleanIdentifier);

        if (!user) {
            setIdentifierError(t("emailOrUsernameNotFound"));
            return;
        }

        if (user.password !== cleanPassword) {
            setPasswordError(t("incorrectPassword"));
            return;
        }

        navigation.reset({
            index: 0,
            routes: [{ name: "Footer" }],
        });
    };

    const socialButtons = useMemo(
        () => [
            { key: "google", label: <GoogleIcon /> },
            { key: "apple", label: <AppleIcon /> },
            { key: "facebook", label: <FaceBookIcon /> },
        ],
        []
    );

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#07C187" translucent={false} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <Image
                        source={require("../../assets/image/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>{t("signIn")}</Text>

                    <Text style={styles.subtitle}>{t("welcomeBack")}</Text>

                    <View style={styles.card}>
                        <InputBox
                            label={t("emailAddress")}
                            placeholder={t("emailPlaceholder")}
                            value={identifier}
                            setValue={handleIdentifierChange}
                            errorMessage={identifierError}
                            borderColor="#F2F2F3"
                            inputStyle={styles.inputText}
                        />

                        <InputBox
                            label={t("password")}
                            placeholder={t("passwordPlaceholder")}
                            value={password}
                            setValue={handlePasswordChange}
                            secureTextEntry={!showPassword}
                            errorMessage={passwordError}
                            borderColor="#F2F2F3"
                            inputStyle={styles.inputText}
                            rightIcon={showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                            onRightIconPress={() => setShowPassword((prev) => !prev)}
                        />

                        <View style={styles.rowBetween}>
                            <Pressable
                                style={styles.rememberRow}
                                onPress={() => setRememberMe((prev) => !prev)}
                            >
                                <CheckBoxIcon checked={rememberMe} />
                                <Text style={styles.rememberText}>{t("rememberMe")}</Text>
                            </Pressable>

                            <Pressable onPress={() => { }}>
                                <Text style={styles.forgotText}>{t("forgotPassword")}</Text>
                            </Pressable>
                        </View>

                        <Button text={t("continue")} containerStyle={{ marginTop: 100 }} onPress={handleContinue} />

                        <View style={styles.spacer30} />

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>{t("orContinueWith")}</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialRow}>
                            {socialButtons.map((item) => (
                                <Pressable key={item.key} style={styles.socialButton}>
                                    <Text >{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#07C187",
    },
    flex: {
        flex: 1,
    },
    content: {},
    logo: {
        width: 180 * base,
        height: 70 * base,
        alignSelf: "center",
        marginTop: 30,
    },
    title: {
        marginTop: 30,
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 10,
        width: "50%",
        alignSelf: "center",
        fontSize: 14,
        fontWeight: "400",
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: 20,
    },
    card: {
        marginTop: 30,
        marginHorizontal: 20 * base,
        paddingHorizontal: 20 * base,
        paddingTop: 20,
        paddingBottom: 60,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        marginBottom:30,
    },
    inputText: {
        fontSize: 14,
        color: "#000000",
    },
    rowBetween: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rememberRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    rememberText: {
        marginLeft: 8,
        color: "#72828A",
        fontSize: 14,
        fontWeight: "400",
    },
    forgotText: {
        color: "#07C187",
        fontSize: 14,
        fontWeight: "500",
    },
    spacer30: {
        height: 30,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#72828A",
    },
    dividerText: {
        marginHorizontal: 27 * base,
        fontSize: 14,
        color: "#72828A",
        fontWeight: "400",
    },
    socialRow: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 30 * base,
    },
    socialButton: {
        borderRadius: 100,
        backgroundColor: "#F2F2F3",
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
});
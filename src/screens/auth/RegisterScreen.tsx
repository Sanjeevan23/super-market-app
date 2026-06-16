import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components/layout/Button";
import InputBox from "../../components/layout/InputBox";
import { EyeOpenIcon, EyeCloseIcon, GermanFlagIcon, UKFlagIcon, FrenchFlagIcon } from "../../assets/Icons";

const FLAG_MAP: Record<string, React.ReactElement> = {
    de: <GermanFlagIcon />,
    en: <UKFlagIcon />,
    fr: <FrenchFlagIcon />,
};
import { useLang, TranslationKey } from "../../context/LangContext";
import { base, Colors } from "../../theme/colors";
import { validateEmailLive } from "../../utils/emailValidator";
import { validatePasswordLive } from "../../utils/passwordValidator";

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

const RegisterScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { t } = useLang();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const route = useRoute<any>();
    const [countryId, setCountryId] = useState("de");
    // const [dialCode, setDialCode] = useState("+49");

    React.useEffect(() => {
        if (route.params?.selectedCountry) {
            setCountryId(route.params.selectedCountry.id);
            // setDialCode(route.params.selectedCountry.dialCode);
        }
    }, [route.params?.selectedCountry]);

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailError("");
        if (value.trim()) {
            const code = validateEmailLive(value.trim());
            setEmailError(code ? t(emailErrorMap[code]) : "");
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordError("");
        if (value) {
            const code = validatePasswordLive(value);
            setPasswordError(code ? t(passwordErrorMap[code]) : "");
        }
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError(t("passwordsDoNotMatch"));
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setConfirmPasswordError(value && value !== password ? t("passwordsDoNotMatch") : "");
    };

    const handleNext = () => {
        let hasError = false;

        setFullNameError("");
        setEmailError("");
        setPhoneError("");
        setPasswordError("");
        setConfirmPasswordError("");

        if (!fullName.trim()) { setFullNameError(t("fullNameRequired")); hasError = true; }

        if (!email.trim()) {
            setEmailError(t("emailRequired")); hasError = true;
        } else {
            const code = validateEmailLive(email.trim());
            if (code) { setEmailError(t(emailErrorMap[code])); hasError = true; }
        }

        if (!phone.trim()) { setPhoneError(t("phoneRequired")); hasError = true; }

        if (!password) {
            setPasswordError(t("passwordRequired")); hasError = true;
        } else {
            const code = validatePasswordLive(password);
            if (code) { setPasswordError(t(passwordErrorMap[code])); hasError = true; }
        }

        if (!confirmPassword) {
            setConfirmPasswordError(t("passwordRequired")); hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(t("passwordsDoNotMatch")); hasError = true;
        }

        if (hasError) return;
        navigation.navigate("VerificationScreen", { email });
    };

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

                    <Text style={styles.title}>{t("signUp")}</Text>
                    <Text style={styles.subtitle}>{t("createAccountSubtitle")}</Text>

                    <View style={styles.card}>
                        <InputBox
                            label={t("fullName")}
                            placeholder={t("fullNamePlaceholder")}
                            value={fullName}
                            setValue={(v) => { setFullName(v); setFullNameError(""); }}
                            errorMessage={fullNameError}
                        />

                        <InputBox
                            label={t("emailAddress")}
                            placeholder={t("emailPlaceholder")}
                            value={email}
                            setValue={handleEmailChange}
                            errorMessage={emailError}
                        />

                        <View>
                            <Text style={styles.phoneLabel}>{t("phoneNumber")}</Text>
                            <View style={styles.phoneRow}>
                                <Pressable
                                    style={[styles.flagBox, phoneError ? styles.flagBoxError : null]}
                                    onPress={() => navigation.navigate("CountryCodeScreen", { selectedId: countryId })}
                                >
                                    {FLAG_MAP[countryId]}
                                    {/* <Text style={styles.dialCode}>{dialCode}</Text> */}
                                </Pressable>
                                <View style={styles.phoneInput}>
                                    <InputBox
                                        placeholder={t("phonePlaceholder")}
                                        value={phone}
                                        setValue={(v) => { setPhone(v); setPhoneError(""); }}
                                        borderColor={phoneError ? "#FF4B2B" : "#F2F2F3"}
                                    />
                                </View>
                            </View>
                            {phoneError ? <Text style={styles.phoneError}>{phoneError}</Text> : null}
                        </View>

                        <InputBox
                            label={t("password")}
                            placeholder={t("passwordPlaceholder")}
                            value={password}
                            setValue={handlePasswordChange}
                            secureTextEntry={!showPassword}
                            errorMessage={passwordError}
                            rightIcon={showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                            onRightIconPress={() => setShowPassword(p => !p)}
                        />

                        <InputBox
                            label={t("confirmPassword")}
                            placeholder={t("confirmPasswordPlaceholder")}
                            value={confirmPassword}
                            setValue={handleConfirmPasswordChange}
                            secureTextEntry={!showConfirm}
                            errorMessage={confirmPasswordError}
                            rightIcon={showConfirm ? <EyeCloseIcon /> : <EyeOpenIcon />}
                            onRightIconPress={() => setShowConfirm(p => !p)}
                        />

                        <Button
                            text={t("next")}
                            containerStyle={styles.nextButton}
                            onPress={handleNext}
                        />

                        <View style={styles.signinRow}>
                            <Text style={styles.signinText}>{t("alreadyHaveAccount")} </Text>
                            <Pressable onPress={() => navigation.navigate("LoginScreen")}>
                                <Text style={styles.signinLink}>{t("signInLink")}</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    flex: {
        flex: 1,
    },
    content: {
        paddingBottom: 30,
        paddingHorizontal:20 * base
    },
    logo: {
        width: 180 * base,
        height: 70 * base,
        alignSelf: "center",
        marginTop: 30 * base,
    },
    title: {
        marginTop: 30 * base,
        fontSize: 16,
        fontWeight: "600",
        color: Colors.white,
        textAlign: "center",
    },
    subtitle: {
        width: "60%",
        alignSelf: "center",
        fontSize: 14,
        fontWeight: "400",
        color: Colors.white,
        textAlign: "center",
    },
    card: {
        marginTop: 30 * base,
        paddingHorizontal: 20 * base,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: Colors.white,
        borderRadius: 30,
        marginBottom: 30,
        gap: 16,
    },
    phoneLabel: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "500",
        color: Colors.black,
        letterSpacing: 0.3,
    },
    phoneRow: {
        flexDirection: "row",
        gap: 8,
        alignItems: "stretch",
    },
    flagBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: Colors.boxBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#F2F2F3",
        paddingHorizontal: 14,
    },
    dialCode: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.black,
    },
    flagBoxError: {
        borderColor: "#FF4B2B",
    },
    phoneInput: {
        flex: 1,
    },
    phoneError: {
        color: "#FF4B2B",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 8,
        marginLeft: 4,
    },
    nextButton: {
        marginTop:  14 * base,
    },
    signinRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 14 * base,
    },
    signinText: {
        fontSize: 16,
        color: Colors.subText,
        letterSpacing:0.3
    },
    signinLink: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: "500",
    },
});

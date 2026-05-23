import React, { useEffect, useMemo, useState } from "react";
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
import {
    GermanFlagIcon,
    UKFlagIcon,
    FrenchFlagIcon,
    RadioActiveIcon,
    RadioInactiveIcon,
} from "../../assets/Icons";
import translations from "../../assets/translation.json";
import { useLang, Lang, TranslationKey } from "../../context/LangContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

type LanguageItem = {
    id: Lang;
    nativeName: string;
    englishName: string;
    flag: React.ReactNode;
};

const LanguageScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { lang, setLang } = useLang();

    const [selected, setSelected] = useState<Lang>(lang);

    useEffect(() => {
        setSelected(lang);
    }, [lang]);

    const liveT = (key: TranslationKey) => {
        return translations[selected]?.[key] ?? translations.en?.[key] ?? key;
    };

    const languages: LanguageItem[] = useMemo(
        () => [
            {
                id: "de",
                nativeName: "Deutsch",
                englishName: "German",
                flag: <GermanFlagIcon />,
            },
            {
                id: "en",
                nativeName: "English",
                englishName: "English (UK)",
                flag: <UKFlagIcon />,
            },
            {
                id: "fr",
                nativeName: "Français",
                englishName: "French",
                flag: <FrenchFlagIcon />,
            },
        ],
        []
    );

    const handleSelect = async () => {
        await setLang(selected);
        navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
        });
    };

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#07C187" translucent={false} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}
                >
                    <Image
                        source={require("../../assets/image/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={styles.card}>
                        <Image
                            source={require("../../assets/image/languages.png")}
                            style={styles.languagesImage}
                            resizeMode="contain"
                        />

                        <Text style={styles.title}>{liveT("selectYourLanguage")}</Text>
                        <Text style={styles.subtitle}>{liveT("chooseHowYouLikeToViewTheApp")}</Text>

                        <View style={styles.list}>
                            {languages.map((item) => {
                                const isActive = selected === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        style={[styles.item, isActive && styles.itemActive]}
                                        onPress={() => setSelected(item.id)}
                                    >
                                        <View style={styles.radioWrap}>
                                            {isActive ? <RadioActiveIcon /> : <RadioInactiveIcon />}
                                        </View>

                                        {item.flag}

                                        <View style={styles.textWrap}>
                                            <Text style={styles.itemTitle}>{item.nativeName}</Text>
                                            <Text style={styles.itemSubtitle}>{item.englishName}</Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Button
                            text={liveT("select")}
                            onPress={handleSelect}
                            containerStyle={styles.button}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LanguageScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#07C187",
    },
    flex: {
        flex: 1,
    },
    content: {
        paddingBottom: 24,
    },
    logo: {
        width: 180 * base,
        height: 70 * base,
        alignSelf: "center",
        marginTop: 30,
    },
    card: {
        marginTop: 80 * base,
        marginHorizontal: 20 * base,
        paddingHorizontal: 20 * base,
        paddingTop: 20,
        paddingBottom: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
    },
    languagesImage: {
        width: 200 * base,
        height: 200 * base,
        alignSelf: "center",
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "#000000",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#72828A",
        textAlign: "center",
        lineHeight: 20,
    },
    list: {
        marginTop: 30,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 10,
        gap: 8,
        backgroundColor: "#FFFFFF",
    },
    itemActive: {
        borderColor: "#07C187",
    },
    radioWrap: {},
    textWrap: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
    },
    itemSubtitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "400",
        color: "#72828A",
        lineHeight: 14,
    },
    button: {
        marginTop: 20,
    },
});
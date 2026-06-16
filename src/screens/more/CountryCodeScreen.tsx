import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { RadioActiveIcon, RadioInactiveIcon, GermanFlagIcon, UKFlagIcon, FrenchFlagIcon } from "../../assets/Icons";
import { Button } from "../../components/layout/Button";
import { useLang } from "../../context/LangContext";
import { base, Colors } from "../../theme/colors";

export type CountryCode = {
    id: string;
    name: string;
    dialCode: string;
    flag: React.ReactNode;
};

const COUNTRIES: CountryCode[] = [
    { id: "de", name: "Deutsch",   dialCode: "+49", flag: <GermanFlagIcon /> },
    { id: "fr", name: "Français",  dialCode: "+33", flag: <FrenchFlagIcon /> },
    { id: "en", name: "English",   dialCode: "+44", flag: <UKFlagIcon /> },
];

type RouteParams = {
    CountryCodeScreen: { selectedId?: string };
};

const CountryCodeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<RouteParams, "CountryCodeScreen">>();
    const { t } = useLang();

    const [selectedId, setSelectedId] = useState(route.params?.selectedId ?? "de");

    const handleSave = () => {
        const country = COUNTRIES.find(c => c.id === selectedId)!;
        navigation.navigate("RegisterScreen", { selectedCountry: country });
    };

    return (
        <ScreenLayout variant="inner" title={t("selectCountryCode")}>
            <FlatList
                data={COUNTRIES}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const isActive = selectedId === item.id;
                    return (
                        <Pressable
                            style={[styles.row, isActive && styles.rowActive]}
                            onPress={() => setSelectedId(item.id)}
                        >
                            <View style={styles.radioWrap}>
                                {isActive ? <RadioActiveIcon /> : <RadioInactiveIcon />}
                            </View>
                            {item.flag}
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.dialCode}>{item.dialCode}</Text>
                        </Pressable>
                    );
                }}
            />
            <View style={styles.footer}>
                <Button text={t("save")} onPress={handleSave} />
            </View>
        </ScreenLayout>
    );
};

export default CountryCodeScreen;

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 20 * base,
        paddingTop: 16,
        gap: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 12 * base,
        paddingVertical: 8.5,
        gap: 8 * base,
        backgroundColor: Colors.white,
    },
    rowActive: {
        borderColor:Colors.primary,
    },
    radioWrap: {},
    name: {
        flex: 1,
        fontSize: 12,
        fontWeight: "400",
        color: Colors.black,
    },
    dialCode: {
        fontSize: 12,
        fontWeight: "500",
        color: Colors.black,
    },
    footer: {
        paddingHorizontal: 20 * base,
        paddingVertical: 16,
    },
});

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    FlatList,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import { MapPinIcon, SearchIcon } from "../../assets/Icons";
import { base, Colors } from "../../theme/colors";
import { useLang } from "../../context/LangContext";
import { useLocation } from "../../utils/useLocation";

const PREVIOUS_ADDRESSES_KEY = "previous_addresses_v1";
const MAX_PREVIOUS = 5;

type NominatimResult = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
};

type SavedAddress = {
    id: string;
    display_name: string;
    lat: string;
    lon: string;
};

const Manual_LocationScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useLang();
    const { requestLocation, loading: locationLoading } = useLocation();

    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [previousAddresses, setPreviousAddresses] = useState<SavedAddress[]>([]);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        loadPreviousAddresses();
    }, []);

    const loadPreviousAddresses = async () => {
        try {
            const raw = await AsyncStorage.getItem(PREVIOUS_ADDRESSES_KEY);
            if (raw) setPreviousAddresses(JSON.parse(raw));
        } catch {
            setPreviousAddresses([]);
        }
    };

    const saveAddress = async (item: NominatimResult) => {
        const newEntry: SavedAddress = {
            id: String(item.place_id),
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
        };
        const filtered = previousAddresses.filter((a) => a.id !== newEntry.id);
        const next = [newEntry, ...filtered].slice(0, MAX_PREVIOUS);
        setPreviousAddresses(next);
        try {
            await AsyncStorage.setItem(PREVIOUS_ADDRESSES_KEY, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const deletePreviousAddress = async (id: string) => {
        const next = previousAddresses.filter((a) => a.id !== id);
        setPreviousAddresses(next);
        try {
            await AsyncStorage.setItem(PREVIOUS_ADDRESSES_KEY, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const searchAddress = async (text: string) => {
        const q = text.trim();
        if (!q) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=0`;
            const res = await fetch(url, {
                headers: { "User-Agent": "HappyCartApp/1.0" },
            });
            const data: NominatimResult[] = await res.json();
            setResults(data);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    };

    const onChangeText = (text: string) => {
        setQuery(text);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchAddress(text), 400);
    };

    const handleSelectResult = async (item: NominatimResult) => {
        Keyboard.dismiss();
        setQuery(item.display_name);
        setResults([]);
        await saveAddress(item);
        navigation.navigate("AddLocationFormScreen", {
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
        });
    };

    const handleSelectPrevious = (item: SavedAddress) => {
        Keyboard.dismiss();
        setQuery(item.display_name);
        setResults([]);
        navigation.navigate("AddLocationFormScreen", {
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
        });
    };

    const handleAllowLocation = async () => {
        const result = await requestLocation();
        if (result) {
            navigation.navigate("AddLocationFormScreen", {
                lat: String(result.latitude),
                lon: String(result.longitude),
                display_name: "",
            });
        }
    };

    const isSearching = query.trim().length > 0;
    const showHint = !isSearching;
    const showPrevious = !isSearching && previousAddresses.length > 0;

    return (
        <ScreenLayout variant="inner" title={t("enterYourLocation")}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
                        <SearchIcon active={focused || isSearching} width={17 * base} height={17 * base} />
                        <TextInput
                            value={query}
                            onChangeText={onChangeText}
                            placeholder={t("searchPlaceholder")}
                            placeholderTextColor={Colors.subText}
                            style={styles.searchInput}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            returnKeyType="search"
                        />
                        {searching && (
                            <ActivityIndicator size="small" color={Colors.primary} />
                        )}
                    </View>

                    {showHint && (
                        <Text style={styles.hintText}>{t("addressHint")}</Text>
                    )}

                    {showPrevious && (
                        <View style={styles.previousSection}>
                            <Text style={styles.previousTitle}>{t("previousAddress")}</Text>
                            {previousAddresses.map((item) => (
                                <View key={item.id} style={[styles.resultRow,{marginTop:8}]}>
                                    <MapPinIcon width={21* base} height={21 * base} />
                                    <Pressable
                                        style={styles.resultTextWrap}
                                        onPress={() => handleSelectPrevious(item)}
                                    >
                                        <Text style={styles.resultText} numberOfLines={2}>
                                            {item.display_name}
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => deletePreviousAddress(item.id)}
                                        hitSlop={8}
                                        style={styles.deleteBtn}
                                    >
                                        <Text style={styles.deleteText}>✕</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}

                    {isSearching && results.length > 0 && (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => String(item.place_id)}
                            keyboardShouldPersistTaps="handled"
                            scrollEnabled={false}
                            style={{marginTop:12 }}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.resultRow}
                                    onPress={() => handleSelectResult(item)}
                                >
                                    <MapPinIcon width={21 * base} height={21 * base} />
                                    <Text style={[styles.resultText, styles.resultTextGap]} numberOfLines={2}>
                                        {item.display_name}
                                    </Text>
                                </Pressable>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    )}
                </View>

                <View style={styles.footer}>
                    <Button
                        text={t("allowGoogleMaps")}
                        onPress={handleAllowLocation}
                        loading={locationLoading}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default Manual_LocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    content: {
        paddingHorizontal: 20 * base,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.boxBg,
        borderRadius: 8,
        paddingHorizontal: 20 * base,
        paddingVertical: 17 * base,
        gap: 8 * base,
    },
    searchBoxFocused: {
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: "400",
        color: Colors.black,
    },
    hintText: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "400",
        color: Colors.subText,
    },
    previousSection: {
        marginTop: 20,
    },
    previousTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.black,
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    resultTextWrap: {
        flex: 1,
        marginLeft: 8 * base,
    },
    resultText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "400",
        color: Colors.black,
    },
    resultTextGap: {
        marginLeft: 8 * base,
    },
    deleteBtn: {
        paddingHorizontal: 4,
        marginLeft: 8,
    },
    deleteText: {
        fontSize: 12,
        color: Colors.subText,
    },
    separator: {
        height: 16,
    },
    footer: {
        paddingHorizontal: 20 * base,
        paddingBottom: 16,
    },
});

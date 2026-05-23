import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    FlatList,
    Dimensions,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FilterIcon, NoResultsIcon, SearchIcon } from "../../assets/Icons";
import { ProductCard } from "../../components/ui/ProductCard";
import { SearchFilterDrawer } from "../../components/ui/search/SearchFilterDrawer";
import {
    SEARCH_CATEGORY_TREE,
    SEARCH_PRODUCTS,
    SearchProduct,
} from "../../data/searchData";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

type SortKey = "all" | "priceHigh" | "priceLow" | "discount" | "popularity" | "newest";

type SuggestionItem =
    | { id: string; type: "category"; label: string; category: string }
    | { id: string; type: "product"; label: string; product: SearchProduct };

const RECENT_STORAGE_KEY = "recent_searches_v1";

const parsePrice = (value?: string) => {
    if (!value) return 0;
    const numeric = value.replace(/[^0-9.]/g, "");
    return Number(numeric || 0);
};

const getDiscountPercent = (item: SearchProduct) => {
    const price = parsePrice(item.price);
    const original = parsePrice(item.originalPrice);
    if (!original || original <= price) return 0;
    return ((original - price) / original) * 100;
};

const SearchScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useLang();

    const TAGS: { key: SortKey; label: string }[] = useMemo(() => [
        { key: "all", label: t("sortAll") },
        { key: "priceHigh", label: t("sortPriceHigh") },
        { key: "priceLow", label: t("sortPriceLow") },
        { key: "discount", label: t("sortDiscount") },
        { key: "popularity", label: t("sortPopularity") },
        { key: "newest", label: t("sortNewest") },
    ], [t]);

    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);

    const [searchCommitted, setSearchCommitted] = useState(false);
    const [committedQuery, setCommittedQuery] = useState("");

    const [selectedTag, setSelectedTag] = useState<SortKey>("all");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");

    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const initialCategory = route.params?.initialCategory;
        const initialBrand = route.params?.initialBrand;

        if (initialCategory) {
            setSelectedCategory(initialCategory);
            setSelectedSubCategory("All");
            setQuery(initialCategory);
            setCommittedQuery(initialCategory);
            setSearchCommitted(true);
        }

        if (initialBrand) {
            setSelectedBrand(initialBrand);
            setQuery(initialBrand);
            setCommittedQuery(initialBrand);
            setSearchCommitted(true);
        }
    }, [route.params]);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const raw = await AsyncStorage.getItem(RECENT_STORAGE_KEY);
                if (raw) {
                    setRecentSearches(JSON.parse(raw));
                }
            } catch {
                setRecentSearches([]);
            }
        };

        loadRecent();
    }, []);

    const saveRecentSearches = async (next: string[]) => {
        setRecentSearches(next);
        try {
            await AsyncStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const addRecentSearch = async (term: string) => {
        const clean = term.trim();
        if (!clean) return;

        const next = [clean, ...recentSearches.filter((x) => x.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
        await saveRecentSearches(next);
    };

    const removeRecentSearch = async (term: string) => {
        const next = recentSearches.filter((x) => x.toLowerCase() !== term.toLowerCase());
        await saveRecentSearches(next);
    };

    const commitSearch = async (term: string) => {
        const clean = term.trim();
        if (!clean) return;

        setQuery(clean);
        setCommittedQuery(clean);
        setSearchCommitted(true);
        await addRecentSearch(clean);
    };
    const triggerFilterSearch = () => {
        setSearchCommitted(true);
        setCommittedQuery("");
        Keyboard.dismiss();
    };
    const onChangeQuery = (text: string) => {
        setQuery(text);
        setSearchCommitted(false);
        setCommittedQuery("");
    };

    const suggestions: SuggestionItem[] = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        const categorySuggestions: SuggestionItem[] = SEARCH_CATEGORY_TREE
            .filter((node) => node.category.toLowerCase().includes(q))
            .map((node, index) => ({
                id: `cat-${index}-${node.category}`,
                type: "category",
                label: node.category,
                category: node.category,
            }));

        const productSuggestions: SuggestionItem[] = SEARCH_PRODUCTS.filter((item) => {
            const haystack = `${item.brandName} ${item.title} ${item.category} ${item.group}`.toLowerCase();
            return haystack.includes(q);
        }).map((item) => ({
            id: `prd-${item.id}`,
            type: "product",
            label: item.title,
            product: item,
        }));

        return [...categorySuggestions, ...productSuggestions].slice(0, 10);
    }, [query]);

    const filteredProducts = useMemo(() => {
        if (!searchCommitted) return [];

        let list = [...SEARCH_PRODUCTS];

        const q = committedQuery.trim().toLowerCase();
        if (q) {
            list = list.filter((item) => {
                const haystack = `${item.brandName} ${item.title} ${item.category} ${item.group}`.toLowerCase();
                return haystack.includes(q);
            });
        }

        if (selectedCategory !== "All") {
            list = list.filter((item) => item.category === selectedCategory);
        }

        if (selectedSubCategory !== "All") {
            list = list.filter((item) => item.group === selectedSubCategory);
        }

        if (selectedBrand !== "All") {
            list = list.filter((item) => item.brandName === selectedBrand);
        }

        switch (selectedTag) {
            case "priceHigh":
                return list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
            case "priceLow":
                return list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
            case "discount":
                return list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
            case "popularity":
                return list.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
            case "newest":
                return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
            default:
                return list;
        }
    }, [searchCommitted, committedQuery, selectedCategory, selectedSubCategory, selectedBrand, selectedTag]);

    const renderHighlightedText = (label: string) => {
        const q = query.trim();
        if (!q) return label;

        const lowerLabel = label.toLowerCase();
        const lowerQuery = q.toLowerCase();
        const index = lowerLabel.indexOf(lowerQuery);

        if (index < 0) return label;

        const before = label.slice(0, index);
        const match = label.slice(index, index + q.length);
        const after = label.slice(index + q.length);

        return (
            <Text>
                <Text style={styles.suggestionMatch}>{before}</Text>
                <Text style={styles.suggestionMatch}>{match}</Text>
                <Text style={styles.suggestionRest}>{after}</Text>
            </Text>
        );
    };

    const showSuggestions = query.trim().length > 0 && !searchCommitted;
    const showRecent = query.trim().length === 0 && !searchCommitted;

    return (
        <ScreenLayout variant="inner">
            <View style={styles.body}>
                <View style={styles.searchRow}>
                    <Pressable style={styles.filterButton} onPress={() => setDrawerOpen(true)}>
                        <FilterIcon />
                    </Pressable>

                    <Pressable style={styles.searchBox} onPress={() => setFocused(true)}>
                        <SearchIcon active={focused || query.length > 0} />
                        <TextInput
                            value={query}
                            onChangeText={onChangeQuery}
                            placeholder={t("search")}
                            placeholderTextColor="#72828A"
                            style={styles.searchInput}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            returnKeyType="search"
                            onSubmitEditing={() => commitSearch(query)}
                        />
                    </Pressable>
                </View>
                <FlatList
                    data={searchCommitted ? filteredProducts : []}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={searchCommitted ? styles.columnWrap : undefined}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <>
                            {showSuggestions ? (
                                <View style={styles.suggestionBox}>
                                    {suggestions.length > 0 ? (
                                        suggestions.map((item) => (
                                            <Pressable
                                                key={item.id}
                                                style={styles.suggestionRow}
                                                onPress={() => {
                                                    Keyboard.dismiss();

                                                    if (item.type === "category") {
                                                        setSelectedCategory(item.category);
                                                        setSelectedSubCategory("All");
                                                        setSelectedBrand("All");
                                                        commitSearch(item.label);
                                                        return;
                                                    }

                                                    setSelectedCategory(item.product.category);
                                                    setSelectedSubCategory(item.product.group);
                                                    setSelectedBrand(item.product.brandName);
                                                    commitSearch(item.label);
                                                }}
                                            >
                                                <Text style={styles.suggestionText}>
                                                    {renderHighlightedText(item.label)}
                                                </Text>
                                            </Pressable>
                                        ))
                                    ) : (
                                        <View style={styles.emptyContainer}>
                                            <NoResultsIcon />
                                            <Text style={styles.noItemsText}>{t("noResultsFound")}</Text>
                                        </View>
                                    )}
                                </View>
                            ) : null}

                            {showRecent ? (
                                <View style={styles.recentWrap}>
                                    <Text style={styles.recentTitle}>{t("recentlySearched")}</Text>

                                    {recentSearches.length > 0 ? (
                                        <View style={styles.recentTagsRow}>
                                            {recentSearches.map((item) => (
                                                <View key={item} style={styles.recentChip}>
                                                    <Pressable
                                                        onPress={() => {
                                                            commitSearch(item);
                                                        }}
                                                        style={styles.recentChipPress}
                                                    >
                                                        <Text style={styles.recentChipText}>{item}</Text>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => removeRecentSearch(item)}
                                                        hitSlop={8}
                                                        style={styles.recentCloseWrap}
                                                    >
                                                        <Text style={styles.recentCloseText}>x</Text>
                                                    </Pressable>
                                                </View>
                                            ))}
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}

                            {searchCommitted ? (
                                <View style={styles.tagsRow}>
                                    {TAGS.map((tag) => {
                                        const active = selectedTag === tag.key;
                                        return (
                                            <Pressable
                                                key={tag.key}
                                                onPress={() => setSelectedTag(tag.key)}
                                                style={[styles.tag, active && styles.tagActive]}
                                            >
                                                <Text style={[styles.tagText, active && styles.tagTextActive]}>
                                                    {tag.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            ) : null}
                        </>
                    }
                    renderItem={({ item }) => (
                        <ProductCard
                            item={item}
                            width={194 * base}
                            imageHeight={120}
                            onPress={() =>
                                navigation.navigate("ProductDetail", {
                                    item,
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={
                        searchCommitted ? (
                            <View style={styles.emptyContainer}>
                                <NoResultsIcon />
                                <Text style={styles.noItemsText}>{t("noResultsFound")}</Text>
                            </View>
                        ) : null
                    }
                />
            </View>
            <SearchFilterDrawer
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                selectedBrand={selectedBrand}
                onSelectCategory={(value) => {
                    setSelectedCategory(value);
                    setQuery(value);
                    triggerFilterSearch();
                }}
                onSelectSubCategory={(value) => {
                    setSelectedSubCategory(value);
                    setQuery(value);
                    triggerFilterSearch();
                }}
                onSelectBrand={(value) => {
                    setSelectedBrand(value);
                    setQuery(value);
                    triggerFilterSearch();
                }}
            />

        </ScreenLayout>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20 * base,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 20
    },
    filterButton: {
        width: 51,
        height: 51,
    },
    searchBox: {
        flex: 1,
        height: 51,
        borderRadius: 8,
        backgroundColor: "#F2F2F3",
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#000000",
    },
    suggestionBox: {
        marginTop: 12,
    },
    suggestionRow: {
        paddingVertical: 10,
        paddingHorizontal: 28 * base,
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: "400",
    },
    suggestionMatch: {
        color: "#000",
    },
    suggestionRest: {
        color: "#72828A",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '35%'
    },
    noItemsText: {
        fontSize: 14,
        color: "#72828A",
        marginTop: 19,
    },
    recentWrap: {
    },
    recentTitle: {
        fontSize: 12,
        fontWeight: "500",
        color: "#000000",
    },
    recentTagsRow: {
        marginTop: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    recentChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F3",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2.5,
    },
    recentChipPress: {
        paddingRight: 6,
        paddingVertical: 2,
    },
    recentChipText: {
        fontSize: 12,
        color: "#72828A",
        fontWeight: "400",
    },
    recentCloseWrap: {
        justifyContent: "center",
        alignItems: "center",
    },
    recentCloseText: {
        fontSize: 12,
        color: "#72828A",
        fontWeight: "400",
    },
    tagsRow: {
        marginBottom: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
    },
    tag: {
        backgroundColor: "#F2F2F3",
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        borderRadius: 12,
    },
    tagActive: {
        backgroundColor: "#07C187",
    },
    tagText: {
        fontSize: 12,
        fontWeight: "400",
        color: "#72828A",
    },
    tagTextActive: {
        color: "#FFFFFF",
        fontSize: 12,
    },
    listContent: {
        paddingBottom: '15%',
    },
    columnWrap: {
        justifyContent: "space-between",

    },
});
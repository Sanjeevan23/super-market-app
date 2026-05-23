import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { SEARCH_PRODUCTS, SearchProduct } from "../../data/searchData";
import { MinusIcon, PlusIcon } from "../../assets/Icons";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/layout/Button";
import { addToCart, getCartItems } from "../../utils/cartStorage";
import { FloatingButton } from "../../components/layout/FloatingButton";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const parsePrice = (value?: string) => {
    if (!value) return 0;
    const numeric = value.replace(/[^0-9.]/g, "");
    return Number(numeric || 0);
};

const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
};

const Product_DetailScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const item: SearchProduct | undefined = route.params?.item;
    const { t } = useLang();
    const [qty, setQty] = useState(1);

    const [cartCount, setCartCount] = useState(0);
    const [showFloating, setShowFloating] = useState(false);
    useEffect(() => {
        const loadCartCount = async () => {
            const items = await getCartItems();
            setCartCount(items.length);
        };

        loadCartCount();
    }, []);

    const relatedProducts = useMemo(() => {
        if (!item) return [];
        return SEARCH_PRODUCTS.filter(
            (p) =>
                p.id !== item.id &&
                p.category === item.category &&
                p.group === item.group
        ).slice(0, 8);
    }, [item]);

    if (!item) {
        return (
            <ScreenLayout variant="inner" title={t("productDetail")}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>{t("productNotFound")}</Text>
                </View>
            </ScreenLayout>
        );
    }

    const unitPrice = parsePrice(item.price);
    const totalPrice = unitPrice * qty;
const handleAddToCart = async () => {
    if (!item) return;

    const items = await addToCart(item, qty);
    setCartCount(items.length);
    setShowFloating(true);
};

    return (
        <ScreenLayout variant="inner" title={item.category}>
            <View style={styles.container}>
                {showFloating && cartCount > 0 ? (
                    <FloatingButton
                        count={cartCount}
                        onPress={() =>
                            navigation.navigate("Footer", {
                                tab: "cart",
                            })
                        }
                    />
                ) : null}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.body}>
                        <View style={styles.imageWrap}>
                            <Image
                                source={item.image}
                                style={styles.image}
                                resizeMode="cover"
                            />

                            {item.offerTag ? (
                                <View style={styles.offerTag}>
                                    <Text style={styles.offerTagText}>{item.offerTag}</Text>
                                </View>
                            ) : null}
                        </View>

                        <Text style={styles.brandName}>{item.brandName}</Text>
                        <Text style={styles.productName}>{item.title}</Text>
                        <Text style={styles.measurement}>{item.measurement}</Text>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceText}>{item.price}</Text>
                            {item.originalPrice ? (
                                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                            ) : null}
                        </View>

                        <Text style={styles.aboutTitle}>{t("aboutThisProduct")}</Text>
                        <Text style={styles.aboutText}>
                            {item.about ??
                                `${item.title} is a quality product in the ${item.category} category under ${item.group}.`}
                        </Text>

                        <View style={styles.separator} />

                        <Text style={styles.relatedTitle}>{t("relatedProducts")}</Text>

                        <View style={styles.relatedGrid}>
                            {relatedProducts.map((related) => (
                                <ProductCard
                                    key={related.id}
                                    item={related}
                                    width={194 * base}
                                    imageHeight={120}
                                    onPress={() =>
                                        navigation.navigate("ProductDetail" as never, {
                                            item: related,
                                        } as never)
                                    }
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.qtyRow}>
                        <Pressable
                            onPress={() => setQty((prev) => Math.max(1, prev - 1))}
                        >
                            <MinusIcon />
                        </Pressable>

                        <Text style={styles.qtyText}>{qty}</Text>

                        <Pressable
                            onPress={() => setQty((prev) => prev + 1)}
                        >
                            <PlusIcon />
                        </Pressable>

                        <Text style={styles.footerPrice}>{formatPrice(totalPrice)}</Text>
                    </View>
                    <Button text={t("addToCart")}
                        onPress={handleAddToCart}
                    />
                </View>
            </View>

        </ScreenLayout>
    );
};

export default Product_DetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: "relative",
    },
    scrollContent: {
        flexGrow: 1,
    },
    body: {
        paddingHorizontal: 20 * base,
        paddingBottom: 24,
    },
    imageWrap: {
        width: "100%",
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#F2F2F3",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    offerTag: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#FF000A",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 10,
    },
    offerTagText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "400",
    },
    brandName: {
        marginTop: 10,
        color: "#72828A",
        fontSize: 12,
        fontWeight: "500",
        textTransform: "uppercase",
    },
    productName: {
        marginTop: 4,
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
    },
    measurement: {
        marginTop: 4,
        color: "#72828A",
        fontSize: 12,
        fontWeight: "400",
    },
    priceRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    priceText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
    },
    originalPrice: {
        marginLeft: 4,
        color: "#72828A",
        fontSize: 10,
        fontWeight: "400",
        textDecorationLine: "line-through",
    },
    aboutTitle: {
        marginTop: 20,
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
    },
    aboutText: {
        marginTop: 8,
        color: "#72828A",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 18,
    },
    separator: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    relatedTitle: {
        marginTop: 20,
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
    },
    relatedGrid: {
        marginTop: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20 * base,
        paddingTop: 10,
        paddingBottom: 30,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    qtyText: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: "500",
        color: "#000000",
    },
    footerPrice: {
        marginLeft: "auto",
        fontSize: 24,
        fontWeight: "600",
        color: "#000000",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#72828A",
        fontSize: 14,
    },
});
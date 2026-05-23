import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Animated,
    ScrollView,
} from "react-native";
import { BackIcon, ChevronIcon } from "../../../assets/Icons";
import { SEARCH_CATEGORY_TREE, SEARCH_BRANDS } from "../../../data/searchData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLang } from "../../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const drawerWidth = deviceWidth * 0.5;
const base = deviceWidth / 440;

type Props = {
    visible: boolean;
    onClose: () => void;
    selectedCategory: string;
    selectedSubCategory: string;
    selectedBrand: string;
    onSelectCategory: (value: string) => void;
    onSelectSubCategory: (value: string) => void;
    onSelectBrand: (value: string) => void;
};

export const SearchFilterDrawer: React.FC<Props> = ({
    visible,
    onClose,
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    onSelectCategory,
    onSelectSubCategory,
    onSelectBrand,
}) => {
    const { t } = useLang();
    const translateX = useRef(new Animated.Value(-drawerWidth)).current;
    const [openCategory, setOpenCategory] = useState<string | null>(selectedCategory || null);

    useEffect(() => {
        if (visible) {
            setOpenCategory(selectedCategory || null);
            Animated.timing(translateX, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start();
        } else {
            translateX.setValue(-drawerWidth);
        }
    }, [visible, selectedCategory, translateX]);

    const categories = useMemo(() => SEARCH_CATEGORY_TREE, []);
    const insets = useSafeAreaInsets();

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={[styles.overlay,]}>
                <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

                <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX }] }]}>
                    <Pressable onPress={onClose} style={[{ paddingTop: insets.top, paddingLeft: 20 * base }]}>
                        <BackIcon dark />
                    </Pressable>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>{t("shopByCategory")}</Text>

                        <View style={styles.section}>
                            {categories.map((node) => {
                                const isOpen = openCategory === node.category;

                                const isActive = selectedCategory === node.category;

                                const hasSubSelected =
                                    selectedCategory === node.category &&
                                    selectedSubCategory !== "All";

                                return (
                                    <View key={node.category}>
                                        <Pressable
                                            style={[
                                                styles.row,
                                                isActive && !hasSubSelected && styles.rowActive,
                                                hasSubSelected && styles.rowSelected,
                                            ]}
                                            onPress={() => {
                                                onSelectCategory(node.category);
                                                onSelectSubCategory("All");

                                                setOpenCategory((prev) =>
                                                    prev === node.category ? null : node.category
                                                );
                                            }}
                                        >
                                            <Text style={[styles.rowText, isActive && styles.rowTextActive]}>
                                                {node.category}
                                            </Text>

                                            <Text style={[{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] },]} >
                                                <ChevronIcon />
                                            </Text>
                                        </Pressable>

                                        {isOpen
                                            ? node.groups.map((group) => {
                                                const subActive =
                                                    selectedCategory === node.category && selectedSubCategory === group;

                                                return (
                                                    <Pressable
                                                        key={group}
                                                        style={[styles.subRow, subActive && styles.subRowActive]}
                                                        onPress={() => {
                                                            onSelectCategory(node.category);
                                                            onSelectSubCategory(group);
                                                            onClose();
                                                        }}
                                                    >
                                                        <Text style={[styles.subRowText, subActive && styles.subRowTextActive]}>
                                                            {group}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })
                                            : null}
                                    </View>
                                );
                            })}
                        </View>

                        <Text style={styles.brandTitle}>{t("shopByBrand")}</Text>

                        <View style={styles.brandSection}>
                            {SEARCH_BRANDS.map((item) => {
                                const active = selectedBrand === item;

                                return (
                                    <Pressable
                                        key={item}
                                        style={[styles.brandRow, active && styles.brandRowActive]}
                                        onPress={() => {
                                            onSelectBrand(item);
                                            onClose();
                                        }}
                                    >
                                        <Text style={[styles.brandText, active && styles.brandTextActive]}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#0000004D",
        flexDirection: "row",
    },
    drawer: {
        height: "100%",
        backgroundColor: "#FFFFFF",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 20
    },
    title: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
        paddingHorizontal: 20 * base,
    },
    section: {
        marginTop: 12,
    },
    row: {
        justifyContent: "space-between",
        paddingVertical: 9,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20 * base,
    },
    rowActive: {
        backgroundColor: "#C2FFE0",
    },
    rowSelected: {
        backgroundColor: "transparent",
    },
    rowText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
    },
    rowTextActive: {
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    subRow: {
        paddingVertical: 10,
        paddingLeft: 40 * base,
    },
    subRowActive: {
        backgroundColor: "#C1FFE0",
    },
    subRowText: {
        fontSize: 13,
        fontWeight: "400",
        color: "#72828A",
    },
    subRowTextActive: {
        color: "#000000",
        fontWeight: "500",
    },
    brandTitle: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: "600",
        color: "#000000",
        paddingHorizontal: 20 * base,
    },
    brandSection: {
        marginTop: 12,
       
    },
    brandRow: {
        paddingVertical: 14,
    },
    brandRowActive: {
        backgroundColor: "#BFF9D9",
    },
    brandText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
        paddingHorizontal:20 * base,
    },
    brandTextActive: {
        fontWeight: "600",
    },
});
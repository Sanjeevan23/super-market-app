import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    Animated,
    Easing,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SavedAddress, formatAddressShort } from "../../utils/addressStorage";
import { RadioActiveIcon, RadioInactiveIcon, MapPinIcon } from "../../assets/Icons";
import { Button } from "./Button";
import { base, Colors } from "../../theme/colors";
import { useLang } from "../../context/LangContext";

type Props = {
    visible: boolean;
    addresses: SavedAddress[];
    selectable?: boolean;
    initialSelectedId?: string;
    onClose: () => void;
    onSelect?: (address: SavedAddress) => void;
};

const AddressPickerModal: React.FC<Props> = ({
    visible,
    addresses,
    selectable = true,
    initialSelectedId,
    onClose,
    onSelect,
}) => {
    const navigation = useNavigation<any>();
    const { t } = useLang();
    const modalSlide = useRef(new Animated.Value(600)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const [selectedId, setSelectedId] = useState<string>(initialSelectedId ?? addresses[0]?.id ?? "");

    useEffect(() => {
        if (visible) {
            setSelectedId(initialSelectedId ?? addresses[0]?.id ?? "");
            Animated.parallel([
                Animated.timing(modalSlide, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const close = () => {
        Animated.parallel([
            Animated.timing(modalSlide, { toValue: 600, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    const handleSave = () => {
        const addr = addresses.find((a) => a.id === selectedId);
        if (addr && onSelect) onSelect(addr);
        close();
    };

    const handleAddNew = () => {
        close();
        setTimeout(() => navigation.navigate("Manual_LocationScreen"), 300);
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} pointerEvents="box-none">
                    <Pressable style={styles.flex} onPress={close} />
                </Animated.View>

                <Animated.View style={[styles.sheet, { transform: [{ translateY: modalSlide }] }]}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>{t("address")}</Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                        {addresses.map((addr) => {
                            const active = selectedId === addr.id;
                            return (
                                <Pressable
                                    key={addr.id}
                                    style={[
                                        styles.row,
                                        selectable && styles.rowBordered,
                                        selectable && active && styles.rowActive,
                                    ]}
                                    onPress={() => selectable && setSelectedId(addr.id)}
                                >
                                    {selectable && (
                                        active
                                            ? <RadioActiveIcon width={21 * base} height={21 * base} />
                                            : <RadioInactiveIcon width={21 * base} height={21 * base} />
                                    )}
                                    <View style={styles.rowText}>
                                        <Text style={styles.labelText}>{addr.labelDisplay}</Text>
                                        <View style={styles.addrRow}>
                                            <MapPinIcon width={17 * base} height={17 * base} color="#000" />
                                            <Text style={styles.addrText} numberOfLines={1}>
                                                {formatAddressShort(addr)}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}

                        {addresses.length === 0 && (
                            <Text style={styles.emptyText}>{t("noSavedAddresses")}</Text>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        {selectable ? (
                            <>
                                <Button
                                    text={t("addNewAddress")}
                                    onPress={handleAddNew}
                                    backgroundColor="transparent"
                                    containerStyle={styles.outlineBtn}
                                    textStyle={styles.outlineBtnText}
                                />
                                {addresses.length > 0 && (
                                    <Button text={t("save")} onPress={handleSave} />
                                )}
                            </>
                        ) : (
                            <Button text={t("addNewAddress")} onPress={handleAddNew} />
                        )}
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddressPickerModal;

const styles = StyleSheet.create({
    flex: { flex: 1, justifyContent: "flex-end" },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.15)",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20 * base,
        paddingTop: 20 * base,
        paddingBottom: 30 * base,
        maxHeight: "75%",
    },
    handle: {
        width: 40 * base,
        height: 6,
        backgroundColor: "#F2F2F3",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 20 * base,
    },
    title: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000",
        textAlign: "center",
        marginBottom: 16,
    },
    list: { flexGrow: 0 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10 * base,
        paddingVertical: 10,
        marginBottom: 10,
    },
    rowBordered: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12 * base,
    },
    rowActive: { borderColor: Colors.primary },
    addrRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    rowText: { flex: 1 },
    labelText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.primary,
    },
    addrText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
    },
    emptyText: {
        fontSize: 13,
        color: "#72828A",
        textAlign: "center",
        marginVertical: 16,
    },
    footer: {marginTop: 18 * base, gap: 20 * base  },
    outlineBtn: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    outlineBtnText: { color: Colors.primary },
});

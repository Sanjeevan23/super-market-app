import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import {
    ApplePayIcon,
    GPayIcon,
    RadioActiveIcon,
    RadioInactiveIcon,
} from "../../assets/Icons";
import { clearCart, getCartItems } from "../../utils/cartStorage";
import { saveOrderRecord } from "../../utils/orderStorage";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

type Method = "gpay" | "applepay";

import { useRoute } from "@react-navigation/native";

const PaymentDetailScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useLang();
    const [selected, setSelected] = useState<Method>("gpay");

    const subtotal = route.params?.subtotal ?? 0;

    const handlePay = async () => {
        const cartItems = await getCartItems();

        const now = new Date();
        const orderDate = now.toLocaleDateString("en-GB"); // 16/05/2026 style
        const orderTime = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        await saveOrderRecord({
            orderId: `ORD-${now.getTime()}`,
            orderDate,
            orderTime,
            paymentMethod: selected,
            subtotal,
            items: cartItems,
        });

        await clearCart();
        navigation.replace("InvoiceScreen");
    };
    return (
        <ScreenLayout variant="inner" title={t("paymentMethod")}>
            <View style={styles.body}>
                <View style={styles.paysheet}>
                    <Text style={styles.Quickpayheading}>{t("quickPayment")}</Text>

                    <Pressable
                        style={[
                            styles.paymentmethod,
                            selected === "gpay" && styles.paymentmethodActive,
                        ]}
                        onPress={() => setSelected("gpay")}
                    >
                        {selected === "gpay" ? <RadioActiveIcon /> : <RadioInactiveIcon />}
                        <GPayIcon />
                        <Text style={styles.methodText}>{t("googlePay")}</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.paymentmethod,
                            selected === "applepay" && styles.paymentmethodActive,
                        ]}
                        onPress={() => setSelected("applepay")}
                    >
                        {selected === "applepay" ? <RadioActiveIcon /> : <RadioInactiveIcon />}
                        <ApplePayIcon />
                        <Text style={styles.methodText}>{t("applePay")}</Text>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <View style={styles.subtotalRow}>
                        <Text style={styles.subtotalLabel}>{t("subtotal")}</Text>
                        <Text style={styles.subtotalPrice}>${subtotal.toFixed(2)}</Text>
                    </View>

                    <Button text={t("pay")} containerStyle={{ marginTop: 20 }} onPress={handlePay} />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default PaymentDetailScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    paysheet: {
        paddingHorizontal: 20 * base,
        paddingTop: 8,
    },
    Quickpayheading: {
        fontWeight: "500",
        fontSize: 14,
        color: "#000000",
    },
    paymentmethod: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 8,
        marginTop: 10,
        paddingVertical: 15,
        gap: 8,
        paddingHorizontal: 12,
        backgroundColor: "#FFFFFF",
    },
    paymentmethodActive: {
        borderColor: "#07C187",
    },
    methodText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
    },
    footer: {
        marginTop: "auto",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingHorizontal: 20 * base,
        paddingTop: 15,
        paddingBottom: 30,
    },
    subtotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    subtotalLabel: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000000",
    },
    subtotalPrice: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000000",
    },
});
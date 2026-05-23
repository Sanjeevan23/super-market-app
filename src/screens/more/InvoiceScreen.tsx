import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Alert,
} from "react-native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { LocationPointIcon, CalendarIcon, TimeIcon, UserIcon, DeliveryIcon } from "../../assets/Icons";
import { getLatestInvoice, getOrderById } from "../../utils/orderStorage";
import { CartItem } from "../../utils/cartStorage";
import { Button } from "../../components/layout/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const parsePrice = (value?: string) => {
    if (!value) return 0;
    const numeric = value.replace(/[^0-9.]/g, "");
    return Number(numeric || 0);
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

const InvoiceScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const scrollContentRef = useRef<View>(null);

    const [order, setOrder] = useState<{
        orderId: string;
        orderDate: string;
        orderTime: string;
        subtotal: number;
        items: CartItem[];
    } | null>(null);

    const { t } = useLang();
    const [isDownloading, setIsDownloading] = useState(false);

useEffect(() => {
    const load = async () => {
        const orderId = route.params?.orderId;
        const data = orderId ? await getOrderById(orderId) : await getLatestInvoice();
        setOrder(data);
    };
    load();
}, [route.params?.orderId]);

    const handleDownload = async () => {
        if (!order) return;
        setIsDownloading(true);

        try {
            const itemsHtml = order.items
                .map((item) => {
                    const total = parsePrice(item.price) * item.qty;
                    return `
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #E5E7EB;">
                            <b>${item.brandName ?? ""}</b><br/>
                            ${item.title}<br/>
                            <span style="color:#72828A; font-size:12px;">${item.measurement ?? ""}</span>
                        </td>
                        <td style="padding:10px; border-bottom:1px solid #E5E7EB; text-align:center;">${item.qty}</td>
                        <td style="padding:10px; border-bottom:1px solid #E5E7EB; text-align:right;">${item.price}</td>
                        <td style="padding:10px; border-bottom:1px solid #E5E7EB; text-align:right;">${formatPrice(total)}</td>
                    </tr>
                `;
                })
                .join("");

            const html = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <style>
                    body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
                    h2 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
                    .divider { border: none; border-top: 1px solid #E5E7EB; margin: 14px 0; }
                    .section-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
                    .info-grid { display: flex; gap: 40px; margin-bottom: 12px; }
                    .info-item label { font-size: 12px; color: #72828A; display: block; }
                    .info-item span { font-size: 14px; color: #000; }
                    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                    th { text-align: left; padding: 8px 10px; background: #F9FAFB;
                         font-size: 13px; border-bottom: 2px solid #E5E7EB; }
                    td { font-size: 13px; vertical-align: top; }
                    .total-row { display: flex; justify-content: space-between;
                                 margin-top: 20px; font-size: 18px; font-weight: 700; }
                    .location { font-size: 14px; margin-top: 6px; }
                </style>
            </head>
            <body>
                <h2>${t("orderDetails")}</h2>
                <p style="color:#72828A; font-size:13px;">Order ID: #${order.orderId}</p>

                <hr class="divider"/>

                <div class="section-title">${t("orderInformation")}</div>
                <div class="info-grid">
                    <div class="info-item">
                        <label>${t("orderDate")}</label>
                        <span>${order.orderDate}</span>
                    </div>
                    <div class="info-item">
                        <label>${t("orderTime")}</label>
                        <span>${order.orderTime}</span>
                    </div>
                    <div class="info-item">
                        <label>${t("customer")}</label>
                        <span>${t("customer")}</span>
                    </div>
                    <div class="info-item">
                        <label>${t("delivery")}</label>
                        <span>${t("delivery")}</span>
                    </div>
                </div>

                <hr class="divider"/>

                <div class="section-title">${t("deliveryLocation")}</div>
                <div class="location">📍 123 Main St, New York</div>

                <hr class="divider"/>

                <div class="section-title">${t("orderItems")}</div>
                <table>
                    <thead>
                        <tr>
                            <th>${t("item")}</th>
                            <th style="text-align:center;">${t("qty")}</th>
                            <th style="text-align:right;">${t("price")}</th>
                            <th style="text-align:right;">${t("total")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <hr class="divider"/>

                <div class="total-row">
                    <span>${t("subtotal")}:</span>
                    <span>${formatPrice(order.subtotal)}</span>
                </div>
            </body>
            </html>
        `;

            // Generate PDF
            const { uri } = await Print.printToFileAsync({ html, base64: false });

            // Share / Save to Files
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: "application/pdf",
                    dialogTitle: t("saveInvoicePdf"),
                    UTI: "com.adobe.pdf",
                });
                // Navigate back after sharing dialog closes
                navigation.goBack();
            } else {
                Alert.alert(t("savedAlert"), `Invoice PDF saved at:\n${uri}`, [
                    { text: "OK", onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error) {
            console.error("PDF error:", error);
            Alert.alert(t("errorAlert"), t("couldNotGenerateInvoice"));
        } finally {
            setIsDownloading(false);
        }
    };
    if (!order) {
        return (
            <ScreenLayout variant="inner" title={t("invoice")}>
                <View style={styles.body}>
                    <Text style={styles.emptyText}>{t("noInvoiceFound")}</Text>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout variant="inner" title="Invoice">
            <View style={styles.body}>
                {/* ScrollView wraps for UX, ref is on inner View for full capture */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View ref={scrollContentRef} collapsable={false}>
                        <View style={styles.section}>
                            <Text style={styles.heading}>{t("orderDetails")}</Text>

                            <Image
                                source={require("../../assets/image/QRimage.png")}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />

                            <View style={styles.line} />

                            <Text style={styles.subHeading}>{t("orderInformation")}</Text>

                            <View style={styles.infoRow}>
                                <View style={styles.infoCol}>
                                    <Text style={styles.label}>{t("orderDate")}</Text>
                                    <View style={styles.iconTextRow}>
                                        <CalendarIcon />
                                        <Text style={styles.infoText}>{order.orderDate}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoColRight}>
                                    <View>
                                        <Text style={styles.label}>{t("orderTime")}</Text>
                                        <View style={styles.iconTextRow}>
                                            <TimeIcon />
                                            <Text style={styles.infoText}>{order.orderTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoCol}>
                                    <Text style={styles.label}>{t("customerName")}</Text>
                                    <View style={styles.iconTextRow}>
                                        <UserIcon />
                                        <Text style={styles.label}>{t("customer")}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoColRight}>
                                    <View>
                                        <Text style={styles.label}>{t("delivery")}</Text>
                                        <View style={styles.iconTextRow}>
                                            <DeliveryIcon />
                                            <Text style={styles.label}>{t("delivery")}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.line} />

                            <Text style={styles.subHeading}>{t("deliveryLocation")}</Text>
                            <View style={styles.iconTextRow}>
                                <LocationPointIcon />
                                <Text style={styles.infoTextDark}>123 Main St, New York</Text>
                            </View>

                            <View style={styles.line} />

                            <Text style={styles.subHeading}>{t("orderItems")}</Text>

                            {order.items.map((item) => {
                                const total = parsePrice(item.price) * item.qty;

                                return (
                                    <View key={item.id} style={styles.listBox}>
                                        <View style={styles.listRow}>
                                            <View style={styles.imageWrap}>
                                                <Image
                                                    source={item.image}
                                                    style={styles.productImage}
                                                    resizeMode="cover"
                                                />
                                                {item.offerTag ? (
                                                    <View style={styles.offerTag}>
                                                        <Text style={styles.offerTagText}>{item.offerTag}</Text>
                                                    </View>
                                                ) : null}
                                            </View>

                                            <View style={styles.infoWrap}>
                                                <View style={styles.topRow}>
                                                    <View style={{ flex: 1, paddingRight: 0 }}>
                                                        <Text style={styles.brandName} numberOfLines={1}>
                                                            {item.brandName}
                                                        </Text>
                                                        <Text style={styles.productName} numberOfLines={2}>
                                                            {item.title}
                                                        </Text>
                                                        <Text style={styles.measurement}>{item.measurement}</Text>

                                                        <View style={styles.priceRowProduct}>
                                                            <Text style={styles.priceText}>{item.price}</Text>
                                                            {item.originalPrice ? (
                                                                <Text style={styles.originalPrice}>
                                                                    {item.originalPrice}
                                                                </Text>
                                                            ) : null}
                                                        </View>

                                                        <View
                                                            style={{
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                                marginTop: 19,
                                                            }}
                                                        >
                                                            <Text style={styles.qtyOnly}>{t("qty")}: {item.qty}</Text>
                                                            <Text style={styles.itemTotal}>{formatPrice(total)}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}

                            <View style={styles.footerTotalRow}>
                                <Text style={styles.footerTotalLabel}>{t("subtotal")}:</Text>
                                <Text style={styles.footerTotalPrice}>{formatPrice(order.subtotal)}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        text={isDownloading ? t("saving") : t("downloadInvoice")}
                        onPress={handleDownload}
                        disabled={isDownloading}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    section: {
        paddingHorizontal: 20 * base,
        paddingTop: 8,
        paddingBottom: 24,
    },
    heading: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
    },
    qrImage: {
        width: 150,
        height: 150,
        alignSelf: "center",
        marginTop: 20,
    },
    line: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        marginVertical: 10,
    },
    subHeading: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
    },
    infoRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoCol: {
        flex: 1,
        paddingRight: 10,
    },
    infoColRight: {
        flex: 1,
        paddingLeft: 0,
        alignItems: 'flex-end'
    },
    label: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
    },
    iconTextRow: {
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#72828A",
    },
    infoTextDark: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000000",
    },
    listBox: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
    },
    listRow: {
        flexDirection: "row",
    },
    imageWrap: {
        position: "relative",
    },
    productImage: {
        width: 126 * base,
        height: 108,
        borderRadius: 8,
        backgroundColor: "#F2F2F3",
    },
    offerTag: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: "#FF000A",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    offerTagText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "400",
    },
    infoWrap: {
        flex: 1,
        paddingLeft: 6 * base,
    },
    topRow: {
        position: "relative",
    },
    brandName: {
        fontSize: 8,
        fontWeight: "500",
        color: "#72828A",
        textTransform: "uppercase",
    },
    productName: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "500",
        color: "#000000",
    },
    measurement: {
        marginTop: 2,
        fontSize: 8,
        fontWeight: "400",
        color: "#72828A",
    },
    priceRowProduct: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    priceText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#000000",
    },
    originalPrice: {
        marginLeft: 6,
        fontSize: 8,
        fontWeight: "400",
        color: "#72828A",
        textDecorationLine: "line-through",
    },
    qtyOnly: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: "400",
        color: "#000000",
    },
    itemTotal: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
    },
    footerTotalRow: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerTotalLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
    },
    footerTotalPrice: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingHorizontal: 20 * base,
        paddingTop: 15,
        paddingBottom: 30,
    },
    emptyText: {
        color: "#72828A",
        fontSize: 14,
        textAlign: "center",
        marginTop: 24,
    },
});
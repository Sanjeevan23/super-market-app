import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { LocationIcon, MyCartIcon } from "../../assets/Icons";
import { DeleteIcon, MinusIcon, PlusIcon } from "../../assets/Icons";
import {
  getCartItems,
  removeCartItem,
  updateCartQty,
  CartItem,
} from "../../utils/cartStorage";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/layout/Button";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const parsePrice = (value?: string) => {
  if (!value) return 0;
  const numeric = value.replace(/[^0-9.]/g, "");
  return Number(numeric || 0);
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

const MyCartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLang();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getCartItems();
      setItems(data);
    };
    load();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  }, [items]);

  const handleRemove = async (id: string) => {
    const next = await removeCartItem(id);
    setItems(next);
  };

  const changeQty = async (id: string, nextQty: number) => {
    if (nextQty < 1) return;
    const next = await updateCartQty(id, nextQty);
    setItems(next);
  };

  return (
    <ScreenLayout variant="inner" title={t("myCart")}>
      <View style={styles.body}>
        <View style={styles.addressBox}>
          <View style={styles.addressLeft}>
            <LocationIcon strokeColor="#07C187" backgroundColor="#07c1869a" />
            <View style={styles.addressTextWrap}>
              <Text style={styles.deliverTo}>{t("deliveredTo")}</Text>
              <Text style={styles.addressText}>123 Main St, New York</Text>
            </View>
          </View>

          <Pressable>
            <Text style={styles.changeText}>{t("change")}</Text>
          </Pressable>
        </View>

        <Text style={styles.orderTitle}>{t("orderList")}</Text>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MyCartIcon width={200 * base} height={200 * base} strokeColor="#DDDDDD"/>
            <Text style={styles.noItemsText}>{t("noCartItems")}</Text>
            <Text style={styles.noItemsSubText}>{t("addYourItems")}</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => {
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
                        <Pressable
                          onPress={() => handleRemove(item.id)}
                          style={styles.deleteButton}
                        >
                          <DeleteIcon />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.brandName} numberOfLines={1}>
                            {item.brandName}
                          </Text>
                          <Text style={styles.productName} numberOfLines={2}>
                            {item.title}
                          </Text>
                          <Text style={styles.measurement}>{item.measurement}</Text>

                          <View style={styles.priceRow}>
                            <Text style={styles.priceText}>{item.price}</Text>
                            {item.originalPrice ? (
                              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                            ) : null}
                          </View>

                          <View style={styles.qtyRow}>
                            <Pressable onPress={() => changeQty(item.id, item.qty - 1)}>
                              <MinusIcon />
                            </Pressable>

                            <Text style={styles.qtyText}>{item.qty}</Text>

                            <Pressable onPress={() => changeQty(item.id, item.qty + 1)}>
                              <PlusIcon />
                            </Pressable>

                            <Text style={styles.itemTotal}>{formatPrice(total)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
        <View style={styles.footer}>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>{t("subtotal")}</Text>
            <Text style={styles.subtotalPrice}>{formatPrice(subtotal)}</Text>
          </View>
          <Button
            containerStyle={{ marginTop: 20 }}
            text={t("proceedOrder")}
            disabled={items.length === 0}
            onPress={() =>
              navigation.navigate("PaymentDetail", {
                subtotal,
              })
            }
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default MyCartScreen;
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  addressBox: {
    borderWidth: 1,
    borderColor: "#07C187",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20 * base,
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  addressTextWrap: {},
  deliverTo: {
    fontSize: 9,
    fontWeight: "500",
    color: "#000000",
  },
  addressText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    marginTop: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#07C187",
  },
  orderTitle: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 20 * base,
    color: "#000000",
  },
  listBox: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
    paddingHorizontal: 20 * base,

  },
  listRow: {
    flexDirection: "row",
  },
  productImage: {
    width: 126 * base,
    height: 108,
    borderRadius: 8,
    backgroundColor: "#F2F2F3",
  },
  infoWrap: {
    flex: 1,
    paddingLeft: 6 * base,
  },
  topRow: {
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    padding:7
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
  priceRow: {
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
  qtyRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  itemTotal: {
    marginLeft: "auto",
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 20 * base,
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
  imageWrap: {
    position: "relative",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 14,
    color: "#72828A",
    marginTop: 19,
  },
   noItemsSubText: {
    fontSize: 12,
    color: "#72828A",
    marginTop:2,
  },
});
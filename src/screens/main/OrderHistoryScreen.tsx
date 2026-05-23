// import React, { useState } from "react";
// import { View, StyleSheet, Text, Dimensions } from "react-native";
// import { ScreenLayout } from "../../components/layout/ScreenLayout";
// import { Button } from "../../components/layout/Button";
// import { CalendarIcon, LocationPointIcon, NoResultsIcon, TimeIcon } from "../../assets/Icons";

// const { width: deviceWidth } = Dimensions.get("window");
// const base = deviceWidth / 440;

// const OrderHistoryScreen: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"inprogress" | "completed">(
//     "inprogress"
//   );

//   return (
//     <ScreenLayout variant="inner" title={t("orderHistory")}>
//       <View style={styles.body}>
//         <View style={styles.Buttonwrapper}>
//           <View style={styles.btnHalf}>
//             <Button
//               text="In-Progress"
//               onPress={() => setActiveTab("inprogress")}
//               backgroundColor={
//                 activeTab === "inprogress" ? "#07C187" : "#F2F2F3"
//               }
//               textStyle={{
//                 color: activeTab === "inprogress" ? "#FFFFFF" : "#72828A",
//               }}
//             />
//           </View>

//           <View style={styles.btnHalf}>
//             <Button
//               text="Completed order"
//               onPress={() => setActiveTab("completed")}
//               backgroundColor={
//                 activeTab === "completed" ? "#07C187" : "#F2F2F3"
//               }
//               textStyle={{
//                 color: activeTab === "completed" ? "#FFFFFF" : "#72828A",
//               }}
//             />
//           </View>
//         </View>

//         <View style={styles.content}>
//           {activeTab === "inprogress" ? (
//             // OrderBox
//             <View style={styles.orderbox}>
//               <View style={styles.idStatusRow}>
//                 <Text style={styles.orderId}>ORD-1234</Text>
//                 <Text style={styles.statusInprogress}>In-progress</Text>
//               </View>
//               <View style={styles.line} />

//               <View style={styles.infoRow}>
//                 <View style={styles.infoCol}>
//                   <Text style={styles.label}>Order date</Text>
//                   <View style={styles.iconTextRow}>
//                     <CalendarIcon />
//                     <Text style={styles.infoText}>2024-01-12</Text>
//                   </View>
//                 </View>

//                 <View style={styles.infoColRight}>
//                   <View>
//                     <Text style={styles.label}>Order time</Text>
//                     <View style={styles.iconTextRow}>
//                       <TimeIcon />
//                       <Text style={styles.infoText}>04:23:09PM</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               <Text style={[styles.label, { marginTop: 10, }]}>Delivery Location</Text>
//               <View style={styles.iconTextRow}>
//                 <LocationPointIcon color="#72828A" />
//                 <Text style={styles.infoText}>123 Main St, New York</Text>
//               </View>

//               <Text style={[styles.label, { marginTop: 10, }]}>Items count</Text>
//               <View style={[styles.greenTag, { marginTop: 4 }]}>
//                 <NoResultsIcon stroke="#07C187" width={18 * base} height={18 * base} />
//                 <Text style={styles.greenText}>2 {t("itemsUnit")}</Text>
//               </View>
//               <View style={styles.line} />

//               <View style={styles.subtotalRow}>
//                 <Text style={styles.SubtotalLabel}>Subtotal:</Text>
//                 <Text style={styles.subtotalPrice}>$ 25.00</Text>
//               </View>

//             </View>

//           ) : (

//             <View style={styles.orderbox}>
//               <View style={styles.idStatusRow}>
//                 <Text style={styles.orderId}>ORD-1234</Text>
//                 <Text style={styles.statusCompleted}>In-progress</Text>
//               </View>
//               <View style={styles.line} />

//               <View style={styles.infoRow}>
//                 <View style={styles.infoCol}>
//                   <Text style={styles.label}>Order date</Text>
//                   <View style={styles.iconTextRow}>
//                     <CalendarIcon />
//                     <Text style={styles.infoText}>2024-01-12</Text>
//                   </View>
//                 </View>

//                 <View style={styles.infoColRight}>
//                   <View>
//                     <Text style={styles.label}>Order time</Text>
//                     <View style={styles.iconTextRow}>
//                       <TimeIcon />
//                       <Text style={styles.infoText}>04:23:09PM</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>

//               <Text style={[styles.label, { marginTop: 10, }]}>Delivery Location</Text>
//               <View style={styles.iconTextRow}>
//                 <LocationPointIcon color="#72828A" />
//                 <Text style={styles.infoText}>123 Main St, New York</Text>
//               </View>

//               <Text style={[styles.label, { marginTop: 10, }]}>Items count</Text>
//               <View style={[styles.greenTag, { marginTop: 4 }]}>
//                 <NoResultsIcon stroke="#07C187" width={18 * base} height={18 * base} />
//                 <Text style={styles.greenText}>2 {t("itemsUnit")}</Text>
//               </View>
//               <View style={styles.line} />

//               <View style={styles.subtotalRow}>
//                 <Text style={styles.SubtotalLabel}>Subtotal:</Text>
//                 <Text style={styles.subtotalPrice}>$ 25.00</Text>
//               </View>
//             </View>


//           )}
//         </View>
//       </View>
//     </ScreenLayout>
//   );
// };

// export default OrderHistoryScreen;
// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     paddingHorizontal: 20 * base,
//   },
//   Buttonwrapper: {
//     flexDirection: "row",
//     width: "100%",
//     gap: 12,
//     marginBottom: 8,
//   },
//   btnHalf: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//   },
//   orderbox: {
//     borderWidth: 1,
//     marginTop: 12,
//     padding: 12,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//   },
//   idStatusRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   statusInprogress: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: '#FFC107',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     backgroundColor: '#FFF9E6',
//     borderRadius: 100,
//   },
//   statusCompleted: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: '#07C187',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     backgroundColor: '#C2FFE0',
//     borderRadius: 100,
//   },
//   orderId: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: '#72828A',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     backgroundColor: '#F2F2F3',
//     borderRadius: 100,
//   },
//   line: {
//     borderTopWidth: 1,
//     borderColor: '#E5E7EB',
//     marginVertical: 10,
//   },
//   infoRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   infoCol: {
//     flex: 1,
//     paddingRight: 10,
//   },
//   infoColRight: {
//     flex: 1,
//     paddingLeft: 0,
//     alignItems: 'flex-end'
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "400",
//     color: "#000000",
//   },
//   iconTextRow: {
//     marginTop: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   infoText: {
//     fontSize: 14,
//     fontWeight: "400",
//     color: "#72828A",
//   },
//   greenTag: {
//     flexDirection: 'row',
//     backgroundColor: '#C1FFE0',
//     borderRadius: 100,
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     gap: 4,
//     alignItems: 'center',
//     alignSelf: "flex-start",
//   },
//   greenText: {
//     fontWeight: '400',
//     fontSize: 12,
//     color: '#07C187',
//   },
//   subtotalRow: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   SubtotalLabel: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#000000",
//   },
//   subtotalPrice: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#000000",
//   },
// });




import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Dimensions, ScrollView, Pressable } from "react-native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import {
  CalendarIcon,
  LocationPointIcon,
  NoResultsIcon,
  TimeIcon,
} from "../../assets/Icons";
import { getOrderHistory, OrderRecord } from "../../utils/orderStorage";
import { useLang } from "../../context/LangContext";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"inprogress" | "completed">(
    "inprogress"
  );
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await getOrderHistory();
      setOrders(data);
    };

    loadOrders();
  }, []);

  return (
    <ScreenLayout variant="inner" title={t("orderHistory")}>
      <View style={styles.body}>
        <View style={styles.Buttonwrapper}>
          <View style={styles.btnHalf}>
            <Button
              text={t("inProgressTab")}
              onPress={() => setActiveTab("inprogress")}
              backgroundColor={
                activeTab === "inprogress" ? "#07C187" : "#F2F2F3"
              }
              textStyle={{
                color: activeTab === "inprogress" ? "#FFFFFF" : "#72828A",
              }}
            />
          </View>

          <View style={styles.btnHalf}>
            <Button
              text={t("completedOrderTab")}
              onPress={() => setActiveTab("completed")}
              backgroundColor={
                activeTab === "completed" ? "#07C187" : "#F2F2F3"
              }
              textStyle={{
                color: activeTab === "completed" ? "#FFFFFF" : "#72828A",
              }}
            />
          </View>
        </View>

        <View style={styles.content}>
          {activeTab === "inprogress" ? (
            orders.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {orders.map((order) => (
                  <Pressable
                    key={order.orderId}
                    style={styles.orderbox}
                    onPress={() => navigation.navigate("InvoiceScreen", { orderId: order.orderId })}
                  >
                    <View style={styles.idStatusRow}>
                      <Text style={styles.orderId}>{order.orderId}</Text>
                      <Text style={styles.statusInprogress}>{t("statusInProgress")}</Text>
                    </View>

                    <View style={styles.line} />

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

                    <Text style={[styles.label, { marginTop: 10 }]}>
                      {t("deliveryLocation")}
                    </Text>
                    <View style={styles.iconTextRow}>
                      <LocationPointIcon color="#72828A" />
                      <Text style={styles.infoText}>123 Main St, New York</Text>
                    </View>

                    <Text style={[styles.label, { marginTop: 10 }]}>
                      {t("itemsCount")}
                    </Text>
                    <View style={[styles.greenTag, { marginTop: 4 }]}>
                      <NoResultsIcon
                        stroke="#07C187"
                        width={18 * base}
                        height={18 * base}
                      />
                      <Text style={styles.greenText}>
                        {order.items.length} {t("itemsUnit")}
                      </Text>
                    </View>

                    <View style={styles.line} />

                    <View style={styles.subtotalRow}>
                      <Text style={styles.SubtotalLabel}>{t("subtotal")}:</Text>
                      <Text style={styles.subtotalPrice}>
                        $ {order.subtotal.toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <NoResultsIcon />
                <Text style={styles.emptyTitle}>{t("noOrdersYet")}</Text>
                <Text style={styles.emptySubtitle}>{t("paidOrdersAppearHere")}</Text>
              </View>
            )
          ) : (
            <View style={styles.orderbox}>
              <View style={styles.idStatusRow}>
                <Text style={styles.orderId}>ORD-1234</Text>
                <Text style={styles.statusCompleted}>{t("statusCompleted")}</Text>
              </View>
              <View style={styles.line} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.label}>Order date</Text>
                  <View style={styles.iconTextRow}>
                    <CalendarIcon />
                    <Text style={styles.infoText}>2024-01-12</Text>
                  </View>
                </View>

                <View style={styles.infoColRight}>
                  <View>
                    <Text style={styles.label}>Order time</Text>
                    <View style={styles.iconTextRow}>
                      <TimeIcon />
                      <Text style={styles.infoText}>04:23:09PM</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={[styles.label, { marginTop: 10 }]}>
                Delivery Location
              </Text>
              <View style={styles.iconTextRow}>
                <LocationPointIcon color="#72828A" />
                <Text style={styles.infoText}>123 Main St, New York</Text>
              </View>

              <Text style={[styles.label, { marginTop: 10 }]}>
                Items count
              </Text>
              <View style={[styles.greenTag, { marginTop: 4 }]}>
                <NoResultsIcon
                  stroke="#07C187"
                  width={18 * base}
                  height={18 * base}
                />
                <Text style={styles.greenText}>2 {t("itemsUnit")}</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.subtotalRow}>
                <Text style={styles.SubtotalLabel}>Subtotal:</Text>
                <Text style={styles.subtotalPrice}>$ 25.00</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20 * base,
  },
  Buttonwrapper: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 8,
  },
  btnHalf: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  orderbox: {
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  idStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusInprogress: {
    fontSize: 12,
    fontWeight: "400",
    color: "#FFC107",
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#FFF9E6",
    borderRadius: 100,
  },
  statusCompleted: {
    fontSize: 12,
    fontWeight: "400",
    color: "#07C187",
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#C2FFE0",
    borderRadius: 100,
  },
  orderId: {
    fontSize: 12,
    fontWeight: "400",
    color: "#72828A",
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#F2F2F3",
    borderRadius: 100,
  },
  line: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    marginVertical: 10,
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
    alignItems: "flex-end",
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
  greenTag: {
    flexDirection: "row",
    backgroundColor: "#C1FFE0",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
    gap: 4,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  greenText: {
    fontWeight: "400",
    fontSize: 12,
    color: "#07C187",
  },
  subtotalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  SubtotalLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
  },
  subtotalPrice: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "400",
    color: "#72828A",
  },
});
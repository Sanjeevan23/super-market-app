import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "./cartStorage";

export type OrderRecord = {
  orderId: string;
  orderDate: string;
  orderTime: string;
  paymentMethod: "gpay" | "applepay";
  subtotal: number;
  items: CartItem[];
};

const ORDER_HISTORY_KEY = "order_history_v1";
const LATEST_INVOICE_KEY = "latest_invoice_v1";

export const saveOrderRecord = async (order: OrderRecord) => {
  const raw = await AsyncStorage.getItem(ORDER_HISTORY_KEY);
  const history: OrderRecord[] = raw ? JSON.parse(raw) : [];
  const nextHistory = [order, ...history];

  await AsyncStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(nextHistory));
  await AsyncStorage.setItem(LATEST_INVOICE_KEY, JSON.stringify(order));

  return order;
};

export const getLatestInvoice = async (): Promise<OrderRecord | null> => {
  const raw = await AsyncStorage.getItem(LATEST_INVOICE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OrderRecord;
  } catch {
    return null;
  }
};

export const getOrderHistory = async (): Promise<OrderRecord[]> => {
  const raw = await AsyncStorage.getItem(ORDER_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<OrderRecord | null> => {
  const history = await getOrderHistory();
  return history.find((item) => item.orderId === orderId) ?? null;
};

export const clearLatestInvoice = async () => {
  await AsyncStorage.removeItem(LATEST_INVOICE_KEY);
};
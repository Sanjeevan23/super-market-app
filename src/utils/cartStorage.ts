import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchProduct, SEARCH_PRODUCTS } from "../data/searchData";

export type CartStorageItem = {
  id: string;
  qty: number;
};

export type CartItem = SearchProduct & {
  qty: number;
};

const CART_KEY = "cart_items_v1";

const getStoredCart = async (): Promise<CartStorageItem[]> => {
  const raw = await AsyncStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredCart = async (items: CartStorageItem[]) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const getCartItems = async (): Promise<CartItem[]> => {
  const stored = await getStoredCart();

  const hydrated: CartItem[] = [];
  const cleanedStored: CartStorageItem[] = [];

  for (const entry of stored) {
    const product = SEARCH_PRODUCTS.find((p) => p.id === entry.id);

    if (!product) {
      continue;
    }

    hydrated.push({
      ...product,
      qty: entry.qty,
    });

    cleanedStored.push(entry);
  }

  if (cleanedStored.length !== stored.length) {
    await saveStoredCart(cleanedStored);
  }

  return hydrated;
};

export const addToCart = async (product: SearchProduct, qty: number) => {
  const stored = await getStoredCart();
  const index = stored.findIndex((x) => x.id === product.id);

  if (index >= 0) {
    stored[index].qty += qty;
  } else {
    stored.unshift({ id: product.id, qty });
  }

  await saveStoredCart(stored);
  return getCartItems();
};

export const updateCartQty = async (id: string, qty: number) => {
  const stored = await getStoredCart();
  const next = stored.map((item) => (item.id === id ? { ...item, qty } : item));
  await saveStoredCart(next);
  return getCartItems();
};

export const removeCartItem = async (id: string) => {
  const stored = await getStoredCart();
  const next = stored.filter((item) => item.id !== id);
  await saveStoredCart(next);
  return getCartItems();
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};
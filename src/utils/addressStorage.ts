import AsyncStorage from "@react-native-async-storage/async-storage";

const ADDRESSES_KEY = "saved_addresses_v2";

export type SavedAddress = {
    id: string;
    label: string;
    labelDisplay: string;
    flatHouseNo: string;
    streetRoad: string;
    landmark: string;
    city: string;
    specialInstructions: string;
    lat: string;
    lon: string;
    createdAt: number;
};

export const getAddresses = async (): Promise<SavedAddress[]> => {
    try {
        const raw = await AsyncStorage.getItem(ADDRESSES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveAddress = async (
    addr: Omit<SavedAddress, "id" | "createdAt">
): Promise<SavedAddress[]> => {
    const existing = await getAddresses();
    const entry: SavedAddress = { ...addr, id: Date.now().toString(), createdAt: Date.now() };
    const next = [entry, ...existing];
    await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(next));
    return next;
};

export const clearAddresses = async (): Promise<void> => {
    await AsyncStorage.removeItem(ADDRESSES_KEY);
};

export const formatAddressShort = (addr: SavedAddress): string =>
    [addr.landmark || addr.streetRoad || addr.flatHouseNo, addr.city]
        .filter(Boolean)
        .join(", ");

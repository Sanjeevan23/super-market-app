import { useState } from "react";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";

export type LocationResult = {
    latitude: number;
    longitude: number;
};

export const useLocation = () => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<LocationResult | null>(null);

    const requestLocation = async (): Promise<LocationResult | null> => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                // On iOS, if previously denied, open app settings
                if (Platform.OS === "ios") {
                    Linking.openSettings();
                }
                return null;
            }

            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const result: LocationResult = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            };
            setLocation(result);
            return result;
        } finally {
            setLoading(false);
        }
    };

    return { requestLocation, location, loading };
};

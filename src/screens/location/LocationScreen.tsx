import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import { base, Colors } from "../../theme/colors";
import { useLang } from "../../context/LangContext";
import { useLocation } from "../../utils/useLocation";

const LocationScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t } = useLang();
    const { requestLocation, loading } = useLocation();

    const handleAllowLocation = async () => {
        const result = await requestLocation();
        if (result) {
            navigation.reset({ index: 0, routes: [{ name: "Footer" }] });
        }
    };

    return (
        <ScreenLayout variant="inner" title={t("enableLocation")} showBackIcon={false}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image
                        source={require("../../assets/image/location_map.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>{t("setYourLocation")}</Text>
                    <Text style={styles.subtitle}>{t("locationSubtitle")}</Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        text={t("allowGoogleMaps")}
                        onPress={handleAllowLocation}
                        loading={loading}
                    />
                    <Button
                        text={t("setManually")}
                        onPress={() => navigation.navigate("Manual_LocationScreen")}
                        backgroundColor="transparent"
                        containerStyle={styles.outlineButton}
                        textStyle={styles.outlineText}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default LocationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    content: {
        alignItems: "center",
        marginTop: 145 * base,
    },
    image: {
        width: 262 * base,
        height: 260 * base,
    },
    title: {
        marginTop: 20 * base,
        fontSize: 16,
        fontWeight: "500",
        color: Colors.black,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "400",
        color: Colors.subText,
        textAlign: "center",
        paddingHorizontal: 20 * base,
    },
    footer: {
        paddingHorizontal: 20 * base,
        paddingBottom: 24,
        gap: 20,
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    outlineText: {
        color: Colors.primary,
    },
});

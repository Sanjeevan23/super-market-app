import React from "react";
import {
    View,
    Image,
    StyleSheet,
    StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components/layout/Button";
import { useLang } from "../../context/LangContext";
import { base, Colors } from "../../theme/colors";

const ChooseScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { t } = useLang();

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent={false} />
            <Image
                source={require("../../assets/image/icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.card}>
                <Button
                    text={t("existingMemberLogin")}
                    onPress={() => navigation.navigate("LoginScreen")}
                />
                <Button
                    text={t("newToHappycartCreate")}
                    onPress={() => navigation.navigate("RegisterScreen")}
                    backgroundColor="transparent"
                    containerStyle={styles.outlineButton}
                    textStyle={styles.outlineText}
                />
            </View>
        </View>
    );
};

export default ChooseScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20 * base,
    },
    logo: {
        width: 180 * base,
        height: 70 * base,
        marginBottom: 30 * base,
    },
    card: {
        width: "100%",
        paddingHorizontal: 20 * base,
        paddingVertical: 30,
        backgroundColor: Colors.white,
        borderRadius: 30,
        gap: 20,
        alignSelf: "center",
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
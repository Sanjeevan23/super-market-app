import React from "react";
import { View, StyleSheet } from "react-native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";

const Manual_LocationScreen: React.FC = () => {
    return (
        <ScreenLayout variant="inner" title="Set Location">
            <View style={styles.container} />
        </ScreenLayout>
    );
};

export default Manual_LocationScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
});

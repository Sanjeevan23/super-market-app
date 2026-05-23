import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  FrenchFlagIcon,
  GermanFlagIcon,
  LocationIcon,
  NotificationIcon,
  SearchIcon,
  UKFlagIcon,
} from "../../assets/Icons";
import { useNavigation } from "@react-navigation/native";
import { useLang, Lang } from "../../context/LangContext";

const FLAG_ICONS: Record<Lang, React.ReactElement> = {
  en: <UKFlagIcon />,
  de: <GermanFlagIcon />,
  fr: <FrenchFlagIcon />,
};

type ScreenLayoutProps = {
  variant: "home" | "inner";
  title?: string;
  onBackPress?: () => void;
  onPressSearch?: () => void;
  children: ReactNode;
  showBackIcon?: boolean;
};

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  variant,
  title,
  onBackPress,
  onPressSearch,
  children,
  showBackIcon = true
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, lang } = useLang();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#07C187" translucent={false} />

      <View style={[styles.headerArea, { paddingTop: insets.top }]}>
        {variant === "home" ? (
          <>
            <View style={styles.homeTopRow}>
              <View style={styles.deliverRow}>
                <LocationIcon />
                <View>
                  <Text style={styles.deliverLabel}>{t("deliveredTo")}</Text>
                  <Text style={styles.addressText}>123 Main St, New York</Text>
                </View>
              </View>

              <View style={styles.rightIcons}>
                {FLAG_ICONS[lang]}
                <NotificationIcon />
              </View>
            </View>

            <Pressable style={styles.homeSearchBox} onPress={onPressSearch}>
              <SearchIcon />
              <Text style={styles.searchText}>{t("search")}</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.innerTopRow}>
            {showBackIcon !== false && (
              <Pressable
                onPress={() => {
                  if (onBackPress) {
                    onBackPress();
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                <BackIcon />
              </Pressable>
            )}
            <Text style={styles.innerTitle}>{title ?? ""}</Text>
          </View>
        )}
      </View>

      <View style={styles.whiteBody}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07C187",
  },
  headerArea: {
    paddingHorizontal: 20 * base,
  },
  innerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  innerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 16 * base,
  },
  homeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  deliverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  deliverLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "500",
  },
  addressText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "400",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12 * base,
  },
  homeSearchBox: {
    marginVertical: 20,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 4,
  },
  searchText: {
    color: "#72828A",
    fontSize: 14,
  },
  whiteBody: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
});
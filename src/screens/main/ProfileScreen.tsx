import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import {
  AboutIcon,
  DeleteIcon,
  HelpIcon,
  LanguageIcon,
  LocationPointIcon,
  LockIcon,
  LogoutIcon,
  OrderHistoryIcon,
  PrivacyIcon,
  ProfileIcon,
} from "../../assets/Icons";
import { LanguageSheet } from "../../components/ui/profile/LanguageSheet";
import { useLang } from "../../context/LangContext";
import AddressPickerModal from "../../components/layout/AddressPickerModal";
import { SavedAddress, getAddresses, clearAddresses } from "../../utils/addressStorage";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const { t, lang } = useLang();
  const langNames: Record<string, string> = { en: t("englishUkTitle"), de: t("germanTitle"), fr: t("frenchTitle") };

  useFocusEffect(
    React.useCallback(() => {
      getAddresses().then(setAddresses);
    }, [])
  );

  const handleLogout = async () => {
    await clearAddresses();
    navigation.reset({ index: 0, routes: [{ name: "ChooseScreen" }] });
  };

  return (
    <ScreenLayout variant="inner" title={t("profile")}>
      <View style={styles.body}>
        <ScrollView style={styles.scrollWrapper} showsVerticalScrollIndicator={false}>
          <View style={styles.profileRow}>
            <View style={styles.profileWrapper}>
              <ProfileIcon width={30 * base} height={30 * base} />
            </View>

            <View style={styles.ProfileRight}>
              <Text style={styles.username}>Sanjeevan</Text>
              <Text style={styles.contact}>0762360948</Text>
              <Text style={styles.contact}>sanjeevanyogan@gmail.com</Text>
            </View>
          </View>

          <View style={styles.detail_container}>
            <Text style={styles.Sectiontitle}>{t("savedLocations")}</Text>

            <Pressable style={styles.row} onPress={() => setAddressModalOpen(true)}>
              <LocationPointIcon color="#72828A" />
              <Text style={styles.AddressText}>{t("address")}</Text>
            </Pressable>

            <Text style={styles.Sectiontitle}>{t("preferences")}</Text>

            <Pressable style={styles.row} onPress={() => setLanguageOpen(true)}>
              <LanguageIcon />
              <View>
                <Text style={[styles.Sectiontitle, { marginVertical: 0 }]}>{t("language")}</Text>
                <Text style={styles.AddressText}>{langNames[lang]}</Text>
              </View>
            </Pressable>

            <Text style={styles.Sectiontitle}>{t("security")}</Text>

            <Pressable style={styles.row}>
              <LockIcon />
              <Text style={styles.AddressText}>{t("changePassword")}</Text>
            </Pressable>

            <Pressable style={styles.row}>
              <DeleteIcon width={18 * base} height={18 * base} />
              <Text style={styles.DeleteText}>{t("deleteAccount")}</Text>
            </Pressable>

            <Text style={styles.Sectiontitle}>{t("supportInformation")}</Text>

            <Pressable style={styles.row}>
              <HelpIcon />
              <Text style={styles.AddressText}>{t("helpCenter")}</Text>
            </Pressable>

            <Pressable style={styles.row}>
              <AboutIcon />
              <Text style={styles.AddressText}>{t("aboutUs")}</Text>
            </Pressable>

            <Pressable style={styles.row}>
              <PrivacyIcon />
              <Text style={styles.AddressText}>{t("privacyPolicy")}</Text>
            </Pressable>

            <Pressable style={styles.row}>
              <OrderHistoryIcon strokeColor="#72828A" innerColor="#72828A" width={17 * base} height={17 * base} />
              <Text style={styles.AddressText}>{t("termsOfService")}</Text>
            </Pressable>

            <Pressable style={styles.row} onPress={handleLogout}>
              <LogoutIcon />
              <Text style={styles.DeleteText}>{t("logout")}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <LanguageSheet visible={languageOpen} onClose={() => setLanguageOpen(false)} />

      <AddressPickerModal
        visible={addressModalOpen}
        addresses={addresses}
        selectable={false}
        onClose={() => setAddressModalOpen(false)}
      />
    </ScreenLayout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  scrollWrapper: { paddingHorizontal: 20 * base, paddingBottom: '15%' },
  profileWrapper: {
    padding: 15,
    backgroundColor: '#F2F2F3',
    borderRadius: 30,
    alignSelf: "flex-start",
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ProfileRight: {
    marginLeft: 8,
  },
  username: {
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    lineHeight: 20
  },
  contact: {
    fontWeight: '400',
    fontSize: 10,
    color: '#72828A',
    lineHeight: 16
  },
  detail_container: {
    marginTop: 20
  },
  Sectiontitle: {
    fontWeight: '400',
    fontSize: 12,
    color: '#72828A',
    marginVertical: 10,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  AddressText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
    lineHeight: 20
  },
  DeleteText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#FF1612',
    lineHeight: 20
  },

});
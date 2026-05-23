import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  GermanFlagIcon,
  UKFlagIcon,
  FrenchFlagIcon,
  RadioActiveIcon,
  RadioInactiveIcon,
} from "../../../assets/Icons";
import { useLang, Lang } from "../../../context/LangContext";
import { Button } from "../../layout/Button";

const { width: deviceWidth } = Dimensions.get("window");
const base = deviceWidth / 440;

type Props = {
  visible: boolean;
  onClose: () => void;
};

type LanguageItem = {
  id: Lang;
  nativeName: string;
  englishName: string;
  flag: React.ReactNode;
};

export const LanguageSheet: React.FC<Props> = ({
  visible,
  onClose,
}) => {
  const { lang, setLang, t } = useLang();

  const translateY = useRef(new Animated.Value(300)).current;

  const [selected, setSelected] = useState<Lang>(lang);

  useEffect(() => {
    if (visible) {
      setSelected(lang);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(300);
    }
  }, [visible, lang, translateY]);

  const languages: LanguageItem[] = useMemo(
    () => [
      {
        id: "de",
        nativeName: "Deutsch",
        englishName: "German",
        flag: <GermanFlagIcon />,
      },
      {
        id: "en",
        nativeName: "English",
        englishName: "English (UK)",
        flag: <UKFlagIcon />,
      },
      {
        id: "fr",
        nativeName: "Français",
        englishName: "French",
        flag: <FrenchFlagIcon />,
      },
    ],
    []
  );

  const handleSave = async () => {
    await setLang(selected);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>
            {t("languageSheetTitle")}
          </Text>

          <View style={styles.list}>
            {languages.map((item) => {
              const isActive = selected === item.id;

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.item,
                    isActive && styles.itemActive,
                  ]}
                  onPress={() => setSelected(item.id)}
                >
                  <View style={styles.radioWrap}>
                    {isActive ? (
                      <RadioActiveIcon />
                    ) : (
                      <RadioInactiveIcon />
                    )}
                  </View>

                  {item.flag}

                  <View style={styles.textWrap}>
                    <Text style={styles.itemTitle}>
                      {item.nativeName}
                    </Text>

                    <Text style={styles.itemSubtitle}>
                      {item.englishName}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Button text={t("save")}
          onPress={handleSave}
          containerStyle={{marginTop:20, marginBottom:30}}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20 * base,
    paddingTop: 20,
    paddingBottom: 30,
  },

  handle: {
    alignSelf: "center",
    width: 40,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#F2F2F3",
  },

  title: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
  },

  list: {
    marginTop: 20,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    gap:8,
    backgroundColor: "#FFFFFF",
  },
  itemActive: {
    borderColor: "#07C187",
  },
  radioWrap: {
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "400",
    color: "#72828A",
    lineHeight: 14,
  },
});
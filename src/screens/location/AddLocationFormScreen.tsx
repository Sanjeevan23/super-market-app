import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Modal,
    Pressable,
    Animated,
    Easing,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "../../components/layout/ScreenLayout";
import { Button } from "../../components/layout/Button";
import InputBox from "../../components/layout/InputBox";
import { LabelIcon, RadioActiveIcon, RadioInactiveIcon } from "../../assets/Icons";
import { base, Colors } from "../../theme/colors";
import { useLang } from "../../context/LangContext";
import { saveAddress } from "../../utils/addressStorage";

type RouteParams = {
    lat: string;
    lon: string;
    display_name: string;
};

type NominatimAddress = {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    footway?: string;
    path?: string;
    cycleway?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    hamlet?: string;
    village?: string;
    municipality?: string;
    town?: string;
    city?: string;
    city_district?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
    postcode?: string;
};

const LABEL_OPTIONS = [
    { key: "home",   labelKey: "labelHome"   as const },
    { key: "flat",   labelKey: "labelFlat"   as const },
    { key: "office", labelKey: "labelOffice" as const },
    { key: "hotel",  labelKey: "labelHotel"  as const },
    { key: "other",  labelKey: "labelOther"  as const },
];

const buildLeafletHtml = (lat: number, lon: number) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    html,body,#map{height:100%;margin:0;padding:0;background:#e8f0e9;}
    .ctrl-btn{
      width:34px;height:34px;background:#fff;border-radius:8px;
      display:flex;align-items:center;justify-content:center;
      font-size:20px;font-weight:600;color:#07C187;cursor:pointer;
      box-shadow:0 2px 6px rgba(0,0,0,0.18);border:none;line-height:1;
      margin-bottom:6px;
    }
    .ctrl-wrap{
      position:absolute;right:10px;top:50%;transform:translateY(-50%);
      display:flex;flex-direction:column;align-items:center;z-index:999;
    }
    .tap-hint{
      position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,0.45);color:#fff;font-size:11px;
      padding:3px 10px;border-radius:12px;white-space:nowrap;z-index:999;
      pointer-events:none;
    }
    .leaflet-control-attribution,.leaflet-control-zoom{display:none!important;}
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="ctrl-wrap">
    <button class="ctrl-btn" id="zi">+</button>
    <button class="ctrl-btn" id="zo">−</button>
  </div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function(){
      try{
        var lat=${lat}, lon=${lon};
        var map=L.map('map',{zoomControl:false,attributionControl:false}).setView([lat,lon],16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,detectRetina:true}).addTo(map);
        var pinHtml='<div style="width:22px;height:28px;background:#EC1C24;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>';
        var icon=L.divIcon({className:'',html:pinHtml,iconSize:[22,28],iconAnchor:[11,28]});
        var marker=L.marker([lat,lon],{icon:icon}).addTo(map);
        document.getElementById('zi').onclick=function(){map.zoomIn();};
        document.getElementById('zo').onclick=function(){map.zoomOut();};
        function post(msg){
          if(window.ReactNativeWebView)
            window.ReactNativeWebView.postMessage(JSON.stringify(msg));
        }
        map.on('click',function(e){
          var ll=e.latlng;
          marker.setLatLng(ll);
          map.panTo(ll);
          post({type:'MAP_CLICK',lat:ll.lat,lon:ll.lng});
        });
        map.whenReady(function(){ post({type:'MAP_READY'}); });
      }catch(e){
        if(window.ReactNativeWebView)
          window.ReactNativeWebView.postMessage(JSON.stringify({type:'MAP_ERROR',msg:String(e)}));
      }
    })();
  </script>
</body>
</html>`;

const AddLocationFormScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { t } = useLang();

    const { lat, lon } = (route.params ?? {}) as RouteParams;

    const [mapLoading, setMapLoading] = useState(true);
    const [mapError, setMapError] = useState(false);
    const [geocoding, setGeocoding] = useState(false);

    const [labelModalVisible, setLabelModalVisible] = useState(false);
    const [selectedLabelKey, setSelectedLabelKey] = useState("");
    const [labelError, setLabelError] = useState("");
    const [tempLabelKey, setTempLabelKey] = useState("");
    const [otherText, setOtherText] = useState("");
    const [tempOtherText, setTempOtherText] = useState("");

    const [flatHouseNo, setFlatHouseNo] = useState("");
    const [streetRoad, setStreetRoad] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [cityError, setCityError] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");

    const modalSlide = useRef(new Animated.Value(500)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const webviewRef = useRef<WebView | null>(null);

    const hasCoords = !!(lat && lon);

    // Shimmer loop while geocoding
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(shimmerAnim, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        );
        if (geocoding) loop.start();
        else { loop.stop(); shimmerAnim.setValue(0); }
        return () => loop.stop();
    }, [geocoding]);

    // Strip admin suffixes so "Jaffna District" → "Jaffna"
    const cleanAdmin = (s?: string) =>
        s?.replace(/\s+(District|Division|Province|Prefecture|County|Municipality|Oblast|Region|Department)$/i, "").trim() ?? "";

    const applyAddress = (addr: NominatimAddress) => {
        // House number
        const houseNumber = addr.house_number ?? "";

        // Street / Road — named road first, postcode as last resort so field isn't empty
        const road =
            addr.road ??
            addr.pedestrian ??
            addr.footway ??
            addr.cycleway ??
            addr.path ??
            addr.postcode ??   // postal code as fallback so user sees something
            "";

        // Landmark — the local sub-area: village/hamlet/suburb (not the city-level admin)
        const localArea =
            addr.village ??
            addr.hamlet ??
            addr.suburb ??
            addr.neighbourhood ??
            addr.quarter ??
            "";

        // City — city-district level: strip " District" suffix for clean display
        // county (e.g. "Jaffna District") is the right level for Sri Lankan cities
        const resolvedCity = cleanAdmin(
            addr.city ??
            addr.town ??
            addr.municipality ??
            addr.city_district ??
            addr.county ??
            addr.state_district ??
            addr.state
        );

        setFlatHouseNo(houseNumber);
        setStreetRoad(road);
        setLandmark(localArea);
        setCity(resolvedCity);
        if (resolvedCity) setCityError("");
    };

    const reverseGeocode = async (rlat: string, rlon: string) => {
        setGeocoding(true);
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${rlat}&lon=${rlon}&addressdetails=1&zoom=18`;
            const res = await fetch(url, { headers: { "User-Agent": "HappyCartApp/1.0" } });
            const data = await res.json();
            applyAddress(data.address ?? {});
        } catch {
            // silently fail — user fills manually
        } finally {
            setGeocoding(false);
        }
    };

    useEffect(() => {
        if (hasCoords) reverseGeocode(lat, lon);
    }, []);

    const onWebViewMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data?.type === "MAP_READY") setMapLoading(false);
            if (data?.type === "MAP_ERROR") { setMapLoading(false); setMapError(true); }
            if (data?.type === "MAP_CLICK") reverseGeocode(String(data.lat), String(data.lon));
        } catch { /* ignore */ }
    };

    const openLabelModal = () => {
        setTempLabelKey(selectedLabelKey || "home");
        setTempOtherText(otherText);
        setLabelModalVisible(true);
        Animated.parallel([
            Animated.timing(modalSlide, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
    };

    const closeLabelModal = () => {
        Keyboard.dismiss();
        Animated.parallel([
            Animated.timing(modalSlide, { toValue: 500, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start(() => setLabelModalVisible(false));
    };

    const saveLabelModal = () => {
        setSelectedLabelKey(tempLabelKey);
        setOtherText(tempLabelKey === "other" ? tempOtherText : "");
        if (tempLabelKey) setLabelError("");
        closeLabelModal();
    };

    const getLabelDisplay = () => {
        if (!selectedLabelKey) return "";
        if (selectedLabelKey === "other") return otherText || t("labelOther");
        return t(LABEL_OPTIONS.find((o) => o.key === selectedLabelKey)!.labelKey);
    };

    const handleSave = async () => {
        let hasError = false;
        if (!selectedLabelKey) { setLabelError("Label is required"); hasError = true; }
        if (!city.trim()) { setCityError("City is required"); hasError = true; }
        if (hasError) return;

        const labelDisplay = selectedLabelKey === "other"
            ? otherText || t("labelOther")
            : t(LABEL_OPTIONS.find((o) => o.key === selectedLabelKey)!.labelKey);

        await saveAddress({
            label: selectedLabelKey,
            labelDisplay,
            flatHouseNo,
            streetRoad,
            landmark,
            city,
            specialInstructions,
            lat: lat ?? "",
            lon: lon ?? "",
        });

        navigation.reset({ index: 0, routes: [{ name: "Footer" }] });
    };

    const mapHtml = hasCoords ? buildLeafletHtml(Number(lat), Number(lon)) : null;

    return (
        <ScreenLayout variant="inner" title={t("addLocation")}>
            <View style={styles.container}>
                    <KeyboardAwareScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets={true}
                        enableOnAndroid={true}
                        extraScrollHeight={80}
                        enableAutomaticScroll={true}
                        extraHeight={80}
                    >
                        {/* Map */}
                        <View style={styles.mapWrapper}>
                            {/* Placeholder shown when no coords or map error */}
                            {(!mapHtml || mapError) && (
                                <Image
                                    source={require("../../assets/image/location_map.png")}
                                    style={styles.mapImage}
                                    resizeMode="cover"
                                />
                            )}

                            {mapHtml && !mapError && (
                                <>
                                    <WebView
                                        ref={webviewRef}
                                        originWhitelist={["*"]}
                                        source={{ html: mapHtml }}
                                        style={[styles.webview, mapLoading && styles.hidden]}
                                        onMessage={onWebViewMessage}
                                        onError={() => { setMapLoading(false); setMapError(true); }}
                                        javaScriptEnabled
                                        domStorageEnabled
                                    />
                                    {/* Map loading skeleton */}
                                    {mapLoading && (
                                        <View style={styles.mapSkeleton}>
                                            <ActivityIndicator color={Colors.primary} size="large" />
                                        </View>
                                    )}
                                </>
                            )}

                            {/* Geocoding shimmer overlay on the map */}
                            {geocoding && (
                                <Animated.View
                                    style={[
                                        styles.geocodingOverlay,
                                        { opacity: shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] }) },
                                    ]}
                                >
                                    <View style={styles.geocodeSkeletonLine} />
                                    <View style={[styles.geocodeSkeletonLine, styles.geocodeSkeletonShort]} />
                                </Animated.View>
                            )}
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.field}>
                                <InputBox
                                    label={t("labelField")}
                                    placeholder={t("labelSelect")}
                                    value={getLabelDisplay()}
                                    editable={false}
                                    onPress={openLabelModal}
                                    rightIcon={<LabelIcon width={17} height={17} />}
                                    onRightIconPress={openLabelModal}
                                    errorMessage={labelError}
                                />
                            </View>

                            <View style={styles.field}>
                                <InputBox
                                    label={t("flatHouseNo")}
                                    placeholder={t("flatHouseNoPlaceholder")}
                                    value={flatHouseNo}
                                    setValue={setFlatHouseNo}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>

                            <View style={styles.field}>
                                <InputBox
                                    label={t("streetRoad")}
                                    placeholder={t("streetRoadPlaceholder")}
                                    value={streetRoad}
                                    setValue={setStreetRoad}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>

                            <View style={styles.field}>
                                <InputBox
                                    label={t("landmark")}
                                    placeholder={t("landmarkPlaceholder")}
                                    value={landmark}
                                    setValue={setLandmark}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>

                            <View style={styles.field}>
                                <InputBox
                                    label={t("city")}
                                    placeholder={t("cityPlaceholder")}
                                    value={city}
                                    setValue={(v) => { setCity(v); if (v.trim()) setCityError(""); }}
                                    errorMessage={cityError}
                                    returnKeyType="done"
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>

                            <View style={styles.field}>
                                <InputBox
                                    label={t("specialInstructions")}
                                    placeholder={t("specialInstructionsPlaceholder")}
                                    value={specialInstructions}
                                    setValue={setSpecialInstructions}
                                    multiline
                                    style={styles.multilineInput}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    <View style={styles.footer}>
                        <Button text={t("save")} onPress={handleSave} />
                    </View>
            </View>

            {/* Label bottom sheet */}
            <Modal
                visible={labelModalVisible}
                transparent
                animationType="none"
                onRequestClose={closeLabelModal}
            >
                <KeyboardAvoidingView style={[styles.flex, styles.modalContainer]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]} pointerEvents="box-none">
                        <Pressable style={styles.flex} onPress={() => { Keyboard.dismiss(); closeLabelModal(); }} />
                    </Animated.View>
                    <Animated.View style={[styles.modalSheet, { transform: [{ translateY: modalSlide }] }]}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>{t("labelSelectTitle")}</Text>

                        {LABEL_OPTIONS.map((opt) => {
                            const active = tempLabelKey === opt.key;
                            return (
                                <React.Fragment key={opt.key}>
                                    <TouchableOpacity
                                        style={[styles.radioRow, active && styles.radioRowActive]}
                                        onPress={() => setTempLabelKey(opt.key)}
                                        activeOpacity={0.8}
                                    >
                                        {active
                                            ? <RadioActiveIcon width={21 * base} height={21 * base} />
                                            : <RadioInactiveIcon width={21 * base} height={21 * base} />}
                                        <Text style={styles.radioLabel}>{t(opt.labelKey)}</Text>
                                    </TouchableOpacity>

                                    {opt.key === "other" && active && (
                                        <View style={[styles.field, { marginBottom: 8 }]}>
                                            <InputBox
                                                placeholder={t("typeHere")}
                                                value={tempOtherText}
                                                setValue={setTempOtherText}
                                            />
                                        </View>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        <View style={styles.modalFooter}>
                            <Button text={t("save")} onPress={saveLabelModal} />
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        </ScreenLayout>
    );
};

export default AddLocationFormScreen;

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: '15%' },

    mapWrapper: {
        marginHorizontal: 20 * base,
        marginTop: 8,
        width: 400 * base,
        height: 160 ,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#E8F0E9",
    },
    webview: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    hidden: { opacity: 0, position: "absolute", width: "100%", height: "100%" },
    mapImage: {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    mapSkeleton: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#E8EDEA",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    geocodingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(232,240,233,0.82)",
        borderRadius: 12,
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    geocodeSkeletonLine: {
        height: 8,
        backgroundColor: "#B8D4BF",
        borderRadius: 4,
        marginBottom: 6,
        width: "55%",
    },
    geocodeSkeletonShort: {
        width: "35%",
    },

    form: {
        paddingHorizontal: 20 * base,
        paddingTop: 16,
        gap: 16,
    },
    field: { width: "100%" },
    multilineInput: {
        height: 80,
        textAlignVertical: "top",
    },
    footer: {
        paddingHorizontal: 20 * base,
        paddingTop: 8,
    },

    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    modalSheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20 * base,
        paddingTop: 20,
        paddingBottom: 30,
    },
    modalHandle: {
        width: 40 * base, height: 6,
        backgroundColor: "#F2F2F3",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20 * base,
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.black,
        textAlign: "center",
        marginBottom: 20,
    },
    radioRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12 * base,
        paddingVertical: 8.5,
        gap: 8 * base,
        marginBottom: 10 * base,
    },
    radioRowActive: { borderColor: Colors.primary },
    radioLabel: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.black,
    },
    modalFooter: { marginTop: 18* base },
    modalContainer: { justifyContent: "flex-end" },
});

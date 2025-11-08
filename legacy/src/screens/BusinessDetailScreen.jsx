import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import ImageGallery from "../components/ImageGallery";
import BusinessHeader from "../components/BusinessHeader";

const BusinessDetailScreen = ({ route }) => {
    const { businessId } = route.params;
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    const fetchBusinessDetails = async () => {
        try {
            const businessRef = doc(db, "businesses", businessId);
            const businessDoc = await getDoc(businessRef);

            if (businessDoc.exists()) {
                setBusiness({ id: businessDoc.id, ...businessDoc.data() });
            } else {
                Alert.alert("Error", "Business not found");
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            Alert.alert("Error", "Failed to load business details");
        } finally {
            setLoading(false);
        }
    };

    const openMaps = () => {
        if (!business) return;

        const scheme = Platform.select({
            ios: "maps:0,0?q=",
            android: "geo:0,0?q=",
        });
        const latLng = `${business.location.latitude},${business.location.longitude}`;
        const label = business.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url);
    };

    const getDayOfWeek = () => {
        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        const today = new Date().getDay();
        return days[today];
    };

    const isOpenNow = () => {
        if (!business?.operatingHours) return false;

        const today = getDayOfWeek();
        const hours = business.operatingHours[today];
        if (!hours) return false;

        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const openTime = parseInt(hours.open.replace(":", ""));
        const closeTime = parseInt(hours.close.replace(":", ""));

        return currentTime >= openTime && currentTime <= closeTime;
    };

    const handleViewAllServices = () => {
        navigation.navigate("Services", { businessId: business.id });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>
                    Loading business details...
                </Text>
            </View>
        );
    }

    if (!business) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Business not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <ImageGallery
                    images={business.images}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                />

                <View style={styles.infoContainer}>
                    <BusinessHeader
                        business={business}
                        isOpenNow={isOpenNow()}
                    />

                    <TouchableOpacity
                        style={styles.addressContainer}
                        onPress={openMaps}
                    >
                        <MaterialCommunityIcons
                            name="map-marker"
                            size={24}
                            color="#4A90E2"
                        />
                        <Text style={styles.address}>{business.address}</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>
                        {business.description}
                    </Text>

                    <Text style={styles.sectionTitle}>Operating Hours</Text>
                    {Object.entries(business.operatingHours).map(
                        ([day, hours]) => (
                            <View key={day} style={styles.hoursRow}>
                                <Text
                                    style={[
                                        styles.dayText,
                                        day === getDayOfWeek() &&
                                            styles.currentDay,
                                    ]}
                                >
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Text>
                                <Text style={styles.hoursText}>
                                    {hours.open} - {hours.close}
                                </Text>
                            </View>
                        )
                    )}
                    {/* 
                    <Text style={styles.sectionTitle}>Services</Text>
                    <View style={styles.servicesContainer}>
                        {business.services.slice(0, 3).map((service, index) => (
                            <View key={index} style={styles.serviceTag}>
                                <Text style={styles.serviceText}>
                                    {service}
                                </Text>
                            </View>
                        ))}
                    </View> */}
                    <TouchableOpacity
                        onPress={handleViewAllServices}
                        style={styles.viewAllButton}
                    >
                        <Text style={styles.viewAllText}>
                            View All Services
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Location</Text>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: business.location.latitude,
                            longitude: business.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: business.location.latitude,
                                longitude: business.location.longitude,
                            }}
                            title={business.name}
                        >
                            <MaterialCommunityIcons
                                name="car-wash"
                                size={30}
                                color="#4A90E2"
                            />
                        </Marker>
                    </MapView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#FF5252",
    },
    infoContainer: {
        padding: 16,
        backgroundColor: "#fff",
    },
    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
    },
    address: {
        fontSize: 16,
        color: "#333",
        marginLeft: 8,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 16,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
    },
    hoursRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    dayText: {
        fontSize: 16,
        color: "#666",
        width: 100,
    },
    currentDay: {
        color: "#4A90E2",
        fontWeight: "bold",
    },
    hoursText: {
        fontSize: 16,
        color: "#333",
    },
    servicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    serviceTag: {
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    serviceText: {
        color: "#4A90E2",
        fontSize: 14,
    },
    map: {
        height: 200,
        marginTop: 8,
        borderRadius: 8,
    },
    viewAllButton: {
        backgroundColor: "#4A90E2",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    viewAllText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default BusinessDetailScreen;

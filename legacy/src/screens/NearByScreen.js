import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    ActivityIndicator,
} from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const NearbyBusinessesScreen = () => {
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchBusinesses();
        }
    }, [userLocation]);

    const fetchUserLocation = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission denied",
                    "Please enable location services to find nearby car washes.",
                    [{ text: "OK" }]
                );
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.error("Error getting location:", error);
            Alert.alert(
                "Error",
                "Failed to get your location. Please try again.",
                [{ text: "OK" }]
            );
            setLoading(false);
        }
    };

    const fetchBusinesses = async () => {
        try {
            const businessesRef = collection(db, "businesses");
            const q = query(businessesRef, where("isActive", "==", true));
            const querySnapshot = await getDocs(q);

            const businessList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                coordinate: {
                    latitude: doc.data().location.latitude,
                    longitude: doc.data().location.longitude,
                },
            }));

            setBusinesses(businessList);
        } catch (error) {
            console.error("Error fetching businesses:", error);
            Alert.alert(
                "Error",
                "Failed to load nearby businesses. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    const BusinessCard = ({ business }) => (
        <TouchableOpacity
            style={styles.businessCard}
            onPress={() =>
                navigation.navigate("BusinessDetails", {
                    businessId: business.id,
                })
            }
        >
            <Image
                source={{ uri: business.images[0] }}
                style={styles.businessImage}
            />
            <View style={styles.businessInfo}>
                <Text style={styles.businessName} numberOfLines={1}>
                    {business.name}
                </Text>
                <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FFD700"
                    />
                    <Text style={styles.rating}>
                        {business.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.totalRatings}>
                        ({business.totalRatings})
                    </Text>
                </View>
                <Text style={styles.address} numberOfLines={1}>
                    {business.address}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>
                    Loading nearby car washes...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* {region && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                >
                    {businesses.map((business) => (
                        <Marker
                            key={business.id}
                            coordinate={business.coordinate}
                            title={business.name}
                            description={business.address}
                            onPress={() => setSelectedBusiness(business)}
                        >
                            <MaterialCommunityIcons
                                name="car-wash"
                                size={30}
                                color="#4A90E2"
                            />
                        </Marker>
                    ))}
                </MapView>
            )} */}

            <View style={styles.businessList}>
                <Text style={styles.listTitle}>Nearby Car Washes</Text>
                {businesses.length > 0 ? (
                    <FlatList
                        data={businesses}
                        renderItem={({ item }) => (
                            <BusinessCard business={item} />
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={styles.noBusinessesText}>
                        No car washes found nearby. Try expanding your search
                        area.
                    </Text>
                )}
            </View>
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
    map: {
        flex: 1,
    },
    businessList: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    businessCard: {
        width: 280,
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    businessImage: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    businessInfo: {
        padding: 12,
    },
    businessName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    rating: {
        marginLeft: 4,
        fontWeight: "bold",
        color: "#333",
    },
    totalRatings: {
        marginLeft: 4,
        color: "#666",
    },
    address: {
        color: "#666",
        fontSize: 14,
    },
    noBusinessesText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
});

export default NearbyBusinessesScreen;

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceCard from "../components/ServiceCard";

const ServicesScreen = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const { businessId } = route.params;

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const servicesRef = collection(db, "services");
            const q = query(
                servicesRef,
                where("isActive", "==", true),
                where("businessId", "==", businessId)
            );
            const querySnapshot = await getDocs(q);

            const servicesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setServices(servicesList);
        } catch (error) {
            console.error("Error fetching services:", error);
            Alert.alert("Error", "Failed to load services. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleServicePress = (service) => {
        navigation.navigate("BookService", { service, businessId });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading services...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Available Services</Text>
            {services.length > 0 ? (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ServiceCard
                            service={item}
                            onPress={() => handleServicePress(item)}
                        />
                    )}
                    contentContainerStyle={styles.servicesContainer}
                />
            ) : (
                <Text style={styles.noServicesText}>No services available</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 16,
        marginHorizontal: 16,
    },
    servicesContainer: {
        padding: 16,
    },
    noServicesText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "#666",
    },
});

export default ServicesScreen;

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const ServicesScreen = ({ navigation }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const servicesRef = collection(db, "services");
            const q = query(servicesRef, where("isActive", "==", true));
            const querySnapshot = await getDocs(q);

            const servicesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setServices(servicesList);
        } catch (error) {
            console.error("Error fetching services:", error);
            Alert.alert("Error", "Failed to load services");
        }
    };

    const handleServicePress = (service) => {
        navigation.navigate("BookService", { service });
    };

    const renderServiceItem = ({ item }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => handleServicePress(item)}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.serviceImage}
            />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>
                    ${item.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={renderServiceItem}
                numColumns={2}
                contentContainerStyle={styles.servicesContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    servicesContainer: {
        padding: 16,
    },
    serviceCard: {
        width: "48%",
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    serviceImage: {
        width: "100%",
        height: 120,
    },
    serviceInfo: {
        padding: 12,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 16,
        color: "#FF8C00",
        fontWeight: "bold",
    },
});

export default ServicesScreen;

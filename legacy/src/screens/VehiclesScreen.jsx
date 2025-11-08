import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const VehiclesScreen = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const vehiclesRef = collection(db, "vehicles");
            const q = query(vehiclesRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const vehicleList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setVehicles(vehicleList);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            Alert.alert("Error", "Failed to load vehicles. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderVehicleItem = ({ item }) => (
        <TouchableOpacity style={styles.vehicleItem}>
            <MaterialCommunityIcons
                name="car"
                size={24}
                color="#FF8C00"
                style={styles.vehicleIcon}
            />
            <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                    {item.year} {item.make} {item.model}
                </Text>
                <Text style={styles.vehiclePlate}>{item.plateNumber}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text style={styles.loadingText}>Loading vehicles...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Vehicles</Text>
            {vehicles.length > 0 ? (
                <FlatList
                    data={vehicles}
                    renderItem={renderVehicleItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noVehiclesText}>
                    No vehicles found. Add a vehicle to get started!
                </Text>
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddVehicle")}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add New Vehicle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        color: "#666",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    listContainer: {
        flexGrow: 1,
    },
    vehicleItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleIcon: {
        marginRight: 15,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    vehiclePlate: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    noVehiclesText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF8C00",
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default VehiclesScreen;

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const bookingsRef = collection(db, "bookings");
            const q = query(bookingsRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const bookingsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setBookings(bookingsList);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            Alert.alert("Error", "Failed to load bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderBookingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bookingItem}
            onPress={() =>
                navigation.navigate("BookingDetails", { bookingId: item.id })
            }
        >
            <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="#FF8C00"
                style={styles.bookingIcon}
            />
            <View style={styles.bookingInfo}>
                <Text style={styles.bookingService}>{item.serviceName}</Text>
                <Text style={styles.bookingDate}>
                    {new Date(item.scheduledDate.toDate()).toLocaleString()}
                </Text>
                <Text style={styles.bookingStatus}>{item.status}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            {bookings.length > 0 ? (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noBookingsText}>
                    No bookings found. Book a service to get started!
                </Text>
            )}
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
    bookingItem: {
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
    bookingIcon: {
        marginRight: 15,
    },
    bookingInfo: {
        flex: 1,
    },
    bookingService: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    bookingDate: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    bookingStatus: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FF8C00",
        marginTop: 5,
    },
    noBookingsText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 20,
    },
});

export default BookingsScreen;

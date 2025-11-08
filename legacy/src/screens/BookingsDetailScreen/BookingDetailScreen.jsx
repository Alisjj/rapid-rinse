import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const BookingDetailScreen = ({ route }) => {
    const { bookingId } = route.params;
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
            if (!bookingDoc.exists()) {
                Alert.alert("Error", "Booking not found");
                navigation.goBack();
                return;
            }

            const bookingData = bookingDoc.data();
            // Fetch related data
            const [serviceDoc, vehicleDoc, washerDoc] = await Promise.all([
                getDoc(doc(db, "services", bookingData.serviceId)),
                getDoc(doc(db, "vehicles", bookingData.vehicleId)),
                bookingData.washerId
                    ? getDoc(doc(db, "washers", bookingData.washerId))
                    : null,
            ]);

            setBooking({
                id: bookingDoc.id,
                ...bookingData,
                service: serviceDoc.data(),
                vehicle: vehicleDoc.data(),
                washer: washerDoc?.data(),
            });
        } catch (error) {
            console.error("Error fetching booking details:", error);
            Alert.alert("Error", "Failed to load booking details");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "#FFA500",
            approved: "#4CAF50",
            "in-progress": "#2196F3",
            completed: "#4CAF50",
            cancelled: "#F44336",
        };
        return colors[status] || "#999";
    };

    const handleCancelBooking = async () => {
        Alert.alert(
            "Cancel Booking",
            "Are you sure you want to cancel this booking?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await updateDoc(doc(db, "bookings", bookingId), {
                                status: "cancelled",
                                updatedAt: new Date(),
                            });
                            await fetchBookingDetails();
                            Alert.alert(
                                "Success",
                                "Booking cancelled successfully"
                            );
                        } catch (error) {
                            console.error("Error cancelling booking:", error);
                            Alert.alert("Error", "Failed to cancel booking");
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8C00" />
                <Text>Loading booking details...</Text>
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Booking not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: getStatusColor(booking.status),
                        },
                    ]}
                >
                    <Text style={styles.statusText}>{booking.status}</Text>
                </View>
                <Text style={styles.bookingId}>
                    Booking #{booking.id.slice(-6)}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Service Details</Text>
                <View style={styles.serviceCard}>
                    <Image
                        source={{ uri: booking.service.imageUrl }}
                        style={styles.serviceImage}
                    />
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>
                            {booking.service.name}
                        </Text>
                        <Text style={styles.servicePrice}>
                            ${booking.amount.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule</Text>
                <View style={styles.infoCard}>
                    <MaterialCommunityIcons
                        name="calendar"
                        size={24}
                        color="#FF8C00"
                    />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Date & Time</Text>
                        <Text style={styles.infoValue}>
                            {format(
                                booking.scheduledDate.toDate(),
                                "MMMM dd, yyyy hh:mm a"
                            )}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehicle</Text>
                <View style={styles.infoCard}>
                    <MaterialCommunityIcons
                        name="car"
                        size={24}
                        color="#FF8C00"
                    />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoValue}>
                            {booking.vehicle.year} {booking.vehicle.make}{" "}
                            {booking.vehicle.model}
                        </Text>
                        <Text style={styles.infoLabel}>
                            {booking.vehicle.plateNumber}
                        </Text>
                    </View>
                </View>
            </View>

            {booking.washer && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Washer</Text>
                    <View style={styles.infoCard}>
                        <MaterialCommunityIcons
                            name="account"
                            size={24}
                            color="#FF8C00"
                        />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoValue}>
                                {booking.washer.fullName}
                            </Text>
                            <Text style={styles.infoLabel}>
                                {booking.washer.phone}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {booking.status === "pending" && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelBooking}
                >
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default BookingDetailScreen;

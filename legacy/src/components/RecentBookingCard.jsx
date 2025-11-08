import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, CardContent } from "../components/ui/card";
import { Text } from "../components/ui/text";

const RecentBookingCard = ({ booking }) => {
    const navigation = useNavigation();

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "#4CAF50";
            case "pending":
                return "#FFC107";
            case "cancelled":
                return "#F44336";
            default:
                return "#757575";
        }
    };

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("BookingDetails", { bookingId: booking.id })
            }
        >
            <Card style={styles.card}>
                <CardContent>
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={styles.serviceName}>
                                {booking.serviceName}
                            </Text>
                            <Text style={styles.dateTime}>
                                {new Date(
                                    booking.scheduledDate.toDate()
                                ).toLocaleString()}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: getStatusColor(
                                        booking.status
                                    ),
                                },
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {booking.status}
                            </Text>
                        </View>
                    </View>
                </CardContent>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
    },
    dateTime: {
        fontSize: 14,
        color: "#666666",
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default RecentBookingCard;

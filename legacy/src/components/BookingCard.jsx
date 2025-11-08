import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";

const BookingCard = ({ booking, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
                <Text
                    style={[
                        styles.status,
                        { color: getStatusColor(booking.status) },
                    ]}
                >
                    {booking.status}
                </Text>
            </View>
            <Text style={styles.businessName}>{booking.businessName}</Text>
            <Text style={styles.dateTime}>
                {format(new Date(booking.scheduledDate), "PPP p")}
            </Text>
        </TouchableOpacity>
    );
};

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

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
    },
    businessName: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    dateTime: {
        fontSize: 14,
        color: "#999",
    },
});

export default BookingCard;

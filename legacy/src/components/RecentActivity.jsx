import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";

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

const ActivityCard = ({ booking, onPress }) => (
    <TouchableOpacity
        style={styles.activityCard}
        onPress={() => onPress(booking)}
    >
        <View style={styles.activityHeader}>
            <View
                style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) },
                ]}
            >
                <Text style={styles.statusText}>{booking.status}</Text>
            </View>
            {booking.status === "completed" && (
                <View style={styles.approvalBadge}>
                    <Text style={styles.approvalText}>Approved</Text>
                </View>
            )}
        </View>
        <Text style={styles.serviceTitle}>{booking.service?.name}</Text>
        <View style={styles.activityDetails}>
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Serviced By</Text>
                <Text style={styles.detailValue}>
                    {booking.washer?.fullName || "Unassigned"}
                </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                    {format(booking.scheduledDate.toDate(), "dd/MM/yyyy")}
                </Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>
                    ${booking.amount.toFixed(2)}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

export const RecentActivity = ({ bookings, onViewAll, onBookingPress }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={onViewAll}>
                <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
        </View>
        {bookings.map((booking) => (
            <ActivityCard
                key={booking.id}
                booking={booking}
                onPress={onBookingPress}
            />
        ))}
    </View>
);

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    viewAllButton: {
        fontSize: 14,
        color: "#FF8C00",
        fontWeight: "600",
    },
    activityCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },
    approvalBadge: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    approvalText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    activityDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "600",
    },
    verticalDivider: {
        width: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 8,
    },
});

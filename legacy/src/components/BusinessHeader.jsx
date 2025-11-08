import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BusinessHeader = ({ business, isOpenNow }) => (
    <View>
        <View style={styles.headerContainer}>
            <Text style={styles.businessName}>{business.name}</Text>
            <View style={styles.statusContainer}>
                <View
                    style={[
                        styles.statusIndicator,
                        {
                            backgroundColor: isOpenNow ? "#4CAF50" : "#FF5252",
                        },
                    ]}
                />
                <Text style={styles.statusText}>
                    {isOpenNow ? "Open Now" : "Closed"}
                </Text>
            </View>
        </View>

        <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.rating}>{business.rating.toFixed(1)}</Text>
            <Text style={styles.totalRatings}>
                ({business.totalRatings} reviews)
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    businessName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: "#666",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    rating: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#333",
    },
    totalRatings: {
        fontSize: 14,
        color: "#666",
        marginLeft: 4,
    },
});

export default BusinessHeader;

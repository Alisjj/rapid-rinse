import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BusinessCard = ({ business, onPress }) => (
    <TouchableOpacity style={styles.businessCard} onPress={onPress}>
        <Image
            source={{ uri: business.images[0] }}
            style={styles.businessImage}
        />
        <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{business.name}</Text>
            <View style={styles.businessDetails}>
                <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#FFD700"
                    />
                    <Text style={styles.rating}>
                        {business.rating.toFixed(1)}
                    </Text>
                </View>
                <Text style={styles.distance}>
                    {business.distance.toFixed(1)} km
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

export const NearbyBusinesses = ({ businesses, onViewAll, navigation }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Car Washes</Text>
            <TouchableOpacity onPress={onViewAll}>
                <Text style={styles.viewAllButton}>View Map</Text>
            </TouchableOpacity>
        </View>
        {businesses.length > 0 ? (
            <FlatList
                data={businesses}
                renderItem={({ item }) => (
                    <BusinessCard
                        business={item}
                        onPress={() =>
                            navigation.navigate("BusinessDetails", {
                                businessId: item.id,
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.businessesScroll}
            />
        ) : (
            <View style={styles.noBusinessContainer}>
                <Text style={styles.noBusinessText}>
                    No car washes found nearby
                </Text>
            </View>
        )}
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
    businessesScroll: {
        paddingLeft: 16,
    },
    businessCard: {
        width: 200,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginRight: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    businessImage: {
        width: "100%",
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    businessInfo: {
        padding: 12,
    },
    businessName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    businessDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        marginLeft: 4,
        fontSize: 14,
        color: "#666",
    },
    distance: {
        fontSize: 14,
        color: "#666",
    },
    noBusinessContainer: {
        padding: 16,
        alignItems: "center",
    },
    noBusinessText: {
        fontSize: 16,
        color: "#666",
    },
});

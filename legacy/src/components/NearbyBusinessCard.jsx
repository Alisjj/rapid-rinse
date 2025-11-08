import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, CardContent } from "../components/ui/card";
import { Text } from "../components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NearbyBusinessCard = ({ business }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("BusinessDetails", {
                    businessId: business.id,
                })
            }
        >
            <Card style={styles.card}>
                <CardContent>
                    <View style={styles.cardContent}>
                        <Image
                            source={{ uri: business.imageUrl }}
                            style={styles.businessImage}
                        />
                        <View style={styles.businessInfo}>
                            <Text style={styles.businessName}>
                                {business.name}
                            </Text>
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons
                                    name="star"
                                    size={16}
                                    color="#FFD700"
                                />
                                <Text style={styles.rating}>
                                    {business.rating.toFixed(1)}
                                </Text>
                                <Text style={styles.reviewCount}>
                                    ({business.reviewCount} reviews)
                                </Text>
                            </View>
                            <Text style={styles.address} numberOfLines={1}>
                                {business.address}
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
        alignItems: "center",
    },
    businessImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    businessInfo: {
        flex: 1,
    },
    businessName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 12,
        color: "#666666",
        marginLeft: 4,
    },
    address: {
        fontSize: 14,
        color: "#666666",
        marginTop: 4,
    },
});

export default NearbyBusinessCard;

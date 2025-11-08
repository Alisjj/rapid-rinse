import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const ServiceCard = ({ service, onPress }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
        <Image
            source={{ uri: service.imageUrl }}
            style={styles.serviceImage}
            resizeMode="cover"
        />
        <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
            </Text>
            <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    serviceCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    serviceImage: {
        width: "100%",
        height: 150,
    },
    serviceInfo: {
        padding: 16,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    serviceDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF8C00",
    },
});

export default ServiceCard;

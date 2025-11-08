import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";

const ServiceCard = ({ service, onPress }) => (
    <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => onPress(service)}
    >
        <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
        <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
        </View>
    </TouchableOpacity>
);

export const Services = ({ services, onViewAll, onServicePress }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RapidRinse Services</Text>
            <TouchableOpacity onPress={onViewAll}>
                <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={services}
            renderItem={({ item }) => (
                <ServiceCard service={item} onPress={onServicePress} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
        />
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
    servicesScroll: {
        paddingLeft: 16,
    },
    serviceCard: {
        width: 160,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginRight: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: "hidden",
    },
    serviceImage: {
        width: "100%",
        height: 100,
    },
    serviceInfo: {
        padding: 12,
    },
    serviceName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 14,
        color: "#FF8C00",
        fontWeight: "600",
    },
});

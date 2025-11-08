import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    serviceImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF8C00",
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    featureText: {
        fontSize: 16,
        color: "#333",
    },
    section: {
        marginBottom: 16,
    },
    vehicleCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        minWidth: 120,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedVehicle: {
        borderColor: "#FF8C00",
        borderWidth: 2,
    },
    vehicleName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    vehiclePlate: {
        fontSize: 14,
        color: "#666",
    },
    addVehicleCard: {
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        padding: 12,
        minWidth: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    addVehicleText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    dateButton: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    bookButton: {
        backgroundColor: "#FF8C00",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
    },
    bookButtonDisabled: {
        opacity: 0.5,
    },
    bookButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default styles;

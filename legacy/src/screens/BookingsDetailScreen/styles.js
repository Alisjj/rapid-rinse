import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    bookingId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    section: {
        backgroundColor: "#fff",
        marginTop: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    serviceCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
    },
    serviceImage: {
        width: 80,
        height: 80,
    },
    serviceInfo: {
        flex: 1,
        padding: 12,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 16,
        color: "#FF8C00",
        fontWeight: "bold",
    },
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 12,
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: "#666",
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    cancelButton: {
        backgroundColor: "#F44336",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        margin: 16,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default styles;

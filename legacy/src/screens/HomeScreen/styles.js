import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    logo: {
        height: 30,
        width: 120,
    },
    content: {
        flex: 1,
    },
    welcomeBanner: {
        backgroundColor: "#000",
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    welcomeTextContainer: {
        flex: 1,
    },
    greeting: {
        color: "#FF8C00",
        fontSize: 16,
    },
    welcomeMessage: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 4,
    },
    carImage: {
        width: 120,
        height: 60,
    },
    searchContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        overflow: "hidden",
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    searchButton: {
        padding: 12,
        backgroundColor: "#f5f5f5",
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    viewAllButton: {
        color: "#FF8C00",
    },
    activityCard: {
        backgroundColor: "#FFF9E5",
        borderRadius: 12,
        padding: 16,
    },
    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statusBadge: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
    },
    approvalBadge: {
        backgroundColor: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    approvalText: {
        color: "#fff",
        fontSize: 12,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    activityDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#666",
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "500",
        marginTop: 4,
    },
    verticalDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "#ddd",
        marginHorizontal: 12,
    },
    servicesScroll: {
        marginLeft: -16,
    },
    serviceCard: {
        width: 140,
        height: 140,
        marginLeft: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    serviceImage: {
        width: "100%",
        height: "100%",
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fff",
    },
    navItem: {
        alignItems: "center",
    },

    businessCard: {
        width: 200,
        backgroundColor: "white",
        borderRadius: 12,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    businessImage: {
        width: "100%",
        height: 120,
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
        fontWeight: "bold",
    },
    distance: {
        color: "#666",
        fontSize: 14,
    },
    businessesScroll: {
        marginTop: 12,
    },
    noBusinessContainer: {
        padding: 20,
        alignItems: "center",
    },
    noBusinessText: {
        color: "#666",
        fontSize: 14,
    },
});

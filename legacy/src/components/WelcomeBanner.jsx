import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const WelcomeBanner = ({ userName }) => (
    <View style={styles.welcomeBanner}>
        <View style={styles.welcomeTextContainer}>
            <Text style={styles.greeting}>Hi {userName || "there"},</Text>
            <Text style={styles.welcomeMessage}>Good Morning</Text>
        </View>
        <Image
            source={require("../../assets/car-silhouette.png")}
            style={styles.carImage}
            resizeMode="contain"
        />
    </View>
);

const styles = StyleSheet.create({
    welcomeBanner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FF8C00",
        padding: 16,
        borderRadius: 12,
        margin: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    welcomeTextContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    welcomeMessage: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 4,
    },
    carImage: {
        width: 100,
        height: 60,
    },
});

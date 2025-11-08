import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export const Header = ({ onLogout, onNotification }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onLogout} style={styles.menuButton}>
            <Feather name="log-out" size={24} color="#FF8C00" />
        </TouchableOpacity>
        <Image
            source={require("../../assets/header-logo.png")}
            style={styles.logo}
            resizeMode="contain"
        />
        <TouchableOpacity
            onPress={onNotification}
            style={styles.notificationButton}
        >
            <Feather name="bell" size={24} color="#FF8C00" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logo: {
        height: 30,
        width: 120,
    },
    menuButton: {
        padding: 8,
    },
    notificationButton: {
        padding: 8,
    },
});

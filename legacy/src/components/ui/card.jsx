import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Card = ({ children, style, ...props }) => (
    <View style={[styles.card, style]} {...props}>
        {children}
    </View>
);

export const CardHeader = ({ children, style, ...props }) => (
    <View style={[styles.cardHeader, style]} {...props}>
        {children}
    </View>
);

export const CardContent = ({ children, style, ...props }) => (
    <View style={[styles.cardContent, style]} {...props}>
        {children}
    </View>
);

export const CardTitle = ({ children, style, ...props }) => (
    <Text style={[styles.cardTitle, style]} {...props}>
        {children}
    </Text>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
});

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const Button = ({
    onPress,
    children,
    variant = "default",
    style,
    ...props
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.button, styles[variant], style]}
        {...props}
    >
        <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    default: {
        backgroundColor: "#FF8C00",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

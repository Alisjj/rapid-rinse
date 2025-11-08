import React from "react";
import { Text as RNText, StyleSheet } from "react-native";

export const Text = ({ children, style, ...props }) => (
    <RNText style={[styles.text, style]} {...props}>
        {children}
    </RNText>
);

const styles = StyleSheet.create({
    text: {
        color: "#333333",
        fontSize: 16,
    },
});

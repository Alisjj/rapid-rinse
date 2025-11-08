import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = ({ route }) => {
    const auth = getAuth();
    const navigation = useNavigation();
    const { user } = route.params || {};

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Navigation will be handled by the App.js component
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Name: {user?.fullName || "Not available"}
                </Text>
                <Text style={styles.infoText}>
                    Email: {user?.email || "Not available"}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
            >
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    infoContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: "#333",
    },
    signOutButton: {
        backgroundColor: "#FF8C00",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    signOutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileScreen;

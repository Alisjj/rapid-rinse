import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Footer() {
    const navigation = useNavigation();
    const route = useRoute();

    const navigationItems = [
        { name: "Home", icon: "home", screen: "Home" },
        { name: "History", icon: "history", screen: "History" },
        { name: "Cars", icon: "car", screen: "Cars" },
        { name: "Profile", icon: "account", screen: "Profile" },
    ];

    return (
        <View style={styles.bottomNav}>
            {navigationItems.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    style={styles.navItem}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color={route.name === item.screen ? "#FF8C00" : "#666"}
                    />
                    <Text
                        style={[
                            styles.navLabel,
                            {
                                color:
                                    route.name === item.screen
                                        ? "#FF8C00"
                                        : "#666",
                            },
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    navItem: {
        alignItems: "center",
    },
    navLabel: {
        fontSize: 12,
        marginTop: 4,
    },
});

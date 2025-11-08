import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search businesses..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
            >
                <Feather name="search" size={20} color="#FF8C00" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        marginHorizontal: 16,
        marginVertical: 16,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    searchButton: {
        padding: 8,
    },
});

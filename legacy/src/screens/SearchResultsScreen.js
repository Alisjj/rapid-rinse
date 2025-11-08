import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import {
    collection,
    query,
    getDocs,
    where,
    startAt,
    endAt,
} from "firebase/firestore";
import { db } from "../firebase/config";

const SearchResultsScreen = ({ route, navigation }) => {
    const { query: searchQuery } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState(searchQuery);

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    const fetchSearchResults = async () => {
        try {
            const servicesRef = collection(db, "services");
            const q = query(
                servicesRef,
                where("name", ">=", searchQuery),
                where("name", "<=", searchQuery + "\uf8ff"),
                where("isActive", "==", true)
            );

            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
            Alert.alert("Error", "Failed to load search results");
        }
    };

    const handleServicePress = (service) => {
        navigation.navigate("BookService", { service });
    };

    const handleSearch = () => {
        navigation.replace("SearchResults", { query: searchText });
    };

    const renderServiceItem = ({ item }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => handleServicePress(item)}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.serviceImage}
            />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>
                    ${item.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search services"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={renderServiceItem}
                numColumns={2}
                contentContainerStyle={styles.servicesContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginVertical: 16,
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
        backgroundColor: "#FF8C00",
    },
    searchButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    servicesContainer: {
        padding: 16,
    },
    serviceCard: {
        width: "48%",
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    serviceImage: {
        width: "100%",
        height: 120,
    },
    serviceInfo: {
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
});

export default SearchResultsScreen;

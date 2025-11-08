import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Alert,
    RefreshControl,
} from "react-native";
import { Header } from "../../components/Header";
import { WelcomeBanner } from "../../components/WelcomeBanner";
import { NearbyBusinesses } from "../../components/NearbyBusinesses";
import { RecentActivity } from "../../components/RecentActivity";
import { SearchBar } from "../../components/SearchBar";
import {
    fetchUserData,
    fetchRecentBookings,
    fetchNearbyBusinesses,
} from "../../utils/dataFetchers";
import { initializeLocation } from "../../utils/locationUtils";

const HomeScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        setRefreshing(true);
        try {
            const [user, bookings, location] = await Promise.all([
                fetchUserData(),
                fetchRecentBookings(),
                initializeLocation(),
            ]);
            setUserData(user);
            setRecentBookings(bookings);
            const businesses = await fetchNearbyBusinesses(location);
            setNearbyBusinesses(businesses);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [user, bookings, location] = await Promise.all([
                    fetchUserData(),
                    fetchRecentBookings(),
                    initializeLocation(),
                ]);
                setUserData(user);
                setRecentBookings(bookings);
                const businesses = await fetchNearbyBusinesses(location);
                setNearbyBusinesses(businesses);
            } catch (error) {
                console.error("Error loading data:", error);
                Alert.alert("Error", "Failed to load data");
            }
        };

        loadData();
    }, []);

    const handleLogout = async () => {
        // Implement logout logic
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header onLogout={handleLogout} onNotification={() => {}} />
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadData}
                    />
                }
            >
                <WelcomeBanner userName={userData?.fullName?.split(" ")[0]} />
                <SearchBar
                    onSearch={(query) => {
                        // Implement search functionality here
                        console.log("Searching for:", query);
                    }}
                />
                <NearbyBusinesses
                    businesses={nearbyBusinesses}
                    onViewAll={() => navigation.navigate("NearbyBusinesses")}
                    navigation={navigation}
                />
                <RecentActivity
                    bookings={recentBookings}
                    onViewAll={() => navigation.navigate("Bookings")}
                    onBookingPress={(booking) =>
                        navigation.navigate("BookingDetails", {
                            bookingId: booking.id,
                        })
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        backgroundColor: "#F5F5F5",
    },
    content: {
        flex: 1,
    },
});

export default HomeScreen;

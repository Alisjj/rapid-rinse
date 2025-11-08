import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
} from "react-native";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const BookServiceScreen = ({ route }) => {
    const { service, businessId } = route.params;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [userVehicles, setUserVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserVehicles();
    }, []);

    const fetchUserVehicles = async () => {
        try {
            const userId = auth.currentUser.uid;
            const vehiclesRef = collection(db, "vehicles");
            const q = query(vehiclesRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const vehicles = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setUserVehicles(vehicles);
            if (vehicles.length > 0) {
                setSelectedVehicle(vehicles[0]);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            Alert.alert("Error", "Failed to load vehicles");
        }
    };

    const handleDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === "ios");
        if (date) {
            setSelectedDate(date);
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleBooking = async () => {
        if (!selectedVehicle) {
            Alert.alert("Error", "Please select a vehicle");
            return;
        }

        setIsLoading(true);

        try {
            const bookingData = {
                userId: auth.currentUser.uid,
                serviceId: service.id,
                businessId: businessId,
                vehicleId: selectedVehicle.id,
                status: "pending",
                scheduledDate: selectedDate,
                amount: service.price,
                paymentStatus: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const docRef = await addDoc(
                collection(db, "bookings"),
                bookingData
            );
            Alert.alert("Success", "Booking created successfully!", [
                {
                    text: "View Booking",
                    onPress: () =>
                        navigation.replace("BookingDetails", {
                            bookingId: docRef.id,
                        }),
                },
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error("Error creating booking:", error);
            Alert.alert("Error", "Failed to create booking");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: service.imageUrl }}
                style={styles.serviceImage}
            />

            <View style={styles.content}>
                <Text style={styles.title}>{service.name}</Text>
                <Text style={styles.price}>${service.price.toFixed(2)}</Text>
                <Text style={styles.description}>{service.description}</Text>

                <View style={styles.featuresContainer}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    {service.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Text style={styles.featureText}>• {feature}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Vehicle</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {userVehicles.map((vehicle) => (
                            <TouchableOpacity
                                key={vehicle.id}
                                style={[
                                    styles.vehicleCard,
                                    selectedVehicle?.id === vehicle.id &&
                                        styles.selectedVehicle,
                                ]}
                                onPress={() => setSelectedVehicle(vehicle)}
                            >
                                <Text style={styles.vehicleName}>
                                    {vehicle.year} {vehicle.make}{" "}
                                    {vehicle.model}
                                </Text>
                                <Text style={styles.vehiclePlate}>
                                    {vehicle.plateNumber}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.addVehicleCard}
                            onPress={() => navigation.navigate("AddVehicle")}
                        >
                            <Text style={styles.addVehicleText}>
                                + Add Vehicle
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date & Time</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={showDatepicker}
                    >
                        <Text style={styles.dateText}>
                            {format(selectedDate, "MMMM dd, yyyy hh:mm a")}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={selectedDate}
                        mode="datetime"
                        is24Hour={false}
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        isLoading && styles.bookButtonDisabled,
                    ]}
                    onPress={handleBooking}
                    disabled={isLoading}
                >
                    <Text style={styles.bookButtonText}>
                        {isLoading ? "Creating Booking..." : "Book Now"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default BookServiceScreen;

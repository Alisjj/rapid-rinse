import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from "react-native";
import { db, auth } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const AddVehicleScreen = ({ navigation }) => {
    const [vehicle, setVehicle] = useState({
        make: "",
        model: "",
        year: "",
        plateNumber: "",
        type: "",
        photoUri: null,
    });

    const handleInputChange = (name, value) => {
        setVehicle((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { make, model, year, plateNumber, type } = vehicle;
        if (!make || !model || !year || !plateNumber || !type) {
            Alert.alert("Error", "Please fill in all fields");
            return false;
        }
        if (isNaN(year) || year.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit year");
            return false;
        }
        return true;
    };

    const handleAddVehicle = async () => {
        if (!validateForm()) return;

        try {
            const vehicleData = {
                userId: auth.currentUser.uid,
                ...vehicle,
                year: parseInt(vehicle.year),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await addDoc(collection(db, "vehicles"), vehicleData);
            Alert.alert("Success", "Vehicle added successfully", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error("Error adding vehicle:", error);
            Alert.alert("Error", "Failed to add vehicle. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Make"
                value={vehicle.make}
                onChangeText={(text) => handleInputChange("make", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Model"
                value={vehicle.model}
                onChangeText={(text) => handleInputChange("model", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Year"
                value={vehicle.year}
                onChangeText={(text) => handleInputChange("year", text)}
                keyboardType="numeric"
                maxLength={4}
            />
            <TextInput
                style={styles.input}
                placeholder="Plate Number"
                value={vehicle.plateNumber}
                onChangeText={(text) => handleInputChange("plateNumber", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Type"
                value={vehicle.type}
                onChangeText={(text) => handleInputChange("type", text)}
            />
            {vehicle.photoUri && (
                <Image
                    source={{ uri: vehicle.photoUri }}
                    style={styles.photo}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddVehicle}
            >
                <Text style={styles.addButtonText}>Add Vehicle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    photo: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        marginBottom: 15,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: "#FF8C00",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default AddVehicleScreen;

import { Platform } from "react-native";
import * as Location from "expo-location";

export const initializeLocation = async () => {
    try {
        const fallbackLocation = {
            latitude: 37.78825,
            longitude: -122.4324,
        };

        if (Platform.OS === "web") {
            if ("geolocation" in navigator) {
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            resolve(location);
                        },
                        (error) => {
                            console.log("Geolocation error:", error);
                            resolve(fallbackLocation);
                        }
                    );
                });
            } else {
                return fallbackLocation;
            }
        } else {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Location permission denied");
                return fallbackLocation;
            }

            const position = await Location.getCurrentPositionAsync({});
            return {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
        }
    } catch (error) {
        console.error("Location initialization error:", error);
        return {
            latitude: 37.78825,
            longitude: -122.4324,
        };
    }
};

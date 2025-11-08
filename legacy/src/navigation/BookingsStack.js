import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BookingsScreen, BookingDetailScreen } from "../screens";

const Stack = createStackNavigator();

const BookingsStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Bookings"
            component={BookingsScreen}
            options={{
                title: "My Bookings",
                headerStyle: {
                    backgroundColor: "#FF8C00",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        />
        <Stack.Screen
            name="BookingDetails"
            component={BookingDetailScreen}
            options={{
                title: "Booking Details",
                headerStyle: {
                    backgroundColor: "#FF8C00",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        />
    </Stack.Navigator>
);

export default BookingsStack;

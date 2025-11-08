import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { VehiclesScreen, AddVehicleScreen } from "../screens";

const Stack = createStackNavigator();

const VehiclesStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Vehicles"
            component={VehiclesScreen}
            options={{
                title: "My Vehicles",
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
            name="AddVehicle"
            component={AddVehicleScreen}
            options={{
                title: "Add Vehicle",
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

export default VehiclesStack;

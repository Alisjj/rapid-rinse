import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import BookingsStack from "./BookingsStack";
import VehiclesStack from "./VehiclesStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

const MainTabs = ({ user }) => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "HomeTab") {
                    iconName = focused ? "home" : "home-outline";
                } else if (route.name === "BookingsTab") {
                    iconName = focused
                        ? "calendar-check"
                        : "calendar-check-outline";
                } else if (route.name === "VehiclesTab") {
                    iconName = focused ? "car" : "car-outline";
                } else if (route.name === "ProfileTab") {
                    iconName = focused ? "account" : "account-outline";
                }

                return (
                    <MaterialCommunityIcons
                        name={iconName}
                        size={size}
                        color={color}
                    />
                );
            },
            tabBarActiveTintColor: "#FF8C00",
            tabBarInactiveTintColor: "#666",
            tabBarStyle: {
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderTopColor: "#e0e0e0",
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "600",
            },
        })}
    >
        <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{
                title: "Home",
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="BookingsTab"
            component={BookingsStack}
            options={{
                title: "Bookings",
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="VehiclesTab"
            component={VehiclesStack}
            options={{
                title: "Vehicles",
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="ProfileTab"
            component={ProfileStack}
            initialParams={{ user }}
            options={{
                title: "Profile",
                headerShown: false,
            }}
        />
    </Tab.Navigator>
);

export default MainTabs;

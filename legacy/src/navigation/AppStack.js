import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import {
    HomeScreen,
    BookingDetailScreen,
    ServicesScreen,
    BookServiceScreen,
    Bookings,
    NearbyBusinessesScreen,
    BusinessDetailScreen,
    ProfileScreen,
    VehiclesScreen,
} from "../screens";

import Footer from "../components/Footer";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({ extraData }) => (
    <Stack.Navigator>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} extraData={extraData} />}
        </Stack.Screen>
        <Stack.Screen name="BookingDetails">
            {(props) => (
                <BookingDetailScreen {...props} extraData={extraData} />
            )}
        </Stack.Screen>
        <Stack.Screen name="Services">
            {(props) => <ServicesScreen {...props} extraData={extraData} />}
        </Stack.Screen>
        <Stack.Screen name="BookService">
            {(props) => <BookServiceScreen {...props} extraData={extraData} />}
        </Stack.Screen>
        <Stack.Screen name="NearbyBusinesses">
            {(props) => (
                <NearbyBusinessesScreen {...props} extraData={extraData} />
            )}
        </Stack.Screen>
        <Stack.Screen name="BusinessDetails">
            {(props) => (
                <BusinessDetailScreen {...props} extraData={extraData} />
            )}
        </Stack.Screen>
    </Stack.Navigator>
);

// options={{
//             tabBarShowLabel: false,
//             tabBarButton: (props) => (
//               <TabButton
//                 icon={icon}
//                 title={title}
//                 accessibilityState={props.accessibilityState}
//                 onPress={props.onPress}
//                 focusedIcon={focusedIcon}
//               />
//             ),
//           }}

const AppStack = ({ extraData }) => (
    <Tab.Navigator
        tabBar={(props) => <Footer {...props} />}
        screenOptions={{
            headerShown: false,
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeStack}
            initialParams={{ extraData }}
        />
        <Tab.Screen
            name="History"
            component={Bookings}
            initialParams={{ extraData }}
        />
        <Tab.Screen
            name="Cars"
            component={VehiclesScreen}
            initialParams={{ extraData }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ extraData }}
        />
    </Tab.Navigator>
);

export default AppStack;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProfileScreen } from "../screens/";

const Stack = createStackNavigator();

const ProfileStack = ({ route }) => {
    const { user } = route.params || {};

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ user }}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;

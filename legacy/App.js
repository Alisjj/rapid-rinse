import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AuthStack from "./src/navigation/AuthStack";
import MainTabs from "./src/navigation/MainTabs";
import LoadingScreen from "./src/screens/LoadScreen/LoadScreen";

const auth = getAuth();
const db = getFirestore();

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(
                        doc(db, "users", firebaseUser.uid)
                    );
                    if (userDoc.exists()) {
                        setUser({ ...userDoc.data(), id: firebaseUser.uid });
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
}

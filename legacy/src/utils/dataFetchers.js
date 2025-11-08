import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";

export const fetchUserData = async () => {
    try {
        const userId = auth.currentUser.uid;
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Failed to load user data");
    }
};

export const fetchRecentBookings = async () => {
    try {
        const userId = auth.currentUser.uid;
        const bookingsRef = collection(db, "bookings");
        const q = query(
            bookingsRef,
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(q);
        const bookings = [];

        for (const bookingDoc of querySnapshot.docs) {
            const booking = bookingDoc.data();

            // Fetch related service data
            const serviceDocRef = doc(db, "services", booking.serviceId);
            const serviceDoc = await getDoc(serviceDocRef);

            // Fetch washer data if assigned
            let washerData = null;
            if (booking.washerId) {
                const washerDocRef = doc(db, "washers", booking.washerId);
                const washerDoc = await getDoc(washerDocRef);
                washerData = washerDoc.data();
            }

            bookings.push({
                id: bookingDoc.id,
                ...booking,
                service: serviceDoc.data(),
                washer: washerData,
            });
        }

        return bookings;
    } catch (error) {
        console.error("Error fetching recent bookings:", error);
        throw new Error("Failed to load recent bookings");
    }
};

export const fetchServices = async () => {
    try {
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, where("isActive", "==", true));
        const querySnapshot = await getDocs(q);

        const servicesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return servicesList;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error("Failed to load services");
    }
};

export const fetchNearbyBusinesses = async (location) => {
    try {
        const businessesRef = collection(db, "businesses");
        const q = query(businessesRef, where("isActive", "==", true));

        const querySnapshot = await getDocs(q);
        const businesses = [];

        for (const doc of querySnapshot.docs) {
            const business = doc.data();

            const distance = calculateDistance(
                location.latitude,
                location.longitude,
                business.location.latitude,
                business.location.longitude
            );

            if (distance <= 5) {
                // Within 5km
                businesses.push({
                    id: doc.id,
                    ...business,
                    distance,
                });
            }
        }

        businesses.sort((a, b) => a.distance - b.distance);

        return businesses;
    } catch (error) {
        console.error("Error fetching nearby businesses:", error);
        throw new Error("Failed to load nearby businesses");
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

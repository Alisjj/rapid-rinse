import { doc, setDoc, Timestamp, GeoPoint } from "firebase/firestore";
import { db } from "./firebase/config"; // Adjust the import path based on your project structure

// Function to add a business
export const addBusiness = async (businessId, data) => {
    try {
        const businessRef = doc(db, "businesses", businessId);
        const businessData = {
            id: data.id,
            name: data.name,
            description: data.description,
            address: data.address,
            location: data.location || new GeoPoint(0, 0), // default GeoPoint
            rating: data.rating || 0,
            totalRatings: data.totalRatings || 0,
            operatingHours: data.operatingHours || {},
            services: data.services || [], // array of serviceIds
            images: data.images || [], // array of image URLs
            washers: data.washers || [], // array of washerIds
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        await setDoc(businessRef, businessData);
        console.log("Business added successfully!");
    } catch (error) {
        console.error("Error adding business:", error);
        throw error;
    }
};

// Function to add all businesses
export const addAllData = async () => {
    try {
        // Sample data for businesses
        const businesses = [
            {
                id: "business1",
                name: "Sparkle Car Wash",
                description:
                    "Professional car wash service with eco-friendly products.",
                address: "123 Main Street, Cityville",
                location: new GeoPoint(11.706572, 9.364228),
                rating: 4.5,
                totalRatings: 120,
                operatingHours: {
                    monday: { open: "08:00", close: "18:00" },
                    tuesday: { open: "08:00", close: "18:00" },
                    wednesday: { open: "08:00", close: "18:00" },
                    thursday: { open: "08:00", close: "18:00" },
                    friday: { open: "08:00", close: "18:00" },
                    saturday: { open: "09:00", close: "17:00" },
                    sunday: { open: "09:00", close: "15:00" },
                },
                services: ["service1", "service2", "service3"],
                images: [
                    "https://example.com/image1.jpg",
                    "https://example.com/image2.jpg",
                ],
                washers: ["washer1", "washer2"],
                isActive: true,
            },
            {
                id: "business2",
                name: "Elite Auto Wash",
                description: "Luxury car detailing and washing services.",
                address: "456 Luxury Blvd, Cityville",
                location: new GeoPoint(11.711816, 9.346455),
                rating: 4.8,
                totalRatings: 90,
                operatingHours: {
                    monday: { open: "07:00", close: "19:00" },
                    tuesday: { open: "07:00", close: "19:00" },
                    wednesday: { open: "07:00", close: "19:00" },
                    thursday: { open: "07:00", close: "19:00" },
                    friday: { open: "07:00", close: "19:00" },
                    saturday: { open: "08:00", close: "18:00" },
                    sunday: { open: "08:00", close: "16:00" },
                },
                services: ["service4", "service5"],
                images: [
                    "https://example.com/image3.jpg",
                    "https://example.com/image4.jpg",
                ],
                washers: ["washer3", "washer4"],
                isActive: true,
            },
        ];

        // Add each business
        for (const business of businesses) {
            await addBusiness(business.id, business);
        }

        console.log("All businesses added successfully!");
    } catch (error) {
        console.error("Error adding all businesses:", error);
    }
};

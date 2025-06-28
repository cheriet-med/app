'use client';

import useSWR, { mutate } from "swr"; // Import mutate from swr
import { useSession } from "next-auth/react";

// Define the User interface
interface User {
    full_name: string;
    phoneNumber: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
}

// Fetcher function with proper error handling
const fetcher = async <T>(url: string): Promise<T> => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data. Please try again later.");
    }
};

const useFetcherUser = () => {
    const { data: session, status } = useSession();

    // Use SWR to fetch user data
    const { data, error, isLoading } = useSWR<User | null>(
        session?.user?.id ? `${process.env.NEXT_PUBLIC_URL}infoid/${session.user.id}` : null,
        fetcher<User>
    );

    // Function to manually revalidate the data
    const revalidate = () => {
        if (session?.user?.id) {
            mutate(`${process.env.NEXT_PUBLIC_URL}infoid/${session.user.id}`);
        }
    };

    return { userinfo: data, error, isLoading, revalidate };
};

export default useFetcherUser;
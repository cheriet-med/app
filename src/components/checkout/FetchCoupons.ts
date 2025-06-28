'use client';

import useSWR from "swr";

const fetcher = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  //const timeoutId = setTimeout(() => controller.abort(), 20000); // 10-second timeout

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      signal: controller.signal, // Pass the AbortController signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  } finally {
   // clearTimeout(timeoutId); // Clear the timeout
  }
};

interface Product {
  id: number;
  copon: string;
  productId:string;
  porcentage: string;
  created_at: string;
  expired_at: string;
}


const useFetchCoupons = () => {
  const { data, error, isLoading } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_URL}coponglobal/`,
    fetcher<Product[]>
  );

  return { cop: data || [], error, isLoading };
};

export default useFetchCoupons;
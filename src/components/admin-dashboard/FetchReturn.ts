'use client';

import useSWR from "swr";

const fetcher = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 10-second timeout

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
    clearTimeout(timeoutId); // Clear the timeout
  }
};

interface Product {
  id: number;
  user:number;
  orderID: string;
  status: string;
  application: string;
  description: string;
  created_at: string;
  isviewed: string;
}


const useFetchRturn = () => {
  const { data, error, isLoading } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_URL}returnglobal/`,
    fetcher<Product[]>
  );

  return { Ret: data || [], error, isLoading };
};

export default useFetchRturn;
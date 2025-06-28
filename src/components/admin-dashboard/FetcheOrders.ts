'use client';

import useSWR from "swr";


const fetcher = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
 // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

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
    //clearTimeout(timeoutId); // Clear the timeout
  }
};

interface Post {
  id: number;
  title_en: string;
  title_ar: string;
  title_fr: string;
  title_de: string;
  title_es: string;
  title_it: string;
  title_pt: string;
  title_nl: string;
  title_ru: string;
  title_sv: string;
  image_en: string;
  image_ar: string;
  image_fr: string;
  image_de: string;
  image_es: string;
  image_it: string;
  image_pt: string;
  image_nl: string;
  image_ru: string;
  image_sv: string;
  tag_en: string;
  tag_ar: string;
  tag_fr: string;
  tag_de: string;
  tag_es: string;
  tag_it: string;
  tag_pt: string;
  tag_nl: string;
  tag_ru: string;
  tag_sv: string;
  url_en: string;
  url_ar: string;
  url_fr: string;
  url_de: string;
  url_es: string;
  url_it: string;
  url_pt: string;
  url_nl: string;
  url_ru: string;
  url_sv: string;
  full_name:string;
  address_line_1:string;
  address_line_2:string;
  city:string;
  state:string;
  postalCode:string;
  countryCode:string;
  phoneNumber:string;
  payment_method:string;
  user:number;
  product:number;
  status:string;
  created_at:string;
  updated_at:string;
  size:string;
  color:string;
  quantity:string;
  price:string;
  transation_ID_order:string;
  transation_ID_item:string;
  trakingNumber:string;
  viewed:string;
  dropshippingID:string,
  orderN:string
}

const useFetchOrders = () => {

    
  const { data, error, isLoading } = useSWR<Post[]>(
    `${process.env.NEXT_PUBLIC_URL}order/`,
    fetcher<Post[]>
  );

  return { order: data || [], error, isLoading };
};

export default useFetchOrders;
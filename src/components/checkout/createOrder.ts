"use client";
import { useCart } from "../cart";
import useFetcherUser from "./FtecherUser";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function useGlobalOrder() {
  const { data: session } = useSession();
  const { userinfo } = useFetcherUser();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const l = useLocale();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const handleSubmitOrder = async (transactionID: string, paymentMethod: string) => {
    if (!cart || cart.length === 0) {
      console.error("Cart is empty or not loaded");
      return false;
    }

    if (!session?.user?.id) {
      alert("User not authenticated");
      return false;
    }

    try {
      // Process items one by one
      for (const item of cart) {
        if (!item.productID) {
          console.error("Product ID is missing in cart item:", item);
          continue; // Skip this item but continue with others
        }

        const orderItem = {
          product: item.productID,
          color: item.color || "",
          size: item.size || "",
          quantity: item.quantity || 1,
          price: item.price || 0,
          title_en: item.name_en,
          title_ar: item.name_ar,
          title_de: item.name_de,
          title_es: item.name_es,
          title_fr: item.name_fr,
          title_it: item.name_it,
          title_nl: item.name_nl,
          title_pt: item.name_pt,
          title_ru: item.name_ru,
          title_sv: item.name_sv,
          tag_en: item.tag_en,
          tag_ar: item.tag_ar,
          tag_de: item.tag_de,
          tag_es: item.tag_es,
          tag_fr: item.tag_fr,
          tag_it: item.tag_it,
          tag_nl: item.tag_nl,
          tag_pt: item.tag_pt,
          tag_ru: item.tag_ru,
          tag_sv: item.tag_sv,
          image_en: item.image_en,
          image_ar: item.image_ar,
          image_de: item.image_de,
          image_es: item.image_es,
          image_fr: item.image_fr,
          image_it: item.image_it,
          image_nl: item.image_nl,
          image_pt: item.image_pt,
          image_ru: item.image_ru,
          image_sv: item.image_sv,
          url_en: item.url_en,
          url_ar: item.url_ar,
          url_de: item.url_de,
          url_es: item.url_es,
          url_fr: item.url_fr,
          url_it: item.url_it,
          url_nl: item.url_nl,
          url_pt: item.url_pt,
          url_ru: item.url_ru,
          url_sv: item.url_sv,
          created_at: today,
          user: session.user.id,
          dropshippingID: item.dropshippingID,
          status: "pending",
          transation_ID_order: transactionID,
          transation_ID_item: item.id,
          payment_method: paymentMethod,
          full_name: userinfo?.full_name || "",
          address_line_1: userinfo?.address_line_1 || "",
          address_line_2: userinfo?.address_line_2 || "",
          city: userinfo?.city || "",
          state: userinfo?.state || "",
          postalCode: userinfo?.postalCode || "",
          countryCode: userinfo?.countryCode || "",
          phoneNumber: userinfo?.phoneNumber || "",
          orderN: item.id + transactionID,
          descount: item.discounte
        };

        const orderEmail = {
          name: userinfo?.full_name || "",
          email: "cheriet.imc@gmail.com",
          OrderID: transactionID,
          language: l,
          date_time: today
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}order/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItem),
        });

        const re = await fetch(`${process.env.NEXT_PUBLIC_URL}emailcreateorder/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderEmail),
        });

        const responseText = await response.text();
        
        if (!response.ok) {
          console.error("Error posting item:", responseText);
          throw new Error(`Failed to post item ${item.productID}: ${responseText}`);
        }
      }

      clearCart();
      router.push(`/${l}/account/orders`);
      return true;
    } catch (error) {
      console.error("Error in order submission:", error);
      return false;
    }
  };

  return { handleSubmitOrder };
}

// Example usage in a component:
/*
export function OrderButton({ transactionID, paymentMethod }: { transactionID: string, paymentMethod: string }) {
  const { handleSubmitOrder } = useGlobalOrder();

  return (
    <button 
      onClick={() => handleSubmitOrder(transactionID, paymentMethod)}
      className="text-white cursor-pointer bg-gray-600 w-full p-3 flex justify-center"
    >
      Pay
    </button>
  );
}
*/
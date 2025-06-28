'use client';

import { useState, FormEvent } from 'react';
import type { BTCPayInvoice } from '@/types/btcpay';
import { useTranslations } from "next-intl";
import { FaCircleNotch } from "react-icons/fa";
import { useCart } from "../cart";
import useFetcherUser from "./FtecherUser";
import { useSession } from "next-auth/react";

interface PaymentFormProps {
  onInvoiceCreated?: (invoice: BTCPayInvoice) => void;
}

export default function PaymentForm({ onInvoiceCreated }: PaymentFormProps) {

  const { data: session } = useSession();
  const { userinfo } = useFetcherUser();
  const { cart, getTotalPrice } = useCart();

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });



  const [loading, setLoading] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<BTCPayInvoice | null>(null);
  const t = useTranslations('cart-c')




  const createInvoice = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    if (!cart || cart.length === 0) {
      console.error("Cart is empty or not loaded");
    }
    if (!session?.user?.id) {
      alert("User not authenticated");
    }

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalPrice().toFixed(2),
          currency:"USD",
          itemDesc: "Order Created",
          orderId: `order-${Date.now()}`,
          customerEmail: undefined,
          customerName: userinfo?.full_name ||  undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create invoice');
      }

      const invoiceData: BTCPayInvoice = result.data;
      setInvoice(invoiceData);
      onInvoiceCreated?.(invoiceData);
    
    
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
            user: session?.user?.id ,
            dropshippingID: item.dropshippingID,
            status: "Created",
            transation_ID_order: invoiceData.id,
            transation_ID_item: item.id,
            payment_method: "BTC",
            full_name: userinfo?.full_name || "",
            address_line_1: userinfo?.address_line_1 || "",
            address_line_2: userinfo?.address_line_2 || "",
            city: userinfo?.city || "",
            state: userinfo?.state || "",
            postalCode: userinfo?.postalCode || "",
            countryCode: userinfo?.countryCode || "",
            phoneNumber: userinfo?.phoneNumber || "",
            orderN: item.id + invoiceData.id,
            descount: item.discounte
          };
  
        
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}order/`, {
            method: "POST",
            headers: {
              "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderItem),
          });
       
       
  
          const responseText = await response.text();
          
          if (!response.ok) {
            console.error("Error posting item:", responseText);
            throw new Error(`Failed to post item ${item.productID}: ${responseText}`);
          }
        }
   
      // Redirect to BTCPay checkout

      window.location.href = invoiceData.checkoutLink;



    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(`Failed to create payment invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }






  };

  return (
    <div >
    
      <form onSubmit={createInvoice} className="space-y-4">
          {loading ? 
           <button className="w-full hover:bg-secondary text-white font-bold bg-gray-700 h-10 flex gap-3 justify-center items-center">
           {t('Pay')}
           <FaCircleNotch className="animate-spin w-5 h-5" />
       </button>
          : 
          <button  type="submit"
          disabled={loading} className="w-full hover:bg-secondary text-white font-bold bg-gray-700 h-10">{t('Pay')}</button>
          }
       
      </form>
    </div>
  );
}



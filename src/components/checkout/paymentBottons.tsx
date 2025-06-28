
import { useTranslations } from "next-intl"


import { FaCcMastercard } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { FaCcDiscover } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa6";
import PaymentForm from "./PaymentForm";

export default function Payment() {
    const t = useTranslations('cart-c')


    
    return (
        <div className="space-y-4">
          <h1 className="text-sm font-medium uppercase">{t('shipping-details')}</h1>
          <p className="text-sm text-gray-700">{t('shipping-details-text')}</p>
       <PaymentForm/>
        <div className=" flex flex-wrap  gap-4 items-center justify-center">
                              <FaCcMastercard size={32}/>
                              <FaCcVisa size={32}/>
                              <FaPaypal size={32}/>
                              <FaCcDiscover size={32}/>
                              <FaCcAmex size={32}/>
                              <FaBitcoin size={32}/>
        </div>
        </div>
    )
}

/**
 *     <PayPalCheckout/>
 */
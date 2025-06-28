'use client'

import { useTranslations } from "next-intl"
import { useCart } from "@/components/cart";
import { Link } from "@/i18n/routing";
import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from "next/image";
import { useEffect } from "react";




export default function CartSide () {
    const t = useTranslations('cart-c')
    const { cart, getTotalPrice, getTotalDiscount   } = useCart();
  const l = useLocale();
 

 
    const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];
    const [mounted, setMounted] = useState(false);
   
     useEffect(() => {
       setMounted(true);
     }, []);
      
   
   
     if (!mounted) {
       // Avoid rendering on the server
       return (
           <div className="bg-gray-200 animate-pulse h-80"></div>
       );
     }
    if(!cart) {
        return (
            <div className="bg-gray-200 animate-pulse h-80"></div>
        );
    }
   
    return (
        

                 
                  <div className=" space-y-4 bg-white  px-4 py-6 rounded-md border border-spacing-1" >
                  <div className="flex justify-between items-center">
                     <h1 className="text-xl font-bold uppercase"> {t('Your-order')}</h1>
                    <Link href="/cart">
                     <p className="underline font-medium">{t('Edite')}</p>
                     </Link>
                  </div>
                 
                  <hr className="border-gray-300" />
                  <div className="text-gray-800  space-y-4">
                        <p className="flex flex-wrap gap-4 text-sm">{t('Subtotal')} <span className="ml-auto font-bold">${(getTotalPrice()+getTotalDiscount()).toFixed(2)}</span></p> 
                        <p className="flex flex-wrap gap-4 text-sm">{t('Shipping')} <span className="ml-auto font-bold">$0.00</span></p>
                        <p className="flex flex-wrap gap-4 text-sm">{t('Discount')} <span className="ml-auto font-bold">-${getTotalDiscount().toFixed(2)}</span></p>

                        <hr className="border-gray-300" />
                        <p className="flex flex-wrap gap-4 text-sm font-bold">{t('Total')} <span className="ml-auto">${getTotalPrice().toFixed(2)}</span></p>
                    </div>

                   <hr className="border-gray-300" />
                    {cart?.map((item) => (
                  
                        <div className="flex gap-4" key={item.id}>
                            <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                             <Image
                        
                                        height={200}
                                        width={200}
                                         src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, 'image')}` || ''}
                                        alt={getLocalizedField(item, 'tag') || ''}

                                        priority
                                      />
                              
                            </div>

                            <div className="flex flex-col gap-2">
                                
                                    <h4 className="text-base font-bold text-gray-800 ">{getLocalizedField(item, 'name').slice(0,30)+".."}</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {!item.color ? "":   <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Color')}: {item.color}</p>}
                                         {!item.color ? "":  <p className="text-sm font-semibold text-gray-500 flex items-center ">|</p>}
                                         {!item.size ? "":   <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Size')}: {item.size}</p>}
                                         {!item.size ? "":    <p className="text-sm font-semibold text-gray-500 flex items-center">|</p>}
                                         <p className="text-sm font-semibold text-gray-500  flex items-center gap-2">{t('Quantity')}: {item.quantity}</p>
                                    </div>
                                 
                                 <h3 className="text-base font-bold text-gray-800">${item.price*item.quantity}</h3>
                                

                             
                            </div>
                        </div>

                    

                ))} 
                </div>

              
        
     
)
}




/** <InfoPayment/> */
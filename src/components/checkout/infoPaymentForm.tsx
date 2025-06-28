'use client';

import React from 'react';
import { useTranslations } from "next-intl";
import useFetcherUser from './FtecherUser';
import { Link } from '@/i18n/routing';



export default function InfoPayment() {

  const { userinfo ,isLoading} = useFetcherUser();
  const t = useTranslations('cart-c');

  const SkeletonLoader = () => (
   
          <div>
            <div className="h-96 bg-gray-200 animate-pulse"></div>
           
          </div>
     
  );


if(isLoading){
  return <SkeletonLoader/>
}
  return (
    <div className="space-y-8 mb-8">
     
   
      <div className='flex justify-between flex-wrap items-center'>
       <h1 className="text-xl font-bold uppercase">{t('address-and-contact-title')}</h1> 
<Link href="/cart/checkout" className='underline font-medium'>
  {t('Edite')}
</Link>

      </div>  
       <div className='space-y-2'>

        <h1 className="text-sm font-medium uppercase">{t('shipping-address')}</h1>
     
        <div>
        <p className='text-gray-700'>{userinfo?.full_name }, {userinfo?.phoneNumber}</p>
        <p className='text-gray-700'>{userinfo?.address_line_1}{" "} {userinfo?.address_line_2}, {userinfo?.city}, {userinfo?.state}, {userinfo?.countryCode}, {userinfo?.postalCode}</p>

        </div>

        </div>
      <hr className="border-gray-300" />
      <h1 className="text-xl font-bold uppercase ">{t('payment-and-shipping')}</h1>
     

    </div>
  );
}


/** <OrderButton/>   <Payment/> */
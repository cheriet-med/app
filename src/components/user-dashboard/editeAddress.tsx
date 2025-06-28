'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { useSession} from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import useFetcherUser from '../checkout/FtecherUser';


export default function EditeAddress() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
const { data: session } = useSession({ required: true });
const { userinfo} = useFetcherUser();
  const [address_line_1, setAddress_line_1] = useState(userinfo?.address_line_1);
  const [address_line_2, setAddress_line_2] = useState(userinfo?.address_line_2);
  const [city, setCity] = useState(userinfo?.city);
  const [state, setState] = useState(userinfo?.state);
  const [postalCode, setPostalCode] = useState(userinfo?.postalCode);
  const [countryCode, setCountryCode] = useState(userinfo?.countryCode);
  const [codePhone, setCodePhone] = useState(userinfo?.phoneNumber.slice(0,3));
  const [phone, setPhone] = useState(userinfo?.phoneNumber.slice(3,30));
  const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
 
 
  const [validateaddress, setValidateddress] = useState(false);
  const [validatecity, setValidatecity] = useState(false);
  const [validatestate, setValidatestate] = useState(false);
  const [validatepostalCode, setValidatepostalCode] = useState(false);
  const [validatephone, setValidatephone] = useState(false);
  const [validatecodePhone, setValidatecodePhone] = useState(false);
  const [validatecountryCode, setValidatecountryCode] = useState(false);
  








  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('cart-c');
  const l = useLocale();
    const te = useTranslations('user-dashboard');



  const handleSubscribe = async () => {
   
    if (!address_line_1 ||  !city || !state || !countryCode || !phone || !postalCode || !codePhone) {
      
        setValidatecity(true);// Add a translation key for name error
        setValidatecodePhone(true);
        setValidatecountryCode(true);
        setValidateddress(true);
        setValidatephone(true);
        setValidatepostalCode(true);
        setValidatestate(true);
        return;
      }
     const phoneNumber = codePhone + phone
  
     setIsLoadingg(true);
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          address_line_1,
          address_line_2,
          city,
          state,
          countryCode,
          postalCode,
          phoneNumber
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
  
      return data; // If the returned data is an empty array, email does not exist
    } catch (error) {
      console.error('Error updates', error);
      return false;
    }finally{

      setIsLoadingg(false);
      window.location.reload()
     setIsOpen(false)
      
    }
  };

  // Close the dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the dialog
      }
    };

    // Add event listener when the dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when `isOpen` changes

  return (
    <>
      {/* Button to open the dialog */}
    
      <p className="font-semibold underline text-gray-900 cursor-pointer select-none" onClick={() => setIsOpen(true)}>{te('Edite')}</p>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef} // Attach the ref to the dialog container
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative "
          >
            {/* Close Button */}
            {l === "ar"? (
              <IoMdCloseCircle size={24} className="absolute top-2 left-2 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            ) : (
              <IoMdCloseCircle size={24} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            )}
            
            {/* Content */}
            {isSubscribed ? (
              <div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{te('edite-address')}</h2>
               
               
                {session?.user?
    <div className='space-y-4'>
      <h1 className="text-sm font-medium uppercase">{te('phone-number')}</h1>
          <div className='flex gap-2'>
          <div className='w-36 space-y-2'>
            <input
              type="text"
              value={codePhone}
              onChange={(e) => setCodePhone(e.target.value)}
              placeholder={t('exp')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              pattern="^\+\d{1,4}$"
              required
            />
             {validatecodePhone? <p className='text-bl text-xs sm:text-sm'>{t('enter-code')}</p> :""}
             </div>
             <div className='w-full space-y-2'>
           {l == 'ar' ?    <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              pattern="^\+?[0-9\s\-]{7,15}$"
              required
            dir="rtl"
            /> :  <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            pattern="^\+?[0-9\s\-]{7,15}$"
            required
        
          /> }
             {validatephone? <p className='text-bl text-xs sm:text-sm'>{t('enter-phone')}</p> :""}
             </div>
          </div>
          <h1 className="text-sm font-medium uppercase">{t('shipping-address')}</h1>
          <div className='w-full space-y-2'>
          <input
            type="text"
            value={address_line_1}
            onChange={(e) => setAddress_line_1(e.target.value)}
            placeholder={t('adress-1')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validateaddress? <p className='text-bl text-xs sm:text-sm'>{t('enter-address')}</p> :""}
           </div>
         
          <input
            type="text"
            value={address_line_2}
            onChange={(e) => setAddress_line_2(e.target.value)}
            placeholder={t('adress-2')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
          />
        
           <div className='w-full space-y-2'>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('city')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validatecity? <p className='text-bl text-xs sm:text-sm'>{t('enter-city')}</p> :""}
           </div>
           <div className='w-full space-y-2'>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder={t('state')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validatestate? <p className='text-bl text-xs sm:text-sm'>{t('enter-state')}</p> :""}
           </div>
          <div className=' flex gap-2'>
          <div className='w-full space-y-2'>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder={t('country')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              required
            />
             {validatecountryCode? <p className='text-bl text-xs sm:text-sm'>{t('enter-country')}</p> :""}
             </div>
             <div className='w-full space-y-2'>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder={t('zip')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              required
              pattern="^[A-Za-z0-9\s\-]{4,10}$"
            />
             {validatepostalCode? <p className='text-bl text-xs sm:text-sm'>{t('enter-zip')}</p> :""}
             </div>
          </div>
          </div>
: ""}
<div className='mt-8'> 
    {isLoadingg ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                     {te('Edite')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                   {te('Edite')}
                    </button>
                  )}
</div>
  
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};


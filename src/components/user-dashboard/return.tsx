'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";



export default function ReturnDemand({orderNumber}:{orderNumber:any}) {
  const [isOpen, setIsOpen] = useState(false);

const { data: session } = useSession({ required: true });
const [review, setReview] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(""); // New state for delivery status
  const [type, setType] = useState(""); // New state for delivery status

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('orders');
  const l = useLocale();
  const tm = useTranslations('user-dashboard');
  const te = useTranslations('Login');

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const handleSubscribe = async () => {
  
    if(!review){
      setError('please write a description');
      return;
    }
    if(!type){
      setError('please select application type');
      return;
    }
    if(!deliveryStatus){
      setError('please select delivery status');
      return;
    }
   
    setIsLoading(true);
    
    const orderItem = {
      user: session?.user.id,
      orderID: orderNumber,
      status: deliveryStatus,
      application: type, // Include delivery status in the request
      description: review,
      created_at: today,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}returnglobal/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify(orderItem),
      });

      const rawResponse = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(rawResponse);
        setError(errorData.message || te('Subscription-failed'));
        return;
      }
      
      setIsSubscribed(true);
      setIsOpen(false);
      setError('');
      router.refresh(); 
    } catch (error) {
      console.error(te('Error-uring-subscription'), error);
      setError(te('Network-error'));
    } finally {
      window.location.reload()
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className="border border-spacing-1 rounded-xl border-black py-1 px-3 text-sm capitalize hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
       {tm('return-refound')}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
          >
            {l === "ar"? (
              <IoMdCloseCircle size={24} className="absolute top-2 left-2 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            ) : (
              <IoMdCloseCircle size={24} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}/>
            )}
            
            {isSubscribed ? (
              <div></div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{tm('return-refound')}</h2>
                <p className="text-gray-600 mb-6 text-sm"></p>
                <div className="flex flex-col space-y-4">
                  {/* Delivery Status Select */}
                  <div className='space-y-2'>
                  <p className='font-medium capitalize text-gray-800 '>
                  {tm('delivery-status')}
                    </p>
                    <select
                      id="deliveryStatus"
                      value={deliveryStatus}
                      onChange={(e) => setDeliveryStatus(e.target.value)}
                      className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg text-gray-700 capitalize"
                      required
                    >
                     <option value=""  className='capitalize'>{tm('choose')}</option>
                      <option value="items_received" className='capitalize'>{tm('items-received')}</option>
                      <option value="package_not_received"  className='capitalize'>{tm('package-not-received')}</option>
                    </select>
                  </div>
                  <div className='space-y-2'>
                  <p className='font-medium capitalize text-gray-800 '>
                  {tm('application-type')}
                    </p>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg text-gray-700 capitalize"
                      required
                    >
                      <option value=""  className='capitalize'>{tm('choose')}</option>
                      <option value="Return_and_refund"  className='capitalize'>{tm('Return-and-refund')}</option>
                      <option value="refund_only"  className='capitalize'>{tm('refund-only')}</option>
                    </select>
                  </div>
                  <div className='space-y-2'>
                    <p className='font-medium capitalize text-gray-800'>{tm('describe-issue')}</p>
                       <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder={tm('text-palceholder')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                  </div>
                  {error && <p className="text-bl text-sm">{error}</p>}


                  <p className='text-gray-600 text-sm'>{tm('description')}</p>
                  <p className='text-gray-600 text-sm'>{tm('description-1')}</p>
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                      {tm('submit')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                      {tm('submit')}
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
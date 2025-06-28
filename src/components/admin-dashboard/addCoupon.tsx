'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter
import moment from 'moment';




export default function AddCoupon() {
  const [isOpen, setIsOpen] = useState(false);
  const [cop, setCop] = useState('');
  const [pro, setPro] = useState('');
  const [porcent, setPorcent] = useState('');
  const [expire, setExpire] = useState('');
  const now = moment();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const l = useLocale();

  const date = now.format('l');

  const handleSubscribe = async () => {

    if(!cop){
        setError('add coupon');
        return;
   }
   if(!porcent){
    setError('add porcentage');
    return;
}
if(!expire){
    setError('add expired date');
    return;
}

   
    setIsLoading(true);
    
    const orderItem = {
        copon:cop,
        productId:pro,
        porcentage:porcent, 
        created_at:expire,
        expired_at:date,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}coponglobal/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
          },
          body: JSON.stringify(orderItem),
        });
  
        // Log the raw response for debugging
       
  
        const responseText = await response.text();
            
            if (!response.ok) {
              console.error("Error posting item:", responseText);
            }
  
          
        setIsSubscribed(true);
        setIsOpen(false);
        setError('');  
        window.location.reload()
      } catch (error) {
        console.error('Error-uring-subscription', error);
        setError('Network-error');
      } finally {
       
        setIsLoading(false);
    
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
      <button className="border border-spacing-1 rounded-xl bg-green-700 border-black  py-1 px-3 text-sm capitalize hover:bg-gray-700 hover:text-gray-200"
                                      onClick={() => setIsOpen(true)} 
                                        >Add Coupon</button>

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
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">Tracking Number</h2>
                <div className="flex flex-col space-y-4">
                 
                  <input
                    type='text'
                    value={cop}
                    onChange={(e) => setCop(e.target.value)}
                    placeholder='coupon'
                    className="w-full px-4 py-2 border text-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                   <input
                    type='text'
                    value={porcent}
                    onChange={(e) => setPorcent(e.target.value)}
                    placeholder='porcentage'
                    className="w-full px-4 py-2 border text-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                   <input
                    type='text'
                    value={pro}
                    onChange={(e) => setPro(e.target.value)}
                    placeholder='product ID'
                    className="w-full px-4 py-2 border text-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                   <input
                    type='text'
                    value={expire}
                    onChange={(e) => setExpire(e.target.value)}
                    placeholder='expired date like 9/7/2025'
                    className="w-full px-4 py-2 border text-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full  text-yel-hover:text-white  py-2 rounded-lg bg-secondary ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                      submit
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                    submit
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


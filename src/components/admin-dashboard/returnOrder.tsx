'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter



export default function Return({id, userid, productid}:{id:number, userid:number, productid:number}) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const l = useLocale();


  const handleSubscribe = async () => {

   
    setIsLoading(true);
    
    const orderItem = {
        user:userid,
        product:productid, 
        status:"return",
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
          method: "PUT",
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
        router.refresh(); 
      } catch (error) {
        console.error('Error-uring-subscription', error);
        setError('Network-error');
      } finally {
        window.location.reload()
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
      <button className="border border-spacing-1 rounded-xl bg-primary border-black  py-1 px-3 text-sm capitalize hover:bg-gray-700 hover:text-gray-200"
                                      onClick={() => setIsOpen(true)} 
                                        >Return Order</button>

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
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">return order</h2>
                <p className='text-gray-700 text-sm capitalize'>are you want to return this order</p>
                <div className="flex flex-col space-y-4 mt-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className='flex gap-4'>
                  <button
                      onClick={()=>setIsOpen(false)}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                  cancel
                    </button>
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full hover:bg-primary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                      return
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-primary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                  return
                    </button>
                  )}
                  </div>
                 
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};


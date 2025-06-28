'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter



export default function AddTrack({id, userid, productid}:{id:number, userid:number, productid:number}) {
  const [isOpen, setIsOpen] = useState(false);
  const [track, setTrack] = useState('');

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const l = useLocale();


  const handleSubscribe = async () => {

    if(!track){
        setError('add tracking number');
        return;
   }

   
    setIsLoading(true);
    
    const orderItem = {
        user:userid,
        product:productid, 
        trakingNumber:track,
        status:"shipped",
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
                                        >Add Tracking Number</button>

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
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder='tracking Number'
                    className="w-full px-4 py-2 border text-secondary border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full  text-yel- hover:text-white  py-2 rounded-lg bg-secondary ext-black transition-colors uppercase flex gap-3 justify-center items-center"
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


'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter



export default function ReadText({id, description, user}:{id:number, description:number, user:number}) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const l = useLocale();


  const handleSubscribe = async () => {
    setIsOpen(true);

    
    const orderItem = {
        user:user,
        isviewed:"yes",
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}returnid/${id}`, {
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
  
          
    

        router.refresh(); 
      } catch (error) {
        console.error('Error-uring-subscription', error);
      } finally {
        
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

<p  onClick={handleSubscribe} className='cursor-pointer'>Read</p>

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
            <p className='text-sm text-secondary'>{description}</p>
    
          </div>
        </div>
      )}
    </>
  );
};


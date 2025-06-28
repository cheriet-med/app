'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { useSession} from "next-auth/react";
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import useFetcherUser from '../checkout/FtecherUser';
import { useRouter } from 'next/navigation';

export default function EditeName() {
  const [isOpen, setIsOpen] = useState(false);
const { data: session } = useSession({ required: true });
const { userinfo} = useFetcherUser();

  const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
   const [full_name, setFullname] = useState(userinfo?.full_name);
   const [validatename, setValidatename] = useState(false);

   const router = useRouter()



  const [isSubscribed, setIsSubscribed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('cart-c');
  const l = useLocale();
  const te = useTranslations('user-dashboard');


  const handleSubscribe = async () => {
   
    if (!full_name) {
      
        setValidatename(true); 
        return;
      }
    
  
     setIsLoadingg(true);
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
            full_name,
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
      window.location.reload()
      setIsLoadingg(false);
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{te('edite-full-name')}</h2>
               
               
                {session?.user?
                <div>
                    <input
     type="text"
     value={full_name}
     onChange={(e) => setFullname(e.target.value)}
     placeholder={t('full-name')}
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
     required
   />
   {validatename? <p className='text-bl text-xs sm:text-sm'>{t('enter-name')}</p> :""}  
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


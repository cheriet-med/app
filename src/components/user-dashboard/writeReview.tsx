'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter
import { useSession, signOut } from "next-auth/react";



export default function WriteReview({ userid, productid, name, country, orderid, color, size }: { userid: number, productid:number, name:string, country: string, orderid:number, color:string, size:string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('orders');
  const l = useLocale();
  const te = useTranslations('Login');
  const { data: session, status } = useSession({ required: true });
    const router = useRouter(); // Initialize the router
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const handleSubscribe = async () => {
    if (rating === 0) {
      setError(t('write-rating-error'));
      return;
    }
    if(!review){
        setError(t('write-review-error'));
        return;
   }
   
    setIsLoading(true);
    
    const orderItem = {
        user:userid,
        product:productid,
        rating:rating,
        comment:review,
        name:name,
        country:country,
        created_at:today,
        updated_at:today,
        color:color,
        size:size
      };



const orderItems = {
  user:userid,
  product:productid,
  viewed: "yes",
};

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}productreviews/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
          },
          body: JSON.stringify(orderItem),
        });
  
        // Log the raw response for debugging
        const rawResponse = await response.text();
  
        if (!response.ok) {
          // Handle HTTP errors
          const errorData = JSON.parse(rawResponse); // Try parsing the raw response
          setError(errorData.message || te('Subscription-failed'));
          return;
        }
  
        const responses = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${orderid}`, {
          method: "PUT",
          headers: {
            "Authorization": `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItems),
        });

        const responseText = await responses.text();
        
        if (!responses.ok) {
          console.error("Error posting item:", responseText);
        }
     
        setIsSubscribed(true);
        setIsLoading(false);
        setError('');
        setIsOpen(false);
      } catch (error) {
        console.error(te('Error-uring-subscription'), error);
        setError(te('Network-error'));
      } finally {
        setIsLoading(false);
        router.push(`/${l}/account/orders/?status=completed&user=${session?.user.id}`)
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
      <button className="border border-spacing-1 rounded-xl border-primary  py-1 px-3 text-sm capitalize hover:bg-gray-100 text-primary"
              onClick={() => setIsOpen(true)}>
                {t('Write-a-Review')}
                </button>  
    

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
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{t('Write-a-Review')}</h2>
                <p className="text-gray-600 mb-6 text-sm">{t('description-leave-feedback')}</p>
                <div className="flex flex-col space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center mb-2">
                    <p className="text-gray-600 mr-3 text-sm">{t('Rating')}:</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder={t('write-review-placeholder')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                      {t('Submit-review')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                      {t('Submit-review')}
                    </button>
                  )}
                    <p className='text-gray-500 text-xs'>{t('small-description')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};




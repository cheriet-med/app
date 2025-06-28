'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"
import { IoMdCloseCircle } from "react-icons/io";
import {useLocale} from 'next-intl';
import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter




export default function EditeFeedback({ userid, feedbackid, content, ratings,  }: { userid: number,  feedbackid:number, content:string, ratings:any, }) {
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState(content);
  const [rating, setRating] = useState(ratings);

  const [hoverRating, setHoverRating] = useState(0);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
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
        rating:rating,
        comment:review,
        updated_at:today,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}feedbackid/${feedbackid}`, {
          method: "PUT",
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
    
      <p className="font-semibold underline text-gray-900 cursor-pointer select-none capitalize" onClick={() => setIsOpen(true)}>{tm('Edite')}</p>

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
                <h2 className="text-xl font-semibold text-gray-800 mb-4 uppercase">{tm('edite-feedback-title')}</h2>
                
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
                    placeholder={tm('text-palceholder')}
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
                      {tm('Edite')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                    {tm('Edite')}
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


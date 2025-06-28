'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl"

import { FaCircleNotch, FaStar } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; // Import useRouter
import { useSession, signOut } from "next-auth/react";
import useFetcherUser from '../checkout/FtecherUser';


export default function WriteFeedback() {
 const { data: session } = useSession({ required: true });
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);
  const router = useRouter();
  const { userinfo } = useFetcherUser();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  
  const [error, setError] = useState('');

  const t = useTranslations('orders');
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
        user:session?.user.id,
        rating:rating,
        name:userinfo?.full_name,
        country:userinfo?.countryCode,
        comment:review,
        created_at:today,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}feedbackglobal/`, {
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

  
  return (
<div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{tm('add-feddback-title')}</h2>
                <p className="text-gray-600 mb-6 text-sm">{tm('add-feedback-description')}</p>
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
                    placeholder={tm('add-feddback-text-placeholder')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
                    required
                  />
                
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {isLoading ? (
                    <button
                      onClick={handleSubscribe}
                      className="w-full sm:w-1/3 hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                    >
                     {tm('submit')}
                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="w-full sm:w-1/3 bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                    >
                   {tm('submit')}
                    </button>
                  )}
                  
                  </div>
              
            
          </div>
        
 
  );
};


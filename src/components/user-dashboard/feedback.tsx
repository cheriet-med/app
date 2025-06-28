'use client';

import { useTranslations } from "next-intl"
import useFetchFeedback from '@/components/user-dashboard/FetchFeedback';
import StarRating from "../products/starsComponent";
import EditeFeedback from "./editeFeedback";


export default function FeedbackView() {
  const { Feed, error, isLoading } = useFetchFeedback();
  const t = useTranslations('user-dashboard');
  return (
   <div>
   {isLoading? <div className="h-96 animate-pulse bg-gray-200"></div>:
            <div className="space-y-4">
                 <h1 className="text-xl font-semibold uppercase">{t('feedback-title')}</h1>         
                
                 {Feed?.map((item: any, index: any) => (
                    <div key={index}>
  <div className="flex gap-1 text-gray-700" key={index}>
                        <p>{t('Rating')}:</p> 
                        <StarRating rating={item.rating} />
                    </div>
                    
                 <p className="text-gray-700">{item.comment}</p> 
                 <div className="mt-4">
                        <EditeFeedback feedbackid={item.id} userid={item.user} ratings={item.rating} content={item.comment}/>
                 </div>
             
                    </div>
                  
                 
                 ))}
          </div>
        }
 </div>
  );
};


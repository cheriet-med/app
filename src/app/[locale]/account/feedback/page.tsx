'use client';

import UserMenu from "@/components/user-dashboard/menu";
import WriteFeedback from '@/components/user-dashboard/writeFeedback';
import useFetchFeedback from '@/components/user-dashboard/FetchFeedback';
import FeedbackView from '@/components/user-dashboard/feedback';
export default function EditeReview() {
  const { Feed, error, isLoading } = useFetchFeedback();
  const see = Feed.length
  return (
            <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
                             <div className="grid lg:grid-cols-4 gap-10 mt-6">
                             <div className=" lg:col-span-1 ">
                             <UserMenu/>
                             </div>
  {see == 0 ?<div className=" lg:col-span-3 border border-spacing-1 p-3">
   
   
   <WriteFeedback/>  </div>: 
   <div className=" lg:col-span-3 border border-spacing-1 p-3">
    <FeedbackView/>
   </div>}
                </div>
         
          </div>
        
 
  );
};


'use client'

import { useState } from 'react';
import useFetchAllFeedback from './FetcheAllFeedbacks';
import StarRating from '../products/starsComponent';


export default function AllFeedbacks () {
    const { AllFeeds , isLoading} = useFetchAllFeedback();
    const averageRating = (AllFeeds.reduce((sum:any, review:any) => sum + +review.rating, 0)) / AllFeeds.length;
  

    return (
        <div className="w-full max-w-full px-2 sm:px-0 bg-slate-800"> 
            {isLoading ? <div className='h-96 bg-gray-300 animate-pulse'></div> :
            <div className="w-full">
                <p className="text-yel font-bold p-2 rounded-sm mb-2 flex justify-center">Table of Feedbacks</p>
                <div className="flex mb-2 justify-center  sm:flex-row gap-2">
                    {averageRating? <p className='text-gray-200'>{averageRating}</p>:""}
                    <StarRating rating={averageRating}/>
                     <p className='text-gray-200'>{"("}{AllFeeds.length}{")"}</p>
                </div>

                {/* Table container with horizontal scrolling on mobile */}
                <div className="w-full h-96 overflow-x-auto border border-spacing-1 border-secondary p-3 rounded-sm">
                    <table className="min-w-[600px] w-full table-auto text-sm text-gray-200">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-left truncate">User ID</th>
                                <th className="border-b p-2 text-left">Rating</th>
                                <th className="border-b p-2 text-left">Name</th>
                                <th className="border-b p-2 text-left">Country</th>
                                <th className="border-b p-2 text-left">comment</th>
                                <th className="border-b p-2 text-left">created_at</th>
                                <th className="border-b p-2 text-left">updated_at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AllFeeds?.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.user}</td>
                                    <td className="border-b p-2 text-left">
                                        <StarRating rating={item.rating}/>
                                       </td>
                                    <td className="border-b p-2 text-left truncate ">{item.name}</td>
                                    <td className="border-b p-2 text-left truncate">{item.country}</td>
                                    <td className="border-b p-2 text-left truncate">{item.comment}</td>
                                    <td className="border-b p-2 text-left">{item.created_at}</td>
                                    <td className="border-b p-2 text-left">{item.updated_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    );
}
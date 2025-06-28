'use client'

import useFetchRturn from './FetchReturn';
import ReadText from './returnDialogText';


export default function Returns () {
    const { Ret , isLoading} = useFetchRturn();
   
    const notyet = Ret.filter(post => post.isviewed === 'no').length;

    return (
        <div className="w-full max-w-full px-2 sm:px-0 bg-slate-800"> 
            {isLoading ? <div className='h-96 bg-gray-300 animate-pulse'></div> :
            <div className="w-full">
                <p className="text-yel font-bold p-2 rounded-sm mb-2 flex justify-center">Table of Returns</p>
                <div className="flex justify-around mb-2  sm:flex-row gap-2 ">
                    <p className="text-gray-200 p-2 rounded-sm">
                        <span className='text-yel font-bold'>{Ret.length} </span>Returns
                    </p>
                    <div className='relative'>
                        {notyet == 0 ? "" :     <p className="text-gray-200 p-2 rounded-sm ">Note See  <span className='absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs text-white'>{notyet}</span></p>
                    }
                </div>
                  
                </div>

                {/* Table container with horizontal scrolling on mobile */}
                <div className="w-full h-96 overflow-x-auto border border-spacing-1 border-secondary p-3 rounded-sm">
                    <table className="min-w-[600px] w-full table-auto text-sm text-gray-200">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-left truncate">User ID</th>
                                <th className="border-b p-2 text-left truncate">order ID</th>
                                <th className="border-b p-2 text-left">Delivery Status</th>
                                <th className="border-b p-2 text-left">Application Type</th>
                                <th className="border-b p-2 text-left">Description</th>
                                <th className="border-b p-2 text-left">time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Ret?.map((item: any, index: any) => (
                                <tr key={index} className={item.isviewed == "yes" ? "" : "bg-gray-600"}>
                                    <td className="border-b p-2 text-left truncate ">{item.user}</td>
                                    <td className="border-b p-2 text-left">{item.orderID}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.status}</td>
                                    <td className="border-b p-2 text-left">{item.application}</td>
                                    <td className="border-b p-2 text-left">
                                        <div>
                                            <ReadText user={item.user} id={item.id} description={item.description}/>
                                        </div>
                                    </td>
                                    <td className="border-b p-2 text-left">{item.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    );
}
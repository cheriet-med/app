'use client'

import useFetchCoupons from '../checkout/FetchCoupons';
import AddCoupon from './addCoupon';

export default function Coupon () {
    const { cop , isLoading} = useFetchCoupons();
   

  const del = async (id:number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}coponid/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token "+process.env.NEXT_PUBLIC_TOKEN,
          },
        });
        window.location.reload()
        // Log the raw response for debugging
  };


    return (
        <div className="w-full max-w-full px-2 sm:px-0 bg-slate-800"> 
            {isLoading ? <div className='h-96 bg-gray-300 animate-pulse'></div> :
            <div className="w-full">
                <p className="text-yel font-bold p-2 rounded-sm mb-2 flex justify-center">Table of Coupons</p>
                <div className="flex justify-between mb-2  sm:flex-row gap-2">
                <p className="text-gray-200 p-2 rounded-sm">
                        <span className='text-yel font-bold'>{cop.length}</span> Coupon
                    </p>
                    <AddCoupon/>
                    </div>
                {/* Table container with horizontal scrolling on mobile */}
                <div className="w-full h-96 overflow-x-auto border border-spacing-1 border-secondary p-3 rounded-sm">
                    <table className="min-w-[600px] w-full table-auto text-sm text-gray-200">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-left">Copon</th>
                                <th className="border-b p-2 text-left">porcentage</th>
                                <th className="border-b p-2 text-left">product ID</th>
                                <th className="border-b p-2 text-left">created_at</th>
                                <th className="border-b p-2 text-left">expired_at</th>
                                <th className="border-b p-2 text-left">delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cop?.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.copon}</td>
                                    <td className="border-b p-2 text-left">{item.porcentage}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.productId}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.created_at}</td>
                                    <td className="border-b p-2 text-left">{item.expired_at}</td>
                                    <td className="border-b p-2 text-left">
                                        <p className='text-red-500 cursor-pointer' onClick={()=>del(item.id)}>Delete</p>
                                
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    );
}
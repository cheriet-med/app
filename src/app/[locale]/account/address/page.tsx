'use client'

import useFetcherUser from "@/components/checkout/FtecherUser";
import UserMenu from "@/components/user-dashboard/menu";
import EditeAddress from "@/components/user-dashboard/editeAddress";
import { useTranslations } from "next-intl"

export default function Address () {
    const { userinfo, isLoading} = useFetcherUser();
     const te = useTranslations('orders')
    return(
         <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
                          <div className="grid lg:grid-cols-4 gap-10 mt-6">
                          <div className=" lg:col-span-1 ">
                          <UserMenu/>
                          </div>
                        
                          <div className="lg:col-span-3 space-y-4 ">
              <div className="space-y-8 border border-spacing-1 p-6">
              <h1 className="font-bold  text-2xl uppercase">{te('address')}</h1>
            {isLoading? <div className="space-y-4">
            <p className='bg-gray-200 animate-pulse h-6'></p>
            <p className='bg-gray-200 animate-pulse h-6'></p>
            <p className='bg-gray-200 animate-pulse h-6'></p>
            </div>:
             <div>
             <p className='text-gray-700'>{userinfo?.phoneNumber}</p>
             <p className='text-gray-700'>{userinfo?.address_line_1}, {userinfo?.address_line_2}</p>
             <p className='text-gray-700'>{userinfo?.city}, {userinfo?.state}, {userinfo?.countryCode}, {userinfo?.postalCode}</p>
             </div>
          }

          <EditeAddress/>
        </div>
        </div>
        </div>
        </div>
    )
}
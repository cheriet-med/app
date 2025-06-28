'use client'

import { useState } from 'react';
import useFetchOrders from './FetcheOrders';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import AddTrack from './addTrackingNumber';
import Return from './returnOrder';

export default function Orders () {
    const { order , isLoading} = useFetchOrders();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const sell = order.filter(post => post.status === 'pending').length;
    // Handle language change
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    // Handle search term change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const l = useLocale();
    
    // Filter News by selected language and search term
    const filteredNews = (selectedLanguage === 'All' ? order : order.filter((item: any) => item.status === selectedLanguage))
        .filter((item: any) => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                item.id.toString().toLowerCase().includes(searchLower) ||
                item.transation_ID_item?.toLowerCase().includes(searchLower) ||
                item.orderN?.toLowerCase().includes(searchLower) 
            );
        });

    const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

    return (
        <div className="w-full max-w-full px-2 sm:px-0"> 
            {isLoading ? <div className='h-96 bg-gray-300 animate-pulse'></div> : 
            <div className="w-full bg-slate-800">
                <p className="text-yel font-bold p-2 rounded-sm mb-2 flex justify-center">Table of Orders</p>
                <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">           
                    <div className="flex items-center gap-2">
                        <div className='flex gap-2'>
                              <p className="text-gray-200 p-2 rounded-sm">
                            <span className='text-yel font-bold'>{filteredNews.length}</span> Orders
                        </p>
                        <div className='relative'>
                        {sell == 0 ? "" :     <p className="text-gray-200 p-2 rounded-sm ">Waiting For Sell <span className='absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs text-white'>{sell}</span></p>
                    }
                </div>

                        </div>
                      
                        {/* Search Field */}
                      
                    </div>  <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search by ID or Transaction ID or order Number"
                                className="p-2 rounded bg-slate-700 text-gray-200 w-full text-sm sm:w-96 h-7"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    {/* Language Filter Dropdown */}
                    <div className="flex items-center gap-2 px-4">
                        <label htmlFor="languageFilter" className="text-gray-200 p-2 rounded-sm">Filter by Status:</label>
                        <select 
                            id="languageFilter" 
                            className="p-2 rounded bg-slate-800 text-gray-200 sm:w-auto"
                            value={selectedLanguage} 
                            onChange={handleLanguageChange}>
                            <option value="All">All</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="hide">Hide</option>
                            <option value="return">Return</option>
                            <option value="Created">Created</option>
                        </select>
                    </div>
                </div>

                {/* Table container with horizontal scrolling on mobile */}
                <div className="w-full h-96 overflow-x-auto border border-spacing-1 border-secondary bg-slate-800 p-3 rounded-sm">
                    <table className="min-w-[600px] w-full table-auto text-sm text-gray-200">
                        <thead>
                            <tr className='capitalize'>
                                <th className="border-b p-2 text-left truncate">order ID</th>
                                <th className="border-b p-2 text-left">Image</th>
                                <th className="border-b p-2 text-left">product informations</th>
                                <th className="border-b p-2 text-left">address</th>
                                <th className="border-b p-2 text-left truncate">transaction ID</th>
                                <th className="border-b p-2 text-left">transaction item ID</th>
                                <th className="border-b p-2 text-left">order Number</th>
                                <th className="border-b p-2 text-left">tracking number</th>
                                <th className="border-b p-2 text-left">status</th>
                                <th className="border-b p-2 text-left">Discount</th>
                                <th className="border-b p-2 text-left">create date</th>
                                <th className="border-b p-2 text-left">Complete date</th>
                                <th className="border-b p-2 text-left">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNews?.map((item: any, index: any) => (
                                <tr key={index} className='capitalize'>
                                    <td className="border-b p-2 text-left truncate ">{item.id}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">
                                        <Image
                                            height={40}
                                            width={40}
                                            src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, 'image')}` || ''}
                                            alt={getLocalizedField(item, 'tag') || ''}
                                            priority
                                        />
                                    </td>
                                    <td className="border-b p-2 text-left truncate">
                                        <div>
                                            <div className='flex gap-1'>
                                                <p>{item.title_en}</p>
                                                <p>|</p>
                                                <p>Color: {item.color}</p>
                                                <p>|</p>
                                                <p>Size: {item.size}</p>
                                                <p>|</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>|</p>
                                                <p>Price: {item.price}</p>
                                            </div>
                                            <div className='flex gap-1'>
                                                <p>Paymment Method:{item.payment_method}</p>
                                                <p>|</p>
                                                <p>DropshippingId:{item.dropshippingID}</p> 
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b p-2 text-left truncate ">
                                        <div>
                                            <div className='flex gap-1'>
                                                <p>{item.full_name}</p>
                                                <p>|</p>
                                                <p>{item.phoneNumber}</p>
                                            </div>
                                            <div className='flex gap-1'>
                                                <p>{item.address_line_1}</p>
                                                <p>|</p>
                                                <p>{item.address_line_2}</p>
                                                <p>|</p>
                                                <p>{item.city}</p>
                                                <p>|</p>
                                                <p>{item.state}</p>
                                                <p>|</p>
                                                <p>{item.countryCode}</p>
                                                <p>|</p>
                                                <p>{item.postalCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b p-2 text-left truncate ">{item.transation_ID_order}</td>
                                    <td className="border-b p-2 text-left truncate ">{item.transation_ID_item}</td>
                                    <td className="border-b p-2 text-left truncate ">{item.orderN}</td>
                                    <td className="border-b p-2 text-left truncate ">{item.trakingNumber}</td>
                                    <td className="border-b p-2 text-left truncate">
                                        {item.status == "shipped" ?  <p className='text-bl'> {item.status}</p> : (item.status == "completed" ? <p className='text-green-600'> {item.status}</p> :(item.status == "return" ? <p className='text-primary'> {item.status}</p>: (item.status == "hide" ? <p className='text-yel'> {item.status}</p>: (item.status == "Created" ? <p className='text-red-700'> {item.status}</p> : <p className='text-orange-500'> {item.status}</p>))))}
                                    </td>
                                    <td className="border-b p-2 text-left truncate ">{item.descount}</td>
                                    <td className="border-b p-2 text-left truncate ">{item.created_at}</td>
                                    <td className="border-b p-2 text-left truncate ">{item.updated_at}</td>
                                    <td className="border-b p-2 text-left truncate ">
                                        <div className='flex gap-1'>
                                            {item.status == "return"  || item.status == "pending" || item.status == "hide" || item.status == "shipped"?    "" :<Return id={item.id} userid={item.user} productid={item.product}/>}
                                            {item.status == "pending"? <AddTrack id={item.id} userid={item.user} productid={item.product}/> :""}
                                        </div>
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
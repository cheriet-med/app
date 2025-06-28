'use client'

import { useState } from 'react';
import useFetchNewsLetters from "./FetcheNewsletters"
import useFetchOffers from './FetchOffers';
export default function Offers () {
    const { Offer , isLoading} = useFetchOffers();
    const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

    // Handle language change
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    // Filter News by selected language
    const filteredNews = selectedLanguage === 'All' 
        ? Offer 
        : Offer.filter((item: any) => item.language === selectedLanguage);

    return (
        <div className="w-full max-w-full px-2 sm:px-0 bg-slate-800"> 
            {isLoading ? <div className='h-96 bg-gray-300 animate-pulse'></div> : 
            <div className="w-full">
                <p className="text-yel font-bold  p-2 rounded-sm mb-2 flex justify-center">Table of Offers Subsribers</p>
                <div className="flex justify-between mb-2  sm:flex-row gap-2">           
                    <p className="text-gray-200  p-2 rounded-sm">
                        <span className='text-yel font-bold'>{filteredNews.length}</span> Offers
                    </p>
                    {/* Language Filter Dropdown */}
                    <div className="flex items-center gap-2 px-4">
                        <label htmlFor="languageFilter" className="text-gray-200  p-2 rounded-sm ">Filter by Language:</label>
                        <select 
                            id="languageFilter" 
                            className="p-2 rounded bg-slate-800 text-gray-200  sm:w-auto"
                            value={selectedLanguage} 
                            onChange={handleLanguageChange}>
                            <option value="All">All</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="ar">Arabic</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="nl">Nerlandais</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="sv">Swedish</option>
                        </select>
                    </div>
                </div>

                {/* Table container with horizontal scrolling on mobile */}
                <div className="w-full h-96 overflow-x-auto border border-spacing-1 border-secondary  p-3 rounded-sm">
                    <table className="min-w-[600px] w-full table-auto text-sm text-gray-200">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-left">Name</th>
                                <th className="border-b p-2 text-left">Email</th>
                                <th className="border-b p-2 text-left">Language</th>
                                <th className="border-b p-2 text-left">Date</th>
                                <th className="border-b p-2 text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNews?.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td className="border-b p-2 text-left">{item.name}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.email}</td>
                                    <td className="border-b p-2 text-left">{item.language}</td>
                                    <td className="border-b p-2 text-left truncate max-w-[200px]">{item.date}</td>
                                    <td className="border-b p-2 text-left">{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    );
}
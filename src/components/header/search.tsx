'use client';

import { useState, FormEvent } from "react";
import { IoSearch } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation"; // Import useRouter
import {useLocale} from "next-intl";
export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const t = useTranslations('TopNav');
  const router = useRouter(); // Initialize the router
const l = useLocale()
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
 

    // Redirect to the search page with the query as a URL parameter
    if (searchQuery.trim()) {
      router.push(`/${l}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder={t('search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="m-2 pl-10 pr-3 w-40 md:w-96 text-gray-300 focus:text-gray-700 rounded-lg h-7 bg-secondary text-sm focus:outline-none focus:ring-2 focus:bg-white hover:bg-white  placeholder:text-sm"
      />
      <button type="submit" aria-label={t('search')}>
        <IoSearch className="absolute left-3 top-3 text-gray-300" size={18} />
      </button>
    </form>
  );}
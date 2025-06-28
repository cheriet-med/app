'use client'

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation"; // Import useRouter
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl"

export default function UserMenu() {
  const t = useTranslations('user-dashboard');
    const router = useRouter(); // Initialize the router
  const l = useLocale()
  const { data: session, status } = useSession({ required: true });
  return (
    <div className="flex  flex-col  border border-spacing-1 capitalize ">
      <Link href="/account">
       <div className="flex justify-between items-center  hover:bg-secondary p-3 hover:text-yel hover:font-semibold cursor-pointer">
          <p>{t('My-Account')}</p>
          {l == "ar" ?  <MdOutlineKeyboardArrowDown size={32} className="rotate-90 "/>: <MdOutlineKeyboardArrowDown size={32} className="-rotate-90 "/>}
       
       </div>
      
      </Link>
      {/* Dashboard Link */}
      <Link href="/account/informations">
       <div className="flex justify-between items-center  hover:bg-secondary p-3 hover:text-yel hover:font-semibold cursor-pointer">
          <p>{t('Account-information')}</p>
          {l == "ar" ?  <MdOutlineKeyboardArrowDown size={32} className="rotate-90 "/>: <MdOutlineKeyboardArrowDown size={32} className="-rotate-90 "/>}
       </div>
      
      </Link>

      <Link href="/account/orders">
      <div 
      className="flex justify-between items-center hover:bg-secondary p-3 hover:text-yel hover:font-semibold cursor-pointer" 
      >
          <p>{t('Orders')}</p>
          {l == "ar" ?  <MdOutlineKeyboardArrowDown size={32} className="rotate-90 "/>: <MdOutlineKeyboardArrowDown size={32} className="-rotate-90 "/>}
       </div>
       </Link>

      <Link href="/account/address">
      <div className="flex justify-between items-center  hover:bg-secondary p-3 hover:text-yel hover:font-semibold cursor-pointer">
          <p>{t('address')}</p>
          {l == "ar" ?  <MdOutlineKeyboardArrowDown size={32} className="rotate-90 "/>: <MdOutlineKeyboardArrowDown size={32} className="-rotate-90 "/>}
       </div>
      </Link>

      <Link href="/account/feedback">
      <div className="flex justify-between items-center  hover:bg-secondary p-3 hover:text-yel hover:font-semibold cursor-pointer">
          <p>{t('Feedback')}</p>
          {l == "ar" ?  <MdOutlineKeyboardArrowDown size={32} className="rotate-90 "/>: <MdOutlineKeyboardArrowDown size={32} className="-rotate-90 "/>}
       </div>
      </Link>
    </div>
  );
}
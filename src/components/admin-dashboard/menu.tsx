'use client'

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function AdminMenu() {
  const locale = useLocale(); // Get the current locale
  const [showPostDropdown, setShowPostDropdown] = useState(false); // State for Post dropdown
  const [showProductDropdown, setShowProductDropdown] = useState(false); // State for Product dropdown

  // Toggle Post dropdown
  const togglePostDropdown = () => {
    setShowPostDropdown(!showPostDropdown);
    setShowProductDropdown(false); // Close Product dropdown if open
  };

  // Toggle Product dropdown
  const toggleProductDropdown = () => {
    setShowProductDropdown(!showProductDropdown);
    setShowPostDropdown(false); // Close Post dropdown if open
  };

  // Close both dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowPostDropdown(false);
    setShowProductDropdown(false);
  };

  return (
    <div className="flex gap-4 justify-center py-3 flex-wrap h-12 bg-secondary text-yel relative">
      {/* Dashboard Link */}
      <Link href="/account">
        <p className="hover:text-bl cursor-pointer hover:font-semibold">Dashboard</p>
      </Link>



      {/* Sign Out Button */}
      <p
        className="hover:text-bl cursor-pointer hover:font-semibold"
        onClick={() => signOut({ callbackUrl: `/${locale}/login-signin` })}
      >
        Sign Out
      </p>


      {/* Close dropdowns when clicking outside */}
      {(showPostDropdown || showProductDropdown) && (
        <div
          className="fixed inset-0 bg-transparent z-0"
          onClick={closeDropdowns} // Close dropdowns when clicking outside
        />
      )}
    </div>
  );
}
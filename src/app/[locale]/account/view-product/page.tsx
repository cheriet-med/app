'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useLocale } from "next-intl";
import useFetchProducts from "@/components/products/fetcherProduct";
import { useRouter } from 'next/navigation'; // Import useRouter
import AdminMenu from "@/components/admin-dashboard/menu";
// Define the reduction function at the top
const reduction = (old: any, new_p: any) => {
  if (old === null || old === 0) return 0; // Handle null or zero old_price
  return ~~(((old - new_p) / old) * 100);
};

export default function Products() {
 
  const te = useTranslations('Shop');
  const l = useLocale();
  const router = useRouter(); // Initialize the router
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(""); // State for selected filter
  const itemsPerPage = 32;
  const { Products, error, isLoading } = useFetchProducts();

  

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  // Sort products based on the selected filter
  const sortedProducts = [...Products].sort((a:any, b:any) => {
    if (filter === "lower_price") {
      return a.new_price - b.new_price; // Sort by lower price
    } else if (filter === "higher_price") {
      return b.new_price - a.new_price; // Sort by higher price
    } else if (filter === "reduction") {
      const reductionA = reduction(a.old_price, a.new_price);
      const reductionB = reduction(b.old_price, b.new_price);
      return reductionB - reductionA; // Sort by higher reduction
    } else {
      return 0; // No sorting
    }
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Get the items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get localized field
  const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index} className="cursor-pointer hover:shadow-2xl hover:bg-secondary hover:text-yel group">
          <div className="h-72 w-full relative bg-gray-300 animate-pulse"></div>
          <div className="py-3 mb-3 flex flex-col gap-3 group-hover:px-3">
            <div className="h-6 bg-gray-300 animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-300 animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <AdminMenu/>
      <h1 className="text-lg mx-6 my-2">View Products</h1>
      <hr className="border-spacing-1 mb-4" />
      {/* Latest News Section */}
      <div>
        <div className="w-full px-1 custom:px-6">
        
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 custom:grid-cols-5 pb-10 gap-4">
              {currentItems.map((item) => (
                <div key={item.id} className="cursor-pointer hover:shadow-2xl hover:bg-secondary hover:text-yel group" >
                <div onClick={() => router.push(`/${l}/product/${getLocalizedField(item, 'url')}`)}>

                  <div className="h-48 sm:h-60 lg:h-80 custom:h-96 w-auto relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, "image")}`}
                      alt={getLocalizedField(item, "tag")}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority
                      quality={100}
                    />
                    {item.old_price === null || reduction(item.old_price, item.new_price) === 0 ? null : (
                      <p className="bg-yel absolute top-3 left-3 rounded-full shadow-lg px-2 py-3 text-secondary font-semibold">
                        -{reduction(item.old_price, item.new_price)}%
                      </p>
                    )}
                  </div>
                  <div className="py-3 mb-3 flex flex-col gap-3 group-hover:px-3">
                    <h2 className="font-semibold text-secondary group-hover:text-yel">
                      {item.new_price} $
                    </h2>
                    <h1 className="text-sm text-gray-600 group-hover:text-yel">{getLocalizedField(item, "title").slice(0,30)+"..."}</h1>
                  </div>

                </div>
                <button className="text-green-500 hover:text-green-300 p-2" onClick={()=>router.push(`/${l}/account/edite-product?id=${item.id}`)}>Edite</button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length < itemsPerPage ? "" : (
            <div className="flex justify-between items-center gap-2 mb-20 mt-10 flex-wrap">
              {currentPage === 1 ? (
                <div className="flex items-center cursor-pointer text-white select-none">
                  {l == 'ar' ? <MdArrowBackIos className="rotate-180" /> : <MdArrowBackIos />}
                  <p className="capitalize font-semibold">{te('previous')}</p>
                </div>
              ) : (
                <div className="flex items-center cursor-pointer hover:text-yel" onClick={handlePrevious}>
                  {l == 'ar' ? <MdArrowBackIos className="rotate-180" /> : <MdArrowBackIos />}
                  <p className="capitalize font-semibold">{te('previous')}</p>
                </div>
              )}

              {/* Page Numbers */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <div
                    className="px-2 bg-secondary text-yel rounded-2xl cursor-pointer hover:bg-yel hover:text-secondary font-bold opacity-70"
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Next Button */}
              {currentPage === totalPages ? (
                <div className="flex items-center cursor-pointer text-white select-none">
                  <p className="capitalize font-semibold">{te('next')}</p>
                  {l == 'ar' ? <MdArrowBackIos /> : <MdArrowBackIos className="rotate-180" />}
                </div>
              ) : (
                <div className="flex items-center cursor-pointer hover:text-yel" onClick={handleNext}>
                  <p className="capitalize font-semibold">{te('next')}</p>
                  {l == 'ar' ? <MdArrowBackIos /> : <MdArrowBackIos className="rotate-180" />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
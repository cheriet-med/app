'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useLocale } from "next-intl";
import Link from "next/link";
import useFetchPosts from "@/components/post/fetcher";

export default function Products() {
  const t = useTranslations('Blog');
  const l = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;



  function images() {
    return l == "ar" ? "/blog-hero/حقيبة- تنس- في-الملعب.avif" :
      (l == "de" ? "/blog-hero/tennis-tasche-am-platz.avif" :
        (l == "es" ? "/blog-hero/bolsa-de-tenis-en-la-canchas.avif" :
          (l == "fr" ? "/blog-hero/sac-de-tennis-sur-le-court.avif" :
            (l == "it" ? "/blog-hero/borsa-da-tennis-sul-campo.avif" :
              (l == "nl" ? "/blog-hero/tennis-tas-op-de-baan.avif" :
                (l == "pt" ? "/blog-hero/bolsa-de-tenis-na-pista.avif" :
                  (l == "ru" ? "/blog-hero/tennis-sumka-na-korte.avif" :
                    (l == "sv" ? "/blog-hero/tennisvaska-pa-banan.avif" :
                      "/blog-hero/tennis-bag-at-the-court.avif"
                    )
                  )
                )
              )
            )
          )
        )
      );
  }



  const { posts, error, isLoading } = useFetchPosts();

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index}>
                  <div  className="h-64 w-full bg-gray-300 animate-pulse"></div>
                  <h2 className="h-7 mt-2 w-2/3 bg-gray-300 animate-pulse" ></h2>

        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="h-96 w-full sm:col-span-1 relative flex items-center bg-secondary">
        <Image src={images()}
         alt={t('tag')} 
         fill
          sizes="100vw" 
          className="z-0 object-cover" 
          quality={85}  
          
        
          priority />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="absolute sm:bottom-10 mx-5 lg:mx-10 px-1 shadow-lg">
          <h1 className="text-xl md:text-4xl font-bold text-white mb-8">{t('title')}</h1>
          <p className="max-w-5xl text-white sm:text-lg">{t('description')}</p>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="w-full px-3 sm:px-5">
        <h2 className="text-2xl sm:text-3xl font-bold py-10">{t('Latest News')}</h2>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
            {currentItems.map((item) => (
              <Link key={item.id} href={`/${l}/blog/` + getLocalizedField(item, "url")}>
                <div className="cursor-pointer hover:shadow-2xl hover:bg-secondary hover:text-yel group">
                  <div className="h-72 w-full relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, "image")}`}
                      alt={getLocalizedField(item, "tag")}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="py-3 mb-3 flex flex-col gap-3 group-hover:px-3">
                    <h2 className="font-semibold">{getLocalizedField(item, "title")}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts.length > itemsPerPage && (
          <div className="flex justify-between items-center gap-2 mb-20 mt-10 flex-wrap">
            <button disabled={currentPage === 1} onClick={handlePrevious} className="text-white hover:text-yel flex items-center">
              <MdArrowBackIos className={l === 'ar' ? "rotate-180" : ""} />
              <p className="capitalize font-semibold">{t('previous')}</p>
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 rounded-2xl font-bold opacity-70 ${
                    currentPage === index + 1 ? "bg-yel text-secondary" : "bg-secondary text-yel hover:bg-yel hover:text-secondary"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button disabled={currentPage === totalPages} onClick={handleNext} className="text-white hover:text-yel flex items-center">
              <p className="capitalize font-semibold">{t('next')}</p>
              <MdArrowBackIos className={l === 'ar' ? "" : "rotate-180"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

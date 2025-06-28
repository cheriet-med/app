'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useLocale } from "next-intl";
import Link from "next/link";
import useFetchPosts from "@/components/post/fetcher";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminMenu from "@/components/admin-dashboard/menu";



export default function Products() {
const { data: session, status } = useSession({ required: true });

  const t = useTranslations('Blog');
  const te = useTranslations('Shop');
  const l = useLocale();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;

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
                  <h1 className="h-7 mt-2 w-2/3 bg-gray-300 animate-pulse" ></h1>

        </div>
      ))}
    </div>
  );
 useEffect(() => {
    if (status === "authenticated" && !session?.user?.is_superuser) {
      router.push("/");
    }
  }, [session, status, router]);
  return (
    <div>
      {/* Hero Section */}
    <AdminMenu />
      <h1 className="text-lg mx-6 my-2">View Post</h1>
      <hr className="border-spacing-1 mb-4" />
      {/* Latest News Section */}
      <div className="w-full px-3 sm:px-5">

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
            {currentItems.map((item) => (
            
                <div key={item.id} className="cursor-pointer hover:shadow-2xl hover:bg-secondary hover:text-yel group">  
                <Link  href={`/${l}/blog/` + getLocalizedField(item, "url")}>
                  <div className="h-72 w-full relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, "image")}`}
                      alt={getLocalizedField(item, "tag")}
                      sizes="100vw"
                      fill
                      quality={85}
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="py-3 mb-3 flex flex-col gap-3 group-hover:px-3">
                    <h1 className="font-semibold">{getLocalizedField(item, "title")}</h1>
                    <p className="text-sm text-gray-500 group-hover:text-yel">{getLocalizedField(item, "description").slice(0,300)+"..."}</p>
                  </div>  
                  </Link>
                  <button className="text-green-500 hover:text-green-300 p-2" onClick={()=>router.push(`/${l}/account/edite-post?id=${item.id}`)}>Edite</button>
                </div>
            
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts.length > itemsPerPage && (
          <div className="flex justify-between items-center gap-2 mb-20 mt-10 flex-wrap">
            <button disabled={currentPage === 1} onClick={handlePrevious} className="text-white hover:text-yel flex items-center">
              <MdArrowBackIos className={l === 'ar' ? "rotate-180" : ""} />
              <p className="capitalize font-semibold">{te('previous')}</p>
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
              <p className="capitalize font-semibold">{te('next')}</p>
              <MdArrowBackIos className={l === 'ar' ? "" : "rotate-180"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client'


import SocialMedia from "../header/social";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterDialog from "../header/newsletters";
import Image from "next/image";

const Footer = () => {
  const router = useRouter(); // Initialize the router
  const locale = useLocale(); // Get the current locale
  const t = useTranslations('Footer');
  // Function to handle navigation with query parameters
  const handleNavigateWithQuery = ( query: string) => {
    // Include the locale and query parameters in the URL
    router.push(`/${locale}/p?q=${encodeURIComponent(query)}`);
  };

    return (
        <footer className="bg-neutral text-gray-200">
        <div className="mx-6 md:mx-16 custom:mx-72 py-20 ">
          <div className="grid  grid-cols-1 sm:grid-cols-2 custom:grid-cols-4 gap-10">
            {/* Contact & Follow Section */}
            <div className="col-span-1">
             <div className="relative h-9 w-32 ">
                       <Image
                         src="/logotest.png" // or "/logo.webp" if using an webp
                         alt="logo"
                         fill
                         sizes='100%'
                         style={{ objectFit: 'contain' }} // Maintain aspect ratio
                         priority // Ensures it loads faster
                       />
                     </div>

            <div className="text-sm text-gray-400 py-3">
               <p>Get a taste of the best restaurants, hotel experiences, and dining news, delivered to your inbox.</p>
   
            
            </div>
             <NewsletterDialog/>
              
            </div>
            <div >
            <h2 className="pb-4 font-semibold uppercase">{t('Follow us')}</h2>
            <p className="text-sm text-gray-400 mb-3">Be part of the TrustDine community, follow us on social media</p>
             <SocialMedia/>
            </div>
            {/* Information Section */}
            <div className="col-span-1">
            <h2 className="pb-4 font-semibold uppercase">How It Works</h2>
          <div className="text-gray-400 text-sm flex flex-col gap-3">
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Booking Process</p></Link>
            <Link href="/"> <p className="hover:text-blue-300 hover:underline cursor-pointer">Receipt Verification</p></Link>
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Trust System</p></Link>
          

          </div>
             
            </div>
            {/* Useful Links Section */}
            <div className="col-span-1">
            <h2 className="pb-4 font-semibold uppercase">Company</h2>
            <div className="text-gray-400 text-sm flex flex-col gap-3">
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Home page</p></Link>
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">About Us</p></Link>
            <Link href="/"> <p className="hover:text-blue-300 hover:underline cursor-pointer">Contact </p></Link>
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Blog</p></Link>
          
          </div>
          
            </div>
            {/* Footer Text Spanning All Columns */}
        
          </div>
       
          <div className="grid  grid-cols-1 sm:grid-cols-2 custom:grid-cols-4 gap-10 pt-10 ">
         
          <div className="col-span-1 hidden custom:block"></div>
            {/* Information Section */}
            <div className="col-span-1">
            <h2 className="pb-4 font-semibold uppercase">Support</h2>
          <div className="text-gray-400 text-sm flex flex-col gap-3">
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Help Center</p></Link>
            <Link href="/"> <p className="hover:text-blue-300 hover:underline cursor-pointer">FAQ</p></Link>
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Business Support</p></Link>
        

          </div>
             
            </div>
            {/* Useful Links Section */}
            <div className="col-span-1">
            <h2 className="pb-4 font-semibold uppercase">Diners & Restaurants</h2>
            <div className="text-gray-400 text-sm flex flex-col gap-3">
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Find Restaurants</p></Link>
            <Link href="/"> <p className="hover:text-blue-300 hover:underline cursor-pointer">Become a Partner </p></Link>
            <Link href="/"><p className="hover:text-blue-300 hover:underline cursor-pointer">Pro Plan</p></Link>
            <Link href="/"> <p className="hover:text-blue-300 hover:underline cursor-pointer">Rewards Program</p></Link>
          </div>
          
            </div>
            {/* Footer Text Spanning All Columns */}
        
          </div>
 
          </div>
          <hr className="text-white pt-10 mx-6 md:mx-16 custom:mx-72 "/>
      </footer>
      
    );
  };
  
  export default Footer;
  
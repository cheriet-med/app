
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";



export default function DashboardUser () {
    const locale = useLocale(); // Get the current locale


   
    return (
    
              <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
          User Dashboard
          </div>
         
    )
}
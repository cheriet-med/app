'use client'

import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import useFetcherUser from "@/components/checkout/FtecherUser";
import UserMenu from "@/components/user-dashboard/menu";
import EditeName from "@/components/user-dashboard/editeName";
import { useTranslations } from "next-intl";
import { useState } from "react";
export default function Informations () {
    const locale = useLocale(); // Get the current locale
      const { data: session, status } = useSession({ required: true });
      const { userinfo, isLoading} = useFetcherUser();
        const [emailsend, setEmailsend] = useState(false);
          const [emailsenderror, setEmailsenderror] = useState(false);

          const [emailsendUsername, setEmailsendUsername] = useState(false);
          const [emailsenderrorUsername, setEmailsenderrorUsername] = useState(false);
  const t = useTranslations('Login');
  const te = useTranslations('user-dashboard');
  const resetPassword = async () => {
        try {
          const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email:session?.user.email,
            }),
          });
          
          if (!neo.ok) {
            throw new Error("Network response was not ok");
           
          }
         
          setEmailsend(true)
         }
         catch {
          setEmailsenderror(true)
        }
        }



   
        const resetEmail = async () => {
          try {
            const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_email/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email:session?.user.email,
              }),
            });
            
            if (!neo.ok) {
              throw new Error("Network response was not ok");
             
            }
           
            setEmailsendUsername(true)
           }
           catch {
            setEmailsenderrorUsername(true)
          }
          }

    return(
               <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
                    <div className="grid lg:grid-cols-4 gap-10 mt-6">
                    <div className=" lg:col-span-1 ">
                    <UserMenu/>
                    </div>
                  
                    <div className="lg:col-span-3 space-y-4 ">
        <div className="space-y-8 border border-spacing-1 p-6">
           <div className="space-y-4">
             <h1 className="font-bold  text-2xl uppercase">{te('My-Information')}</h1>
             <p className="text-gray-700">{te('info-description')}</p>
           </div>
           
           <div className="space-y-4">
           <h1 className="font-bold  text-2xl uppercase">{te('Full-Name')}</h1>
           <p className="text-gray-700">{userinfo?.full_name}</p>
           <EditeName/>
           </div>
           
           <h1 className="font-bold  text-2xl uppercase">{te('Login-details')}</h1>
           <div className="space-y-4">
           <p className="font-bold text-gray-900 uppercase">{te('E-mail')}</p>
            <p className="text-gray-700">{session?.user.email}</p>
            <p className="font-semibold underline text-gray-900 cursor-pointer" onClick={resetEmail}>{te('Edite')}</p>
            {emailsendUsername? <p className='text-bl text-sm'>{te('email-send')}</p>:""}
            {emailsenderrorUsername? <p  className='text-bl text-sm'>{t('emailsenderror')}</p>:""}
           </div>

           <div className="space-y-4">
           <p className="font-bold text-gray-900 uppercase">{te('Password')}</p>
           <p className="text-gray-700">*************</p>
            <p className="font-semibold underline text-gray-900 cursor-pointer" onClick={resetPassword}>{te('Edite')}</p>
            {emailsend? <p className='text-bl text-sm'>{t('emailsend')}</p>:""}
          {emailsenderror? <p  className='text-bl text-sm'>{t('emailsenderror')}</p>:""}
         
           </div>

           <div className="space-y-4">
           <p className="font-bold text-gray-900 uppercase">{te('logout-description')}</p>
           <p className="text-gray-700">{te('logout-description-1')}</p>
            <button
                                      onClick={() => signOut({ callbackUrl: `/${locale}/login-signin` })} 
                                        className="w-3/4 l py-2 rounded-lg  font-medium  border border-spacing-2 border-black uppercase hover:text-gray-500"
                                      >
                                      {te('logout')}
                                      </button>
           </div>

        </div>
        </div>
        </div>
        </div>
    )
}
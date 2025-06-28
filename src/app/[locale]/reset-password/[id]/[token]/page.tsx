'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from "next/navigation"; // Import useRouter
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import { useSession } from "next-auth/react";

export default function ResetPassword() {
  const params = useParams()
  const { id, token } = params
  const { data: session } = useSession();
   const [password, setPassword] = useState('');
    const [error2, setError2] = useState(""); // Password validation error state
     const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
     const l = useLocale();
     const router = useRouter(); // Initialize the router
     const locale = useLocale(); // Get the current locale
     const t = useTranslations('Login');
     const te = useTranslations('user-dashboard');
     const [showPassword, setShowPassword] = useState(false); // Show password state
     const validatePassword = (password: string): string | null => {
      // Check if password is at least 8 characters long
      if (password.length < 8) {
        return t('8-characters');
      }
  
      // Check if password contains at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        return t('uppercase');
      }
  
      // Check if password contains at least one lowercase letter
      if (!/[a-z]/.test(password)) {
        return t('lowercase');
      }
  
      // Check if password contains at least one digit
      if (!/[0-9]/.test(password)) {
        return t('number');
      }
  
      // Check if password contains at least one special character
      if (!/[!@#$%^&*]/.test(password)) {
        return t('character');
      }
  
      // If all conditions are met, return null (no error)
      return null;
    };




  const handleSubscribe = async () => {
   
  
       setIsLoadingg(true);
       // Validate password
       const passwordError = validatePassword(password);
       if (passwordError) {
         setError2(passwordError);
         setIsLoadingg(false); // Stop loading state
         return;
       }
  
   
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password_confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uid:id,
            token:token,
            new_password:password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
    } catch (error) {
      console.error('Error updates', error);
      return false;
    }finally{
        setIsLoadingg(false);
        {session?.user ? router.push(`/${l}/account`): router.push(`/${l}/login-signin`)}
        
    }
  };






  return (
    <div className='my-40 mx-6 md:mx-auto md:w-96'>
        <h1 className='uppercase font-medium mb-4'> {te('reset-password')}write your new password</h1>
        <div>
        <div className="relative ">
                    <input
     type={showPassword ? "text" : "password"}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     placeholder="New password"
     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
     required
   />
    {locale == "ar" ? 
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute left-2 top-2 text-gray-500 hover:text-gray-700 flex items-center justify-center w-6 h-6"
               >
                 {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
               </button>
               : <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 flex items-center justify-center w-6 h-6"
             >
               {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
             </button>
             }
             </div>
    {error2 && <p className="text-bl text-sm mt-2">{error2}</p>}
                </div>

                <div className='mt-8'> 
                    {isLoadingg ? (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
                                    >
                                       {te('Edite')}
                                      <FaCircleNotch className="animate-spin w-5 h-5"/>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleSubscribe}
                                      className="w-full bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
                                    >
                                     {te('Edite')}
                                    </button>
                                  )}
                </div>
    </div>
  )
}
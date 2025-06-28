'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from "next-intl";
import { useLocale } from 'next-intl';
import MailChecker from "mailchecker";
import validator from "validator";
import moment from 'moment';
import { FaCircleNotch } from "react-icons/fa";
import { useSession} from "next-auth/react";
import { signIn } from "next-auth/react";
import { Link } from '@/i18n/routing';
import useFetcherUser from './FtecherUser';
import { FaEye, FaEyeSlash, } from "react-icons/fa"; // Import FaCopy
import { useRouter } from "next/navigation";


export default function Info() {

  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [full_name, setFull_name] = useState('');
  const [address_line_1, setAddress_line_1] = useState('');
  const [address_line_2, setAddress_line_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [codePhone, setCodePhone] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoadingg, setIsLoadingg] = useState(false); // Loading state
  const [error, setError] = useState('');
  const [errorpassword, setErrorpassword] = useState('');
  const [isloaddinglogin, setIsLoadingLogin] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null); // Track email existence
  const [password, setPassword] = useState('');
  const [validatename, setValidatename] = useState(false);
  const [validateaddress, setValidateddress] = useState(false);
  const [validatecity, setValidatecity] = useState(false);
  const [validatestate, setValidatestate] = useState(false);
  const [validatepostalCode, setValidatepostalCode] = useState(false);
  const [validatephone, setValidatephone] = useState(false);
  const [validatecodePhone, setValidatecodePhone] = useState(false);
  const [validatecountryCode, setValidatecountryCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [passwordSuggestion, setPasswordSuggestion] = useState(""); // Password suggestion state


  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
  const [wrong, setWrong] = useState(false);

   const { userinfo, revalidate, isLoading} = useFetcherUser();
  const [erroremailexist, setErroremailexist] = useState(false);
  const t = useTranslations('cart-c');
  const te = useTranslations('Login');
  const m = useTranslations('Hero');
  const router = useRouter();
const l = useLocale()
const now = moment();
 
const passwordRef = useRef(''); // Ref to store the password

  

  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    if (!email || email.trim() === "") {
      return { valid: false, message: te('Email-is-required') };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: te('Invalid-email-format') };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, message: te('Invalid-email-format') };
    }

    if (!MailChecker.isValid(email)) {
      return { valid: false, message: te('Disposable-emails') };
    }

    return { valid: true };
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}userglobal/?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return Array.isArray(data) && data.length > 0; // If the returned data is an empty array, email does not exist
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };
 
  // Effect to check email existence in real-time
  useEffect(() => {
   
    const validateEmailAndCheckExistence = async () => {
      if (email) {
        const emailValidation = await isValidEmail(email);
        if (!emailValidation.valid) {
          setError(emailValidation.message || te('Invalid-email'));
          setEmailExists(null); // Reset email existence state
          return;
        }

        const exists = await checkEmailExists(email);
        setEmailExists(exists);
        setError(''); // Clear any previous errors
      } else {
        setEmailExists(null); // Reset email existence state if email is empty
        setError(''); // Clear any previous errors
      }
    };

    // Add a delay to avoid making too many API calls
    const delayDebounceFn = setTimeout(() => {
      validateEmailAndCheckExistence();
    }, 300); // 500ms delay

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [email,isValidEmail, te]);


 const resetPassword = async () => {
 
try {
  const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
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

 const handleLogin = async () => {
  setIsLoadingLogin(true);
   const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
  
        if (result?.error) {
          setErrorpassword(t('verifypassword')); // Set error message
          setIsLoadingLogin(false)
        } else {
          setIsLoadingLogin(false); // Redirect to protected page
        }
        return;
      
 } 






 const language = l;
 const date = now.format('MMMM Do YYYY');
 const time = now.format('h:mm:ss a');

 const med = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Update state and ref
  setPasswordSuggestion(password);
  passwordRef.current = password; // Store the password in the ref



const emailValidation = await isValidEmail(email);
if (!emailValidation.valid) {
  setError(emailValidation.message || te('Invalid-email'));
  setIsLoadingg(false);
  return;
}

if (emailExists) {
  setErroremailexist(true);
  return;
}
setErroremailexist(false);
setIsLoadingg(true);
try {
  
  const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  setIsLoadingg(false);
  if (!result?.ok) {
    throw new Error("Sign-in failed");
  }
  setWrong(true)
} catch (err) {
  setError(te("An-error-occurred-during-sign-in"));
  console.error(te("Sign-in-error:"), err);
}

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    body: JSON.stringify({
      full_name,
      email,
      password: passwordSuggestion,
      language,
      time,
      date,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return

}





  const handleSubscribe = async () => {
    

    if (!full_name || !address_line_1 ||  !city || !state || !countryCode || !phone || !postalCode || !codePhone) {
      setValidatename(true); 
      setValidatecity(true);// Add a translation key for name error
      setValidatecodePhone(true);
      setValidatecountryCode(true);
      setValidateddress(true);
      setValidatephone(true);
      setValidatepostalCode(true);
      setValidatestate(true);
      return;
    }
   const phoneNumber = codePhone + phone

   setIsLoadingg(true);
   try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${session?.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
      },
      body: JSON.stringify({
        full_name,
        address_line_1,
        address_line_2,
        city,
        state,
        countryCode,
        postalCode,
        phoneNumber
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    revalidate();

    return data; // If the returned data is an empty array, email does not exist
  } catch (error) {
    console.error('Error updates', error);
    return false;
  }finally{
   
    router.push(`/${l}/cart/checkout/checkout-payment`);
  }
  
  };

 

  return (
    <div className="space-y-8">
      
      <h1 className="text-xl font-bold uppercase">{t('address-and-contact-title')}</h1> 
  
   
   
      <div>
        <div className="flex flex-col space-y-4">
           <div className='flex justify-between items-center flex-wrap'>
         <h1 className="text-sm font-medium uppercase">{t('constactinfo')}</h1>
     {userinfo?.full_name?  
     <Link href="/cart/checkout/checkout-payment"  className="underline font-medium">
       {t('use-my-address')}
     </Link>
    :""}
     </div>
          {session?.user?
            "" :
            <div className='space-y-2'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email')}
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            />
            {error && <p className="text-bl text-sm">{error}</p>}
           
            </div>
            }
          
          
          
        
          {session?.user?
            "" :
        
          (emailExists !== null && (
            <div >
              {emailExists ? 
              <div className='p-4 space-y-4 bg-gray-50 '>
                <h1 className='text-gray-800 uppercase text-sm font-semibold'>{t('have-account-1')}</h1>
                <p className='text-sm text-gray-600'>{t('have-account-2')}</p>
                <p className='text-sm text-gray-600'>{t('have-account-3')}</p>
                <div className='flex gap-2'>
                <div className="relative w-full">
                <input
               type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            />
             {l == "ar" ? 
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
              {isloaddinglogin ? 
              
              <button
              onClick={handleLogin}
              className="w-2/3 bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase flex gap-3 justify-center items-center"
            >
              {t('login')}
              <FaCircleNotch className="animate-spin w-5 h-5" />
            </button>

              : 
              <button
              onClick={handleLogin}
              className="w-2/3 bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
            >
             {t('login')} 
            </button>}
            </div> {errorpassword&& <p className="text-bl text-sm">{errorpassword}</p>}
            <p className='text-sm text-gray-600'>{t('forgot-password')}<span className='font-bold underline cursor-pointer' onClick={resetPassword}>{t('click-here')}</span> </p>
             {emailsend? <p className='text-bl text-sm'>{t('email-send')}</p>:""}
             {emailsenderror? <p  className='text-bl text-sm'>{t('email-send-error')}</p>:""}
              </div> : 
              ''}
            </div>
          ))
        }
     

     {session?.user?
    <div className='space-y-4'>
       <input
              type="text"
              value={full_name}
              onChange={(e) => setFull_name(e.target.value)}
              placeholder={t('full-name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              required
            />
            {validatename? <p className='text-bl text-xs sm:text-sm'>{t('enter-name')}</p> :""}
         
          <div className='flex gap-2'>
          <div className='w-36 space-y-2'>
            <input
              type="text"
              value={codePhone}
              onChange={(e) => setCodePhone(e.target.value)}
              placeholder={t('exp')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              pattern="^\+\d{1,4}$"
              required
            />
             {validatecodePhone? <p className='text-bl text-xs sm:text-sm'>{t('enter-code')}</p> :""}
             </div>
             <div className='w-full space-y-2'>
           {l == 'ar' ?    <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              pattern="^\+?[0-9\s\-]{7,15}$"
              required
            dir="rtl"
            /> :  <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            pattern="^\+?[0-9\s\-]{7,15}$"
            required
        
          /> }
             {validatephone? <p className='text-bl text-xs sm:text-sm'>{t('enter-phone')}</p> :""}
             </div>
          </div>
          <h1 className="text-sm font-medium uppercase">{t('shipping-address')}</h1>
          <div className='w-full space-y-2'>
          <input
            type="text"
            value={address_line_1}
            onChange={(e) => setAddress_line_1(e.target.value)}
            placeholder={t('adress-1')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validateaddress? <p className='text-bl text-xs sm:text-sm'>{t('enter-address')}</p> :""}
           </div>
         
          <input
            type="text"
            value={address_line_2}
            onChange={(e) => setAddress_line_2(e.target.value)}
            placeholder={t('adress-2')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
          />
        
           <div className='w-full space-y-2'>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('city')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validatecity? <p className='text-bl text-xs sm:text-sm'>{t('enter-city')}</p> :""}
           </div>
           <div className='w-full space-y-2'>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder={t('state')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
            required
          />
           {validatestate? <p className='text-bl text-xs sm:text-sm'>{t('enter-state')}</p> :""}
           </div>
          <div className=' flex gap-2'>
          <div className='w-full space-y-2'>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder={t('country')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              required
            />
             {validatecountryCode? <p className='text-bl text-xs sm:text-sm'>{t('enter-country')}</p> :""}
             </div>
             <div className='w-full space-y-2'>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder={t('zip')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              required
              pattern="^[A-Za-z0-9\s\-]{4,10}$"
            />
             {validatepostalCode? <p className='text-bl text-xs sm:text-sm'>{t('enter-zip')}</p> :""}
             </div>
          </div>
          </div>
: ""}


          {session?.user?
          (isLoadingg ? (
            <button
              onClick={handleSubscribe}
              className="w-2/3 sm:w-1/3  hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
            >
            {t('continue')} 
              <FaCircleNotch className="animate-spin w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              className="w-2/3 sm:w-1/3  bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
            >
           {t('continue')} 
            </button>
          ))
:

(isLoadingg ? (
  <button
    onClick={med}
    className="w-2/3 sm:w-1/3  hover:bg-secondary hover:text-yel py-2 rounded-lg bg-yel ext-black transition-colors uppercase flex gap-3 justify-center items-center"
  >
  {t('continue')}
    <FaCircleNotch className="animate-spin w-5 h-5" />
  </button>
) : (
  <div>
  <button
    onClick={med}
    className="w-2/3 sm:w-1/3  bg-secondary text-yel py-2 rounded-lg hover:bg-yel font-medium hover:text-black transition-colors uppercase"
  >
 {t('continue')} 
  </button>
  {wrong ? <p className="text-bl text-sm">{t('someting-wrong')}</p> :""}
</div>
))
}
{erroremailexist ? <p className='text-bl text-sm'>{t('login-or-try-with-new-email')}</p> : ""}



          <p className='text-gray-500 text-xs'>{m('security-msg')}</p>
        </div>
      </div>
      <hr className="border-gray-300" />
      <h1 className="text-xl font-bold uppercase">{t('payment-and-shipping')}</h1>
  
    </div>
  );
}



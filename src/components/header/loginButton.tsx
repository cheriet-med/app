'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocale } from 'next-intl';
import { FiUser } from "react-icons/fi";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiCloseLargeLine } from "react-icons/ri";


import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import MailChecker from "mailchecker";
import validator from "validator";


const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
  const t = useTranslations('Login');
  const te = useTranslations('tophero');
  const l = useLocale();
  const router = useRouter();
  const locale = useLocale(); // Get the current locale
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [error1, setError1] = useState(""); // Email validation error state
  const [error2, setError2] = useState(""); // Password validation error state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [passwordSuggestion, setPasswordSuggestion] = useState(""); // Password suggestion state
  const [isCopied, setIsCopied] = useState(false); // Track if password is copied

  const [email, setEmail] = useState('');
  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
  const [enteremail, setEnteremail] = useState(false);


  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    // Step 1: Check if the email is empty or null
    if (!email || email.trim() === "") {
      return { valid: false, message: t('Email-is-required') };
    }

    // Step 2: Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    // Step 3: Validate email format using validator library
    if (!validator.isEmail(email)) {
      return { valid: false, message: t('Invalid-email-format') };
    }

    // Step 4: Check if the email is disposable using mailchecker
    if (!MailChecker.isValid(email)) {
      return { valid: false, message: t('Disposable-emails') };
    }

    // If all checks pass, the email is valid
    return { valid: true };
  };

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

  const generatePasswordSuggestion = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordSuggestion(password);
  };

  const handlePasswordFocus = () => {
    generatePasswordSuggestion();
  };



 const resetPassword = async () => {
  if(!email){
    setEnteremail(true)
    return
  }
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
  

  


  const handleCopyPassword = () => {
    if (passwordSuggestion) {
      navigator.clipboard.writeText(passwordSuggestion)
        .then(() => {
          setIsCopied(true); // Show "Copied!" text
          setTimeout(() => setIsCopied(false), 2000); // Hide "Copied!" text after 2 seconds
        })
        .catch(() => {
          console.error(t('Failed-to-copy-password')); // Handle error
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    setError(null); // Reset error state
    setError1(""); // Reset email validation error state
    setError2(""); // Reset password validation error state

    const formData = new FormData(e.currentTarget);
    const email = formData.get(t('email')) as string;
    const password = formData.get(t('password')) as string;

    // Validate email
    const emailValidation = await isValidEmail(email);
    if (!emailValidation.valid) {
      setError1(emailValidation.message || t('Invalid-email'));
      setIsLoading(false); // Stop loading state
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError2(passwordError);
      setIsLoading(false); // Stop loading state
      return;
    }

    try {
      // Make the fetch request
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

      // Sign in using NextAuth's credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t('Please-verify-your-email-or-password')); // Set error message
      } else {
        router.push(`/${locale}/account`); // Redirect to protected page
      }
    } catch (err) {
      setError(t('An-error-occurred-during-sign-in')); // Set generic error message
      console.error(t('Sign-in-error:'), err);
    } finally {
      setIsLoading(false); // Reset loading state
      setIsOpen(false)
    }
  };

  























  // Close the dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the dialog
      }
    };

    // Add event listener when the dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when `isOpen` changes

  return (
    <>
      {/* Button to open the dialog */}

      <div 
  className="relative group cursor-pointer  hidden custom:block" 
  onClick={() => setIsOpen(true)}
>
  <p className="relative inline-block text-bl hover:text-primary font-semibold pb-4 ">
    Sign in
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
  </p>
  <span className="ml-1.5 -translate-y-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
    1
  </span>
</div>


      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={dialogRef} // Attach the ref to the dialog container
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
          >
            {/* Close Button */}
            {l === "ar" ? (
              <RiCloseLargeLine
                size={24}
                className="absolute top-2 left-2 text-primary hover:text-gray-700 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            ) : (
              <RiCloseLargeLine
                size={24}
                className="absolute top-2 right-2 text-primary hover:text-gray-700 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto">
   <div className=" flex flex-col ">
   <div className="flex justify-center">
  <div className="relative h-40 w-60">
    <Image
      src="/log.png"
      alt={te('logo-padlev-yellow')}
      sizes="100%"
      fill
      style={{ objectFit: "contain" }}
      priority
    />
  </div>
</div>
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <h2 className="text-primary font-semibold uppercase ">
          {t('text-3')}
          </h2>
   
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 placeholder-bl focus:ring-primary"
          />
          {error1 && <p className="text-bl text-sm">{error1}</p>}

          <p className="text-primary text-xs">
          {t('text-4')}
          </p>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 placeholder-bl focus:ring-primary"
              onFocus={handlePasswordFocus}
            />
           {locale == "ar" ? 
            <button
            aria-label= {t('sign in')}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-2 top-2 text-gray-200 hover:text-gray-700 flex items-center justify-center w-6 h-6"
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
            </button>
            : <button

            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-primary hover:text-gray-700 flex items-center justify-center w-6 h-6"
          >
            {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
          </button>
          }
          </div>
          {passwordSuggestion && (
            <div className="flex items-center gap-2  flex-wrap">
              <p className="text-primary text-sm ">
              {t('text-5')} 
              </p>
              <div className='space-x-2'>
              <span className="font-semibold text-primary">{passwordSuggestion} </span>
              <button
               aria-label= {t('sign in')}
                type="button"
                onClick={handleCopyPassword}
                className="text-primary hover:text-gray-700"
              >
                <FaCopy className="w-3 h-3"/>
              </button>
              {isCopied && <span className="text-sm text-green-500">{t('Copied')}</span>}
              </div>
              
            </div>
          )}
          {error2 && <p className="text-bl text-sm">{error2}</p>}
          {error && <p className="text-bl text-sm">{error}</p>}

          <p className="text-primary text-sm">
          {t('text-6')}{" "} <span className="font-semibold underline cursor-pointer" onClick={resetPassword}> {t('text-7')}</span></p>
          {emailsend? <p className='text-bl text-sm'>{t('emailsend')}</p>:""}
          {emailsenderror? <p  className='text-bl text-sm'>{t('emailsenderror')}</p>:""}
          {enteremail? <p  className='text-bl text-sm'>{t('enteremail')}</p> :""}


          
          {isLoading ? (
            <button
            aria-label= {t('sign in')}
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-yel font-medium hover:text-gray-20 transition-colors uppercase flex gap-3 justify-center items-center"
            >
                {t('sign in')} <FaCircleNotch className="animate-spin w-5 h-5"/>
            </button>
          ) : (
            <button
            aria-label= {t('sign in')}
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-yel font-medium hover:text-gray-200 transition-colors uppercase"
            >
              {t('sign in')}
            </button>
          )}
         
        </form>
      </div>
<div className='flex flex-col justify-center text-center items-center pt-5 gap-3'>

<p className='uppercase font-bold '>Or</p>
<button
    aria-label=""
    type="button"
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium uppercase"
  >
    <img src="/google.png" alt="Google" className="w-5 h-5" />
    Continue with Google
  </button>
  <button
    aria-label=""
    type="button"
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2 rounded-lg hover:bg-[#145dbf] transition-colors font-medium uppercase"
  >
    <img src="/facebook.png" alt="Facebook" className="w-5 h-5" />
    Continue with Facebook
  </button>
<p className='text-primary text-xs'>By continuing, you agree to TrustDine's <span className='font-bold underline cursor-pointer'>Terms of Service</span> and acknowledge that you have read our <span className='font-bold underline cursor-pointer'>Privacy Policy</span></p>
</div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
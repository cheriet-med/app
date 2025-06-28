"use client"; // Mark this as a Client Component

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import MailChecker from "mailchecker";
import validator from "validator";
import { useTranslations } from "next-intl";

export default function LoginSignIn() {
  const t = useTranslations('Login');
  
  const router = useRouter();
  const locale = useLocale(); // Get the current locale
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [error1, setError1] = useState(""); // Email validation error state
  const [error2, setError2] = useState(""); // Password validation error state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [passwordSuggestion, setPasswordSuggestion] = useState(""); // Password suggestion state
  const [isCopied, setIsCopied] = useState(false); // Track if password is copied
  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
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

    
  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get(t('email')) as string;
    try {
      const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:email,
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
      const neo = await fetch("/api/signin", {
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
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4">
       


        <h1 className="text-xl font-bold uppercase">{t('log-tit')}</h1>
        <p className="text-gray-600 text-sm">{t('log-des')}</p>
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
          />
          {error1 && <p className="text-bl text-sm">{error1}</p>}

          <p className="text-gray-500 text-xs">
          {t('text-4')}
          </p>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              onFocus={handlePasswordFocus}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 flex items-center justify-center w-6 h-6"
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5"/> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
          {passwordSuggestion && (
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-sm">
              {t('text-5')} <span className="font-semibold text-primary">{passwordSuggestion}</span>
              </p>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaCopy className="w-3 h-3" />
              </button>
              {isCopied && <span className="text-sm text-green-500">{t('Copied')}</span>}
            </div>
          )}
          {error2 && <p className="text-bl text-sm">{error2}</p>}
          {error && <p className="text-bl text-sm">{error}</p>}

          <p className="text-gray-600 text-sm">
          {t('text-6')}{" "} <span className="font-semibold underline cursor-pointer" onClick={()=>resetPassword}> {t('text-7')} </span></p>
          {emailsend? <p className='text-bl text-sm'>{t('emailsend')}</p>:""}
          {emailsenderror? <p  className='text-bl text-sm'>{t('emailsenderror')}</p>:""}
          {isLoading ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full hover:bg-yel hover:text-secondary py-2 rounded-lg bg-secondary text-yel font-medium transition-colors uppercase flex gap-3 justify-center items-center"
            >
                {t('sign in')} <FaCircleNotch className="animate-spin w-5 h-5"/>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full hover:bg-yel hover:text-secondary py-2 rounded-lg bg-secondary text-yel font-medium transition-colors uppercase"
            >
              {t('sign in')}
            </button>
          )}
          
        </form>
      </div>
   
  );
}
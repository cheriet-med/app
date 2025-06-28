"use client"; // Mark this as a Client Component

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa"; // Import FaCopy
import MailChecker from "mailchecker";
import validator from "validator";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations('Login');
  const te = useTranslations('tophero');
  const router = useRouter();
  const l = useLocale(); 
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


    function images() {
      return l == "ar" ? "/login-image/لاعبة-بادل-تمسك-بالكرة-والمضرب-في-الملعب.avif" :
        (l == "de" ? "/login-image/padel-spieler-hält-einen-ball-und-schläger-auf-dem-platz.avif" :
          (l == "es" ? "/login-image/jugador-de-padel-sosteniendo-una-bola-y-pala-en-la-cancha.avif" :
            (l == "fr" ? "/login-image/joueur-de-padel-tenant-une-balle-et-un-raket-sur-le-terrain.avif" :
              (l == "it" ? "/login-image/giocatore-di-padel-che-tiene-la-palla-e-la-racchetta-sul-campo.avif" :
                (l == "nl" ? "/login-image/padel-speler-houdt-een-bal-en-racket-op-het-court.avif" :
                  (l == "pt" ? "/login-image/jogador-de-padel-segurando-uma-bola-e-raquete-na-pista.avif" :
                    (l == "ru" ? "/login-image/padel-igrok-derzhit-myach-i-raketku-na-korte.avif" :
                      (l == "sv" ? "/login-image/padel-spelare-hallande-en-boll-och-racket-pa-banan.avif" :
                        "/login-image/padel-player-holding-a-ball-and-racket-on-the-court.avif"
                      )
                    )
                  )
                )
              )
            )
          )
        );
    }
  




  function logo() {
    return l == "ar" ? "/logo-standard/شعار-بادليف-لحساب-عادي.webp" :
      (l == "de" ? "/logo-standard/padlev-logo-für-standardkonto.webp" :
        (l == "es" ? "/logo-standard/logo-padlev-para-cuenta-estándar.webp" :
          (l == "fr" ? "/logo-standard/logo-padlev-pour-compte-standard.webp" :
            (l == "it" ? "/logo-standard/logo-padlev-per-account-standard.webp" :
              (l == "nl" ? "/logo-standard/padlev-logo-voor-standaardaccount.webp" :
                (l == "pt" ? "/logo-standard/logo-padlev-para-conta-padrão.webp" :
                  (l == "ru" ? "/logo-standard/logotip-padlev-dlya-standartnogo-akkaunta.webp" :
                    (l == "sv" ? "/logo-standard/padlev-logo-for-standardkonto.webp" :
                      "/logo-standard/padlev-logo-for-standard-account.webp"
                    )
                  )
                )
              )
            )
          )
        )
      );
  }


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
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20 mx-6 lg:pt-20 custom:mx-52">
      <div className="col-span-1 relative h-full w-full">
        <Image
          src={images()}
          alt={te('login-tag')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="col-span-1  flex flex-col justify-start">
        <div className="relative h-40 w-60">
          <Image
            src={logo()}
            alt={te('logo-padlev-yellow')}
            sizes='100%'
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="font-semibold text-2xl text-secondary uppercase">
           {t('text-1')}
          </h1>
          <p className="text-gray-600 text-sm">
          {t('text-2')}
          </p>
          <h2 className="text-gray-800 font-semibold">
          {t('text-3')}
          </h2>
   
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

          <div className="relative ">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-yel"
              onFocus={handlePasswordFocus}
            
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
          {t('text-6')}{" "} <span className="font-semibold underline cursor-pointer" onClick={resetPassword}> {t('text-7')}</span></p>
          {emailsend? <p className='text-bl text-sm'>{t('emailsend')}</p>:""}
          {emailsenderror? <p  className='text-bl text-sm'>{t('emailsenderror')}</p>:""}
          {enteremail? <p  className='text-bl text-sm'>{t('enteremail')}</p> :""}
      
          {isLoading ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-72 bg-secondary text-yel py-2 rounded-lg hover:bg-yel hover:text-black font-medium transition-colors uppercase flex gap-3 justify-center items-center"
            >
                {t('sign in')} <FaCircleNotch className="animate-spin w-5 h-5"/>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-72 bg-secondary text-yel py-2 rounded-lg  hover:bg-yel hover:text-black font-medium transition-colors uppercase"
            >
              {t('sign in')}
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-400">{t('text-8')}</h1>
          <p className="text-gray-400 text-sm">
          {t('text-9')}{" "}
            <Link href="/privacy-policy" className="font-semibold underline">
            {t('Privacy Policy')}
            </Link>
          </p>
          <p className="text-gray-400 text-sm">
          {t('text-10')}
          </p>
        </form>
      </div>
    </div>
  );
}
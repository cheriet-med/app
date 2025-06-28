import React from 'react';
import { RiCoupon3Fill } from "react-icons/ri";
import Image from 'next/image';
import { GiTwoCoins } from "react-icons/gi";
import { useTranslations } from "next-intl"
import { useLocale } from 'next-intl';

const PercentageStepper = ({ currentNumber }:{currentNumber:any}) => {
  const targetValue = 4000; // Changed to 2,000 as requested
  const percentage = Math.min((currentNumber / targetValue) * 100, 100);
  const te = useTranslations('user-dashboard');
  const tl = useTranslations('tophero');
  const l = useLocale();



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




function gold() {
  return l == "ar" ? "/logo-gold/شعار-بادليف-للحساب-الذهبي.webp" :
    (l == "de" ? "/logo-gold/padlev-logo-fuer-gold-konto.webp" :
      (l == "es" ? "/logo-gold/logo-padlev-para-cuenta-oro.webp" :
        (l == "fr" ? "/logo-gold/logo-padlev-pour-compte-or.webp" :
          (l == "it" ? "/logo-gold/logo-padlev-per-account-oro.webp" :
            (l == "nl" ? "/logo-gold/padlev-logo-voor-gouden-account.webp" :
              (l == "pt" ? "/logo-gold/logo-padlev-para-conta-ouro.webp" :
                (l == "ru" ? "/logo-gold/logotip-padlev-dlya-zolotogo-akkaunta.webp" :
                  (l == "sv" ? "/logo-gold/padlev-logotyp-for-guldkonto.webp" :
                    "/logo-gold/padlev-logo-for-gold-account.webp"
                  )
                )
              )
            )
          )
        )
      )
    );
}






function platinum() {
  return l == "ar" ? "/logo-platinum/شعار-بادليف-للحساب-البلاتيني.webp" :
    (l == "de" ? "/logo-platinum/padlev-logo-fuer-platin-konto.webp" :
      (l == "es" ? "/logo-platinum/logotipo-de-padlev-para-cuenta-platino.webp" :
        (l == "fr" ? "/logo-platinum/logo-padlev-pour-compte-platine.webp" :
          (l == "it" ? "/logo-platinum/logo-padlev-per-account-platino.webp" :
            (l == "nl" ? "/logo-platinum/padlev-logo-voor-platinum-account.webp" :
              (l == "pt" ? "/logo-platinum/logo-padlev-para-conta-platinum.webp" :
                (l == "ru" ? "/logo-platinum/logo-padlev-dlya-platinovogo-akkaunta.webp" :
                  (l == "sv" ? "/logo-platinum/padlev-logotyp-for-platinum-konto.webp" :
                    "/logo-platinum/padlev-logo-for-platinum-account.webp"
                  )
                )
              )
            )
          )
        )
      )
    );
}


  return (
    <div className='space-y-4'>
         <div className="relative h-20 w-40">
                <Image
                  src={logo()}
                  alt={tl('logo-padlev-yellow')}
                  fill
                  sizes='100%'
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
      
        <div className='bg-zinc-50 p-4'>
        {currentNumber >= 4000 ? <p className='uppercase mb-2 font-medium text-green-700'>{te('percent-of-40')}</p>: 
        (currentNumber >= 2000 ? <div> <p className='uppercase mb-2'>{te('total-number')}{" "}<span className='font-semibold'>{currentNumber}</span> - <span className='text-green-700 font-medium'>{te('percent-of-20')}</span></p></div>:
       <p className='uppercase mb-2'>{te('total-number')}{" "}<span className='font-semibold'>{currentNumber}</span></p>)}
      <div className="relative h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            percentage === 100 ? 'bg-green-700' : 'bg-green-500'
          } transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          
        </div>
      </div>
     
      <div className="flex justify-between items-center">
      {currentNumber > 4000 ? "":    <span className="font-semibold text-gray-800">{currentNumber}</span>}
            {currentNumber >= 2000 ? "" :   <span className="font-semibold text-gray-800">2000</span>}
        {currentNumber > 4000 ? "":   <span className="font-semibold text-gray-800">4000</span>}
       
      </div>

    </div>
    {currentNumber >= 4000 ? 
    <div className='p-3 border border-spacing-1 space-y-2'>
      <h1 className='text-xl font-bold text-secondary'>{te('vip-title')}</h1>
      <div className='text-gray-700'>
        <p>{te('vip-text-1')}</p>
      <p>{te('vip-text-2')}</p>
      <p>{te('vip-text-3')}</p>
      <p>{te('vip-text-4')}</p>
      </div>
      
<p className='font-bold'>{te('vip-text-5')}</p>
<p className='font-bold'>{te('vip-text-6')}</p>
    </div>
    
    :
<div className='border border-spacing-1 p-3 space-y-2'>
  <h1 className='text-2xl font-bold text-gray-900'>{te('level-title')}</h1>
  <p className='text-gray-700'>{te('lev-1')} {currentNumber >= 2000 ? <span>{te('lev-2')}</span> : <span>{te('lev-3')}</span>} {te('lev-4')} {currentNumber} {te('lev-9')}</p>
  <p className='text-gray-700'>{te('lev-5')}</p>
 <hr />
 <p className='text-lg font-bold text-gray-900'>{te('lev-6')}</p>
 {currentNumber >= 2000 ? "" : <p className='font-semibold'>{te('lev-7')}<span className='text-gray-700 font-normal'>– {te('lev-8')}</span> 2000 {te('lev-9')}</p>}
 <p className='font-semibold'>{te('lev-10')}<span className='text-gray-700 font-normal'>– {te('lev-11')}</span> 4000 {te('lev-12')}</p>
 <p className='text-gray-700'><span className='font-semibold'>{te('lev-13')}:</span> {te('lev-14')}</p>
 <hr />

 <h1 className='text-lg font-bold text-gray-900'>{te('lev-15')}</h1>
 <div className='flex gap-10 py-4 flex-wrap'>
 {currentNumber >= 2000 ? "" : 
 <div className='space-y-1'>

 <div className="relative h-20 w-40">
                <Image
                  src={gold()}
                  alt={tl('logo-padlev-gold')}
                  fill
                  sizes='100%'
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <p className='font-semibold'>{te('lev-16')}:</p>
              <div className='flex gap-1 items-center'>
              <GiTwoCoins className='text-yellow-500'/>
              <p className='text-gray-700'>{te('lev-17')}</p>
              </div>
              <div className='flex gap-1 items-center'>
              <RiCoupon3Fill className='text-rose-500'/>
              <p className='text-gray-700'>{te('lev-18')}</p>
</div>
 </div>}
 <div className='space-y-1'>

 <div className="relative h-20 w-40">
                <Image
                  src={platinum()}
                  alt={tl('logo-padlev-platinum')}
                  fill
                  sizes='100%'
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <p className='font-semibold'>{te('lev-21')}:</p>
              <div className='flex gap-1 items-center'>
                 <GiTwoCoins className='text-yellow-500'/>
                 <p className='text-gray-700'>{te('lev-22')}</p>
              </div>
              <div className='flex gap-1 items-center'>
              <RiCoupon3Fill className='text-rose-500'/>
              <p className='text-gray-700'>{te('lev-23')}</p>
</div>
 </div>
             
</div>
<p className='text-gray-700'>{te('lev-24')}</p>

  </div>     }
    </div>
  
  );
};

export default PercentageStepper;



/** {percentage.toFixed(percentage === 100 ? 0 : 1)}% */
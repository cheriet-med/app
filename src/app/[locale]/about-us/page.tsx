import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import {getLocale } from "next-intl/server";

export default async function AboutPage() {


  const l = await getLocale();
  function images() {
    return l == "ar" ? "/about-us/2023-10-27-العمدة-باولا-ماسكارينهاس-تستقبل-بطلة-البادل-مرتين.avif" :
      (l == "de" ? "/about-us/2023-10-27-buergermeisterin-paula-mascarenhas-empfaengt-zweifache-padel-meisterin.avif" :
        (l == "es" ? "/about-us/2023-10-27-alcaldesa-paula-mascarenhas-recibe-a-la-bi-campeona-de-padel.avif" :
          (l == "fr" ? "/about-us/2023-10-27-mairesse-paula-mascarenhas-recoit-la-double-championne-de-padel.avif" :
            (l == "it" ? "/about-us/2023-10-27-sindaca-paula-mascarenhas-riceve-la-bi-campionessa-di-padel.avif" :
              (l == "nl" ? "/about-us/2023-10-27-burgemeester-paula-mascarenhas-ontvangt-de-tweevoudig-padelkampioen.avif" :
                (l == "pt" ? "/about-us/2023-10-27-alcaldesa-paula-mascarenhas-recibe-a-la-bi-campeona-de-padel.avif" :
                  (l == "ru" ? "/about-us/2023-10-27-mer-paula-maskarenas-prinimaet-dvukratnuyu-chempionku-po-padelu.avif" :
                    (l == "sv" ? "/about-us/2023-10-27-fordamote-paula-maskarenhas-mottar-dubbelmastarinnan-i-padel.avif" :
                      "/about-us/2023-10-27-Mayor-Paula-Mascarenhas-receives-the-Two-Time-Padel-Champion.avif"
                    )
                  )
                )
              )
            )
          )
        )
      );
  }




  const t = await getTranslations('AboutPage');
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-700">
      <h1 className="text-2xl font-bold mb-8 text-center uppercase">{t('title')}</h1>

      <section className="space-y-4">
        <p >
          {t('section-1-p1')}
        </p>

        <h2 className="text-xl font-semibold mt-8">{t('section-2-title')}</h2>
        <p>
          {t('section-2-p1')}
        </p>

        <h2 className="text-xl font-semibold mt-8">{t('section-3-title')}</h2>
        <p >
          {t('section-3-p1')}
        </p>
        <p >
          {t('section-3-p2')}
        </p>
        <h2 className="text-xl font-semibold mt-8">{t('section-4-title')}</h2>
        <p >
          {t('section-4-p1')}
        </p>
        <p >
          {t('section-4-p2')}
        </p>
        <h2 className="text-xl font-semibold mt-8">{t('section-5-title')}</h2>
        <p >
          {t('section-5-p1')}
        </p>
        <p >
          {t('section-5-p2')}
        </p>
        <h2 className="text-xl font-semibold mt-8">{t('section-6-title')}</h2>
        <p >
          {t('section-6-p1')}
        </p>
      <div className="col-span-1 relative h-96  sm:h-[500px] w-full">
        <Image
          src={images()}
          alt={t('tag')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold mb-4">{t('section-7-title')}</h2>
          <p >
            {t('section-7-p1')}
          </p>
          <p>
            {t('section-7-p2')}
          </p>
        </div>
      </section>
    </main>
  );
}

import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
export default async function TermsAndConditions() {
  const t = await getTranslations('TermsAndConditions');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-700">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-extrabold uppercase">{t('title')}</h1>
       {/*  <p className="mt-2 text-lg text-gray-600">Last Updated: 01-01-2025</p> */}
      </header>

      {/* Introduction */}
      <section className="mb-8">
        <p className="mb-4">{t('intro')}</p>
        <p>{t('acceptance.content')}</p>
      </section>

      {/* Section 1: Service */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('service.title')}</h2>
        <p>{t('service.content')}</p>
      </section>

      {/* Section 2: Eligibility */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('eligibility.title')}</h2>
        <p>{t('eligibility.content')}</p>
      </section>

      {/* Section 3: Account Registration */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('accountRegistration.title')}</h2>
        <p>{t('accountRegistration.content')}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{t('accountRegistration.list.0')}</li>
          <li>{t('accountRegistration.list.1')}</li>
          <li>{t('accountRegistration.list.2')}</li>
        </ul>
      </section>

      {/* Section 4: Product Listings and Orders */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('productListingsAndOrders.title')}</h2>
        <p>{t('productListingsAndOrders.content')}</p>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('productListingsAndOrders.ordering.title')}</h3>
        <ul className="list-disc list-inside mb-4">
          <li>{t('productListingsAndOrders.ordering.list.0')}</li>
          <li>{t('productListingsAndOrders.ordering.list.1')}</li>
          <li>{t('productListingsAndOrders.ordering.list.2')}</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('productListingsAndOrders.pricing.title')}</h3>
        <p>{t('productListingsAndOrders.pricing.content')}</p>
      </section>

      {/* Section 5: Payment */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('payment.title')}</h2>
        <p>{t('payment.content')}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{t('payment.list.0')}</li>
          <li>{t('payment.list.1')}</li>
        </ul>
      </section>

      {/* Section 6: Shipping and Delivery */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('shippingAndDelivery.title')}</h2>
        <p>{t('shippingAndDelivery.content')}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{t('shippingAndDelivery.list.0')}</li>
          <li>{t('shippingAndDelivery.list.1')}</li>
          <li>{t('shippingAndDelivery.list.2')}</li>
        </ul>
      </section>

      {/* Section 7: Returns, Refunds, and Exchanges */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('returnsRefundsAndExchanges.title')}</h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('returnsRefundsAndExchanges.returnEligibility.title')}</h3>
        <ul className="list-disc list-inside mb-4">
          <li>{t('returnsRefundsAndExchanges.returnEligibility.list.0')}</li>
          <li>{t('returnsRefundsAndExchanges.returnEligibility.list.1')}</li>
          <li>{t('returnsRefundsAndExchanges.returnEligibility.list.2')}</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('returnsRefundsAndExchanges.howToSubmitReturn.title')}</h3>
        <ul className="list-disc list-inside mb-4">
          <li>{t('returnsRefundsAndExchanges.howToSubmitReturn.steps.0')}</li>
          <li>{t('returnsRefundsAndExchanges.howToSubmitReturn.steps.1')}</li>
          <li>{t('returnsRefundsAndExchanges.howToSubmitReturn.steps.2')}</li>
          <li>{t('returnsRefundsAndExchanges.howToSubmitReturn.steps.3')}</li>
        </ul>
        <p>{t('returnsRefundsAndExchanges.howToSubmitReturn.note')}</p>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('returnsRefundsAndExchanges.refunds.title')}</h3>
        <p>{t('returnsRefundsAndExchanges.refunds.content')}</p>
      </section>

      {/* Section 8: Intellectual Property */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('intellectualProperty.title')}</h2>
        <p>{t('intellectualProperty.content')}</p>
      </section>

      {/* Section 9: User-Generated Content */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('userGeneratedContent.title')}</h2>
        <p>{t('userGeneratedContent.content')}</p>
      </section>

      {/* Section 10: Third-Party Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('thirdPartyLinks.title')}</h2>
        <p>{t('thirdPartyLinks.content')}</p>
      </section>

      {/* Section 11: Disclaimer of Warranties */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('disclaimerOfWarranties.title')}</h2>
        <p>{t('disclaimerOfWarranties.content')}</p>
      </section>

      {/* Section 12: Limitation of Liability */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('limitationOfLiability.title')}</h2>
        <p>{t('limitationOfLiability.content')}</p>
      </section>

      {/* Section 13: Indemnification */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('indemnification.title')}</h2>
        <p>{t('indemnification.content')}</p>
      </section>

      {/* Section 14: Modifications to the Terms */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('modificationsToTerms.title')}</h2>
        <p>{t('modificationsToTerms.content')}</p>
      </section>

      {/* Section 15: Termination */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('termination.title')}</h2>
        <p>{t('termination.content')}</p>
      </section>

      {/* Section 17: Contact Information */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('contactInformation.title')}</h2>
        <p>{t('contactInformation.content')}</p>
        <Link href="mailto:contact@padlev.com">  
          <p className='font-bold'>contact@padlev.com</p>
          </Link>
      </section>
    </div>
  );
}

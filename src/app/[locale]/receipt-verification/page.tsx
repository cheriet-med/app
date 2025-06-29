// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import ReceiptUpload from '@/components/ReceiptUpload';
import ValidationProgress from '@/components/ValidationProgress';
import ValidationResults from '@/components/ValidationResults';
import { ReceiptValidationEngine } from '@/lib/validationEngine';
import { ValidationResult } from '@/types/receipt';
import Image from 'next/image';
const HomePage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setValidationResult(null);
  }, []);

  const validateReceipt = useCallback(async () => {
    if (!uploadedFile) return;
    
    setIsValidating(true);
    
    try {
      const result = await ReceiptValidationEngine.validateReceipt(uploadedFile);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
      // Handle error state here
    } finally {
      setIsValidating(false);
    }
  }, [uploadedFile]);

  return (
    <div className='bg-slate-50'>
         <div className="h-96 w-full sm:col-span-1 relative flex items-center bg-secondary">
              <Image src="/receipt.webp"
               alt="receipts"
               fill
                sizes="100vw" 
                className="z-0 object-cover" 
                quality={85}  
                
              
                priority />
              <div className="absolute inset-0 bg-black bg-opacity-70"></div>
              <div className="absolute sm:bottom-10 mx-5 lg:mx-72 px-1 shadow-lg">
                <h1 className="text-xl md:text-4xl font-bold text-white mb-8 pt-32 uppercase">AI-powered receipt verification system</h1>
                <p className="max-w-5xl text-white text-sm custom:text-base uppercase">Try uploading files with names containing: "clear", "blur", or "fake" to see different validation scenarios. 
                This simulates how the AI would handle various receipt quality and authenticity levels.</p>
              </div>
            </div>
      
    <div className="max-w-4xl mx-auto p-6  min-h-screen  pt-32">

      <ReceiptUpload
        onFileUpload={handleFileUpload}
        uploadedFile={uploadedFile}
        onValidate={validateReceipt}
        isValidating={isValidating}
      />

      <ValidationProgress isValidating={isValidating} />

      {validationResult && <ValidationResults result={validationResult} />}

      <div className='text-sm text-primary mt-20'>
  <p>At TrustDine, your voice matters. Every meal you enjoy is a story worth sharing — and now, your feedback comes with benefits!</p>
  <p><span className='font-bold'>Upload Your Receipt</span> - Easily snap and upload your receipt after any restaurant visit. This verifies your dining experience and builds your credibility within the community.</p>
  <p><span className='font-bold'>Write a Review</span> - Tell us what you loved (or didn’t). Your honest opinion helps other diners make better choices — and helps great restaurants shine.</p>
  <p><span className='font-bold'>Earn Your Trust Score</span> - With every verified review, your Trust Score grows. The more you contribute, the more trustworthy your profile becomes.</p>
  <p><span className='font-bold'>Unlock Exclusive Rewards</span> - A higher Trust Score means better rewards — from special offers and VIP invitations to exclusive partner perks. It pays to be honest!</p>


</div>
   
    </div>


    </div>
  );
};

export default HomePage;
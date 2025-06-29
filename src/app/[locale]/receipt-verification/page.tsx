// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import ReceiptUpload from '@/components/ReceiptUpload';
import ValidationProgress from '@/components/ValidationProgress';
import ValidationResults from '@/components/ValidationResults';
import { ReceiptValidationEngine } from '@/lib/validationEngine';
import { ValidationResult } from '@/types/receipt';

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
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen pt-60">
      <div className="text-center mb-8">
       
        <p className="text-gray-600">AI-powered receipt verification system</p>
      </div>

      <ReceiptUpload
        onFileUpload={handleFileUpload}
        uploadedFile={uploadedFile}
        onValidate={validateReceipt}
        isValidating={isValidating}
      />

      <ValidationProgress isValidating={isValidating} />

      {validationResult && <ValidationResults result={validationResult} />}

      {/* Demo Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Demo Instructions:</h3>
        <p className="text-sm text-blue-800">
          Try uploading files with names containing: "clear", "blur", or "fake" to see different validation scenarios. 
          This simulates how the AI would handle various receipt quality and authenticity levels.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
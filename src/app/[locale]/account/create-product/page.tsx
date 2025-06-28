'use client';

import AdminMenu from "@/components/admin-dashboard/menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TiptapEditor from "@/components/admin-dashboard/Tiptapeditor";
import moment from 'moment';
import {useLocale} from "next-intl";
export default function CreatePost() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const now = moment();
  const l = useLocale()
  const languages = ["en", "ar", "de", "es", "fr", "it", "nl", "pt", "ru", "sv"];
  const categories = [
    { code: "bgs", name: "Bags" },
    { code: "rkb", name: "racket beginner" },
    { code: "rki", name: "racket intermediate" },
    { code: "rkp", name: "racket profetional" },

    { code: "bl", name: "balls" },
    { code: "gri", name: "grip" },
    { code: "ogri", name: "over grip" },
    { code: "rkpt", name: "racket protector" },
    { code: "ptg", name: "protectiv gear" },
    { code: "sung", name: "sunglasses" },
    { code: "twl", name: "towel" },
    { code: "rb", name: "resistance bands" },
    { code: "wb", name: "watter bottle" },
    { code: "swb", name: "sweatbands" },

    { code: "drs", name: "dress" },
    { code: "vsr", name: "visor" },
    { code: "top", name: "top" },
    { code: "sw", name: "shoes woman" },
    { code: "tswm", name: "T-shirt woman" },
    { code: "swsw", name: "sweatshirt woman" },
    { code: "sockw", name: "sock woman" },
    { code: "srtw", name: "short woman" },
    { code: "psw", name: "polo shirt woman" },
    { code: "lptsw", name: "long pants woman" },
    { code: "legw", name: "legging woman" },
    { code: "jcktw", name: "jacket woman" },
    { code: "capw", name: "cap woman" },

    { code: "sm", name: "shoes man" },
    { code: "tsm", name: "T-shirt man" },
    { code: "swsm", name: "sweatshirt man" },
    { code: "sockm", name: "sock man" },
    { code: "srtm", name: "short man" },
    { code: "psm", name: "polo shirt man" },
    { code: "lptsm", name: "long pants man" },
    { code: "legm", name: "legging man" },
    { code: "jcktm", name: "jacket man" },
    { code: "capm", name: "cap man" },

    { code: "jn", name: "Junior" },
 
  ]; // Example categories with code and name

  // Define state with proper typing
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State for selected category code
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]); // State for sizes
  const [inputValue, setInputValue] = useState<string>(""); // State for size input
  const [keywords1, setKeywords1] = useState<any[]>([]); // State for colors
  const [inputValue1, setInputValue1] = useState<string>(""); // State for color input

  // Add a size keyword
  const addKeyword = (e: any) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // Prevent form submission on Enter
      setKeywords((prevKeywords) => [...prevKeywords, inputValue.trim()]);
      setInputValue(""); // Clear the input field
    }
  };

  // Remove a size keyword
  const removeKeyword = (indexToRemove: any) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  // Add a color keyword
  const addKeyword1 = (e: any) => {
    if (e.key === "Enter" && inputValue1.trim()) {
      e.preventDefault(); // Prevent form submission on Enter
      setKeywords1((prevKeywords1) => [...prevKeywords1, inputValue1.trim()]);
      setInputValue1(""); // Clear the input field
    }
  };

  // Remove a color keyword
  const removeKeyword1 = (indexToRemove1: any) => {
    setKeywords1(keywords1.filter((_, index1) => index1 !== indexToRemove1));
  };

  useEffect(() => {
    // Initialize state dynamically
    const initialState: { [key: string]: any } = {};
    languages.forEach((lang) => {
      initialState[`url_${lang}`] = null;
      initialState[`title_${lang}`] = null;
      initialState[`content_${lang}`] = null;
      initialState[`tag_${lang}`] = null;
      initialState[`tag1_${lang}`] = null;
      initialState[`image_${lang}`] = null;
      initialState[`image1_${lang}`] = null;
      initialState[`keyword_1_${lang}`] = null;
      initialState[`keyword_2_${lang}`] = null;
      initialState[`keyword_3_${lang}`] = null;
      initialState[`keyword_4_${lang}`] = null;
      initialState[`keyword_5_${lang}`] = null;
    });
    // Add general fields (not tied to languages)
    initialState["old_price"] = null;
    initialState["new_price"] = null;
    initialState["dropshippingID"] = null;
    initialState["brand"] = null;
    setFormData(initialState);
  }, []);

  const date = now.format('L');
  const time = now.format('h:mm:ss a');

  const handleChange = (lang: string, field: string) => (e: any) => {
    setFormData((prev) => ({
      ...prev,
      date,
      time,
      [`${field}_${lang}`]: e.target.value,
    }));
  };

  const handleGeneralChange = (field: string) => (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleImageChange = (lang: string, field: string) => (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [`${field}_${lang}`]: file,
      }));
    }
  };
  const handleImageChange1 = (lang: string, field: string) => (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [`${field}_${lang}`]: file,
      }));
    }
  };


  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.is_superuser) {
      router.push("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Extract all image keys from formData
      const imageKeys = Object.keys(formData).filter(
        (key) => key.startsWith("image_") || key.startsWith("image1_")
      );
  
      // Split images into two batches
      const batch1 = imageKeys.slice(0, 10); // First 10 images
      const batch2 = imageKeys.slice(10); // Next 10 images
  
      // Function to upload a batch of images
      const uploadBatch = async (batch: string[], isFirstBatch: boolean) => {
        const formDataToSend = new FormData();
  
        // Append images in the batch
        batch.forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });
  
        // Append non-image fields only in the first batch
        if (isFirstBatch) {
          Object.keys(formData).forEach((key) => {
            if (!key.startsWith("image_") && !key.startsWith("image1_")) {
              formDataToSend.append(key, formData[key]);
            }
          });
  
          // Append date, time, and category
          formDataToSend.append("date", date);
          formDataToSend.append("time", time);
          formDataToSend.append("category", selectedCategory);
        }
  
        // Send the request
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}product/`, {
          method: "POST",
          headers: {
            Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
          body: formDataToSend,
        });
  
        const rawResponse = await response.text();
        const data = JSON.parse(rawResponse);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        return data.id; // Return the product ID
      };
  
      // Upload first batch and get product ID
      const productId = await uploadBatch(batch1, true);
     // console.log("First batch uploaded. Product ID:", productId);
  
      // Upload second batch to the productimageid/{ProductID} endpoint
      if (batch2.length > 0) {
        const formDataToSend = new FormData();
  
        // Append images in the second batch
        batch2.forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });
  
        // Send the PUT request to update the product with the second batch of images
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}productid/${productId}`,
          {
            method: "PUT",
            headers: {
              Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
            },
            body: formDataToSend,
          }
        );
  
        const rawResponse = await response.text();
        const data = JSON.parse(rawResponse);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
       // console.log("Second batch uploaded.");
      }
  
      // Handle size variations
      for (const size of keywords) {
        const sizeFormData = new FormData();
        sizeFormData.append("product", productId);
        sizeFormData.append("size", size);
  
        await fetch(`${process.env.NEXT_PUBLIC_URL}productsizevariation/`, {
          method: "POST",
          headers: { Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN },
          body: sizeFormData,
        });
      }
  
      // Handle color variations
      for (const color of keywords1) {
        const colorFormData = new FormData();
        colorFormData.append("product", productId);
        colorFormData.append("color", color);
  
        await fetch(`${process.env.NEXT_PUBLIC_URL}productimagevariation/`, {
          method: "POST",
          headers: { Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN },
          body: colorFormData,
        });
      }
  
      // Handle successful submission

      router.push(`/${l}/account/view-product`);
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated" && !session?.user?.is_superuser) {
    return null;
  }

  return (
    <div>
      <AdminMenu />
      <h1 className="text-lg mx-6 my-2">Create Product</h1>
      <hr className="border-spacing-1" />
      <form onSubmit={handleSubmit} className="m-6">
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <div key={lang} className="col-span-1 space-y-2">
              <p>{lang.toUpperCase()}</p>
              <input
                type="text"
                placeholder="url"
                value={formData[`url_${lang}`] || ""}
                onChange={handleChange(lang, "url")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
              <input
                type="text"
                placeholder="title"
                value={formData[`title_${lang}`] || ""}
                onChange={handleChange(lang, "title")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <input
                type="text"
                placeholder="keyword_1"
                value={formData[`keyword_1_${lang}`] || ""}
                onChange={handleChange(lang, "keyword_1")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <input
                type="text"
                placeholder="keyword_2"
                value={formData[`keyword_2_${lang}`] || ""}
                onChange={handleChange(lang, "keyword_2")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <input
                type="text"
                placeholder="keyword_3"
                value={formData[`keyword_3_${lang}`] || ""}
                onChange={handleChange(lang, "keyword_3")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <input
                type="text"
                placeholder="keyword_4"
                value={formData[`keyword_4_${lang}`] || ""}
                onChange={handleChange(lang, "keyword_4")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <input
                type="text"
                placeholder="keyword_5"
                value={formData[`keyword_5_${lang}`] || ""}
                onChange={handleChange(lang, "keyword_5")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
              <TiptapEditor
                content={formData[`content_${lang}`] || ""}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, [`content_${lang}`]: content }))
                }
              />
              <input
                type="text"
                placeholder="Tag"
                value={formData[`tag_${lang}`] || ""}
                onChange={handleChange(lang, "tag")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
               <label className="text-gray-500">Image</label>
              <label htmlFor={`image_${lang}`}>
                <input
                  type="file"
                  accept="image/*,image/avif"  // Add "image/avif" here
                  onChange={handleImageChange(lang, "image")}
                  className="mt-1 block w-full"
                  //required
                />
              </label>
              <input
                type="text"
                placeholder="Tag 1"
                value={formData[`tag1_${lang}`] || ""}
                onChange={handleChange(lang, "tag1")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
          
            <label className="text-gray-500">Image 1</label>
              <label htmlFor={`image1_${lang}`}>
                <input
                  type="file"
                  accept="image/*,image/avif"  // Add "image/avif" here
                  onChange={handleImageChange1(lang, "image1")}
                  className="mt-1 block w-full"
                />
              </label>
            </div>
          ))}
        </div>

        {/* General Inputs (Not tied to languages) */}
        <div className="flex flex-wrap gap-10">
        <div className="my-4">
          <label htmlFor="old_price" className="block text-sm font-medium text-gray-700">
            Old Price
          </label>
          <input
            type="text"
            placeholder="Old Price"
            value={formData.old_price || ""}
            onChange={handleGeneralChange("old_price")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            //required
          />
        </div>
        <div className="my-4">
          <label htmlFor="new_price" className="block text-sm font-medium text-gray-700">
            New Price
          </label>
          <input
            type="text"
            placeholder="New Price"
            value={formData.new_price || ""}
            onChange={handleGeneralChange("new_price")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="my-4">
          <label htmlFor="dropshippingID" className="block text-sm font-medium text-gray-700">
            Dropshipping ID
          </label>
          <input
            type="text"
            placeholder="dropshippingID"
            value={formData.dropshippingID || ""}
            onChange={handleGeneralChange("dropshippingID")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="my-4">
          <label htmlFor="dropshippingID" className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            placeholder="brand"
            value={formData.brand || ""}
            onChange={handleGeneralChange("brand")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            //required
          />
        </div>
        </div>
<div className="flex flex-wrap">
        {/* Add Category Dropdown */}
        <div className="my-4">
       
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.code} value={category.code}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Keywords (Colors) */}
      
        <div className="w-full max-w-md mx-auto">
          <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
            {keywords1.map((keyword1, index1) => (
              <div
                key={index1}
                className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {keyword1}
                <button
                  type="button"
                  onClick={() => removeKeyword1(index1)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              value={inputValue1}
              onChange={(e) => setInputValue1(e.target.value)}
              onKeyDown={addKeyword1}
              placeholder="Add a color"
              className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 text-sm"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Press <span className="font-medium text-blue-500">Enter</span> to add colors.
          </p>
        </div>

        {/* Keywords (Sizes) */}
      
        <div className="w-full max-w-md mx-auto">
          <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={addKeyword}
              placeholder="Add a size"
              className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 text-sm"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Press <span className="font-medium text-blue-500">Enter</span> to add sizes.
          </p>
        </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 my-4"
        >
          {isSubmitting ? "Submitting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
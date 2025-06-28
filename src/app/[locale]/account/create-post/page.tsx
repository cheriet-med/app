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

  // Define state with proper typing
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Initialize state dynamically
    const initialState: { [key: string]: any } = {};
    languages.forEach((lang) => {
      initialState[`url_${lang}`] = "";
      initialState[`title_${lang}`] = "";
      initialState[`description_${lang}`] = "";
      initialState[`content_${lang}`] = "";
      initialState[`tag_${lang}`] = "";
      initialState[`image_${lang}`] = null;
      initialState[`keyword_1_${lang}`] = null;
      initialState[`keyword_2_${lang}`] = null;
      initialState[`keyword_3_${lang}`] = null;
      initialState[`keyword_4_${lang}`] = null;
      initialState[`keyword_5_${lang}`] = null;
    });
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

  const handleImageChange = (lang: string) => (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [`image_${lang}`]: file,
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.is_superuser) {
      router.push("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();
  
      // Append all fields to the FormData object
      Object.keys(formData).forEach((key) => {
        if (key.startsWith("image_")) {
          // Append image files
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          // Append other fields as strings
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // Append date and time
      formDataToSend.append("date", date);
      formDataToSend.append("time", time);
  
      // Send the FormData object to the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}post/`, {
        method: "POST",
        headers: {
          Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: formDataToSend, // Use FormData instead of JSON
      });
  
      // Log the raw response for debugging
      //const rawResponse = await response.text();
      //const data = JSON.parse(rawResponse); // Parse the raw response as JSON
    
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Handle successful submission
    
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSubmitting(false);
      router.push(`/${l}/account/view-post`);
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
      <h1 className="text-lg mx-6 my-2">Create Post</h1>
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
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={formData[`title_${lang}`] || ""}
                onChange={handleChange(lang, "title")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData[`description_${lang}`] || ""}
                onChange={handleChange(lang, "description")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                //required
              />
              <input
                type="text"
                placeholder="Tag"
                value={formData[`tag_${lang}`] || ""}
                onChange={handleChange(lang, "tag")}
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
              <input
                type="file"
                accept="image/*,image/avif"  // Add "image/avif" here
                onChange={handleImageChange(lang)}
                className="mt-1 block w-full"
                //required
              />
              <TiptapEditor content={formData[`content_${lang}`] || ""} onChange={(content) => setFormData((prev) => ({ ...prev, [`content_${lang}`]: content }))} />
            </div>
          ))}
        </div>
        <input
  type="text"
  placeholder="Licence"
  value={formData.licence || ""}
  onChange={(e) => setFormData((prev) => ({ ...prev, licence: e.target.value }))}
  className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  
/>


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

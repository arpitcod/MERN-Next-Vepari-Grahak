"use client";

import React, { useState } from "react"; 
import { toast } from "react-toastify";

const Faqs = () => {
  const [faq, setFaq] = useState<string>("");

  
  const handleFaqSubmit = async () => {
    if (!faq.trim()) {
      toast.warning("Please write something in the FAQ.");
      return;
    }
    
    const token = localStorage.getItem("vg_token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FAQ_POST}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ faq }),
      });

      const data = await response.json();
      if (response?.ok) {
        toast.success(data.message);
        setFaq("");
        console.log(token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 gap-4 bg-white">
      <div className="w-full max-w-4xl bg-indigo-50">
        <textarea
          placeholder="Write FAQ..."
          className="w-full h-64 sm:h-72 md:h-80 lg:h-96 border border-indigo-500 rounded-md resize-none p-4 shadow-md text-base sm:text-lg"
          onChange={(e) => setFaq(e.target.value)}
          value={faq}
        ></textarea>
      </div>
      <button
        className="bg-indigo-500 py-2 px-8 sm:px-10 rounded-lg text-white hover:bg-indigo-600 transition duration-200"
        onClick={handleFaqSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default Faqs;

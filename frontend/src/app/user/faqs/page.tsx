"use client";

import React, { useState } from "react"; 
import { toast } from "react-toastify";
const Faqs = () => {
  const [faq,setFaq] = useState<string>("")

  const token = localStorage.getItem("vg_token")
    const handleFaqSubmit = async () =>{
      if (!faq.trim()) {
        toast.warning("Please write something in the FAQ.");
        return;
      }
      try {
       const response = await fetch("http://localhost:2929/api/user/faq",{
          method:"POST",
          headers:{
            "content-type":"application/json",
            "Authorization":`${token}`,
          },
          body:JSON.stringify({faq})
          
        })
        const data = await response.json()
          if (response?.ok) {
            toast.success(data.message)
            setFaq("")
            console.log(token);
            
            
          }else{
            // console.log(token);
            toast.error(data.message)

          }
          
        } catch (error) {
          console.log(error);
          // console.log(token);
        toast.error("something went wrong, please try again")
        
      }
    }
  
  return (
    <div className=" h-full flex flex-col justify-evenly items-center">
      <div className="">
        <textarea
          name=""
          id=""
          placeholder="write faq..."
          cols={70}
          rows={15}
          className="border rounded-md resize-none p-2 "
          onChange={(e) => setFaq(e.target.value)}
          value={faq}
        ></textarea>
      </div>
      <div>
        <button className="bg-blue-600 px-6 py-2  rounded-lg text-blue-50 hover:bg-blue-700" onClick={handleFaqSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Faqs;

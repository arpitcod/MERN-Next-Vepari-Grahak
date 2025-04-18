"use client";
import React from "react";

const CreateShop = () => {
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto p-2">
      <p className="text-2xl text-center font-medium">Create Shop</p>

      <div className="flex flex-col">
        <label>Banner</label>
        <input type="file" name="" id="" className="border p-3 rounded-md" />
      </div>

      <div className="flex flex-col">
        <label>Profile</label>
        <input type="file" name="" id="" className="border p-3 rounded-md" />
      </div>

      <div className="flex flex-col">
        <label>Shop Name</label>
        <input type="text" name="" id="" placeholder="Enter Shopname" className="border p-3 rounded-md"/>
      </div>

      <div className="flex flex-col">
        <label>Description</label>
        <textarea
          name=""
          id=""
          placeholder="write faq..."
          cols={70}
          rows={10}
          className="border rounded-md resize-none p-2 "
          // onChange={(e) => setFaq(e.target.value)}
          // value={faq}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col ">
            <label>Country</label>
            <input type="text" name="" id="" placeholder="Enter Country" className="border w-full p-3 rounded-md"/>

        </div>
        <div className="flex flex-col ">
            <label>State</label>
            <input type="text" name="" id="" placeholder="Enter State" className="border w-full p-3 rounded-md"/>

        </div>
        <div className="flex flex-col ">
            <label>City</label>
            <input type="text" name="" id="" placeholder="Enter City" className="border w-full p-3 rounded-md"/>

        </div>
        
         
      </div>
      <div className="flex flex-col">
        <label>Category</label>
        <input type="text" name="" id="" placeholder="Enter Category" className="border p-3 rounded-md"/>
      </div>
      <div className="flex flex-col">
        <label>Contact</label>
        <input type="text" name="" id="" placeholder="Enter Contact" className="border p-3 rounded-md"/>
      </div>
      <div className="flex flex-col">
        <label>Shop Time Start To End</label>
        <input type="text" name="" id="" placeholder="Enter Shop Time" className="border p-3 rounded-md"/>
      </div>
      <div className="flex flex-col">
          <button className="border p-3 rounded-md bg-gray-800 text-indigo-50 hover:bg-gray-700 cursor-pointer">Create Shop</button>
      </div>

    </div>
  );
};

export default CreateShop;

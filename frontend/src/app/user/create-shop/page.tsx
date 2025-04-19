"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateShop = () => {
  const [shopData, setShopData] = useState({
    banner: "",
    profile: "",
    shopname: "",
    description: "",
    address:{
      country: "india",
      state: "",
      city: "",

    },
    category: "",
    contact: "",
    shopTime:{
      startTime:"",
      endTime:""
    }
  });
  const handleCreateShop = () => {
    toast.success("shop create successfuly");
    console.log(shopData);
    
  };
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto p-2">
      <p className="text-2xl text-center font-medium">Create Shop</p>

      <div className="flex flex-col">
        <label>Banner</label>
        <input
          type="file"
          name=""
          id=""
          className="border p-3 rounded-md"
          onChange={(e) => setShopData({ ...shopData, banner: e.target.value })}
          value={shopData.banner}
        />
      </div>

      <div className="flex flex-col">
        <label>Profile</label>
        <input
          type="file"
          name=""
          id=""
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, profile: e.target.value })
          }
          value={shopData.profile}
        />
      </div>

      <div className="flex flex-col">
        <label>Shop Name</label>
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter Shopname"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, shopname: e.target.value })
          }
          value={shopData.shopname}
        />
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
          onChange={(e) =>
            setShopData({ ...shopData, description: e.target.value })
          }
          value={shopData.description}
          // onChange={(e) => setFaq(e.target.value)}
          // value={faq}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col ">
          <label>Country</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter Country"
            className="border w-full p-3 rounded-md"
            onChange={(e) => setShopData((prev) =>({...prev ,address:{...prev.address,country:e.target.value}}))
            }
            value={shopData.address.country}
          />
        </div>
        <div className="flex flex-col ">
          <label>State</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter State"
            className="border w-full p-3 rounded-md"
            onChange={(e) =>setShopData((prev) =>({
              ...prev,address:{...prev.address,state:e.target.value}
            }))
            }
            value={shopData.address.state}
          />
        </div>
        <div className="flex flex-col ">
          <label>City</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Enter City"
            className="border w-full p-3 rounded-md"
            onChange={(e) => setShopData((prev) => ({
              ...prev,address:{...prev.address,city:e.target.value}
            }))}
            value={shopData.address.city}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label>Category</label>
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter Category"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, category: e.target.value })
          }
          value={shopData.category}
        />
      </div>
      <div className="flex flex-col">
        <label>Contact</label>
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter Contact"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, contact: e.target.value })
          }
          value={shopData.contact}
        />
      </div>

      <div className="flex grid grid-cols-2 gap-3">
        {/* <label>Shop Time</label> */}

      <div className="flex flex-col">
        <label>Start Time</label>
        <input
          type="time"
          name=""
          id=""
          placeholder="Enter Shop Time"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData((prev) => ({
              ...prev,shopTime:{...prev.shopTime,startTime:e.target.value}
            }))
          }
          value={shopData.shopTime.startTime}
        />
      </div>
      <div className="flex flex-col">
        <label>End Time</label>
        <input
          type="time"
          name=""
          id=""
          placeholder="Enter Shop Time"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData((prev) =>({
              ...prev,shopTime:{...prev.shopTime,endTime:e.target.value}
            }))
          }
          value={shopData.shopTime.endTime}
        />
      </div>
      </div>
      <div className="flex flex-col">
        <button
          className="border p-3 rounded-md bg-gray-800 text-indigo-50 hover:bg-gray-700 cursor-pointer"
          onClick={handleCreateShop}
        >
          Create Shop
        </button>
      </div>
    </div>
  );
};

export default CreateShop;

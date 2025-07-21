"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../../../redux/store";
import { setGetVepari } from "../../../../redux/GetVepariSlice";
import { setUserData } from "../../../../redux/UserSlice";

type ProductsType = {
  _id?: string; // keep optional only if it's actually optional
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: string;
  tags: string[];
  description: string;
  details: string;
  mainImage?: string;
  images?: string[];
};

type VepariType = {
  _id?:string;
  banner: File | string | null;
  profile: File | string | null;
  vepariname: string;
  shopname: string;
  description: string;
  address: {
    country: string;
    state: string;
    city: string;
  };
  category: string;
  contact: string;
  shopTime: {
    startTime: string;
    endTime: string;
  };
  isAdmin:boolean;
  isActive:boolean;
  products:ProductsType[]
};
type ShopType = {
  banner: File | null;
  profile: File | null;
  vepariname: string;
  shopname: string;
  description: string;
  address: {
    country: string;
    state: string;
    city: string;
  };
  category: string;
  contact: string;
  shopTime: {
    startTime: string;
    endTime: string;
  };
};
const CreateShop = () => {

  const dispatch = useDispatch()
  const vepari = useSelector((state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );
  const user = useSelector((state: RootState) => state?.user?.user);
  const router = useRouter();
  // token
  const token = localStorage.getItem("vg_token");
  // const [token] = useState(localStorage.getItem("vg_token" as string))

  const [isLoading, setIsLoading] = useState(false);
  const [shopData, setShopData] = useState<ShopType>({
    banner: null,
    profile: null,
    vepariname: "",
    shopname: "",
    description: "",
    address: {
      country: "india",
      state: "",
      city: "",
    },
    category: "",
    contact: "",
    shopTime: {
      startTime: "",
      endTime: "",
    },
  });

  //category list
  const categoryOptions = [
    "Grocery",
    "Electronics",
    "Clothing",
    "Stationery",
    "Furniture",
    "Hardware",
    "Toys",
    "Sports",
    "Books",
    "Medicines",
    "Mobile & Accessories",
    "Beauty & Personal Care",
    "Home Decor",
    "Footwear",
    "Watches & Accessories",
    "Kitchenware",
    "Cleaning Supplies",
    "Pet Supplies",
    "Automobile",
    "Baby Products",
  ];

  // dispatch
  // const disPatch = useDispatch()
  const handleCreateShop = async () => {
    const formData = new FormData();

    formData.append("vepariname", shopData.vepariname);
    formData.append("shopname", shopData.shopname);
    formData.append("description", shopData.description);
    formData.append("country", shopData.address.country);
    formData.append("state", shopData.address.state);
    formData.append("city", shopData.address.city);
    formData.append("category", shopData.category);
    formData.append("contact", shopData.contact);
    formData.append("startTime", shopData.shopTime.startTime);
    formData.append("endTime", shopData.shopTime.endTime);

    if (shopData.banner) {
      formData.append("banner", shopData.banner);
    }
    if (shopData.profile) {
      formData.append("profile", shopData.profile);
    }
    // Basic validation
    if (!shopData.shopname.trim()) {
      toast.error("Shop name is required");
      return;
    }

    // toast.success("shop create successfuly");
    // console.log(shopData);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/create-shop", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response?.ok) {
        dispatch(setGetVepari({...vepari,...data.newShop}))
        dispatch(setUserData({...user,vepari_shop:data?.newShop?._id}))
        // dispatch(setUserData({...user}))
        toast.success(data.message);
        router.push("/admin-vepari/profile");
        console.log(formData);

        // console.log(response);
        console.log(data);
        // console.log(token);
      } else {
        toast.error(data.message || "Failed to create shop");
        console.log("Error response:", data);
      }
    } catch (error) {
      toast.error("Something went wrong while creating shop");
      console.log(error);
      console.log(shopData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto p-2">
      <p className="text-2xl text-center font-medium">Create Shop</p>

      <div className="flex flex-col">
        <label>Banner</label>
        <input
          type="file"
          name="banner"
          accept="image/*"
          id="banner"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, banner: e.target.files?.[0] || null })
          }
        />
      </div>
      {/* preview banner  */}
      {shopData.banner ? (
        <div className="flex justify-center items-center ">
          {shopData?.banner && (
            <img
              src={URL.createObjectURL(shopData.banner)}
              alt="banner preview"
              className="w-[50%] "
            />
          )}
        </div>
      ) : null}

      <div className="flex flex-col">
        <label>Profile</label>
        <input
          type="file"
          name="profile"
          id="profile"
          accept="image/*"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, profile: e.target.files?.[0] || null })
          }
        />
      </div>

      {shopData?.profile ? (
        <div className="flex justify-center items-center ">
          {shopData.profile && (
            <img
              src={URL.createObjectURL(shopData.profile)}
              alt="profile preview"
              className="w-[100px] h-[100px]"
            />
          )}
        </div>
      ) : null}

      <div className="flex flex-col">
        <label>Vepari Name</label>
        <input
          type="text"
          name="vepariname"
          id="vepariname"
          placeholder="Enter vepari name"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, vepariname: e.target.value })
          }
          value={shopData.vepariname}
        />
      </div>
      <div className="flex flex-col">
        <label>Shop Name</label>
        <input
          type="text"
          name="shopname"
          id="shopname"
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
          name="description"
          id="description"
          placeholder="write description..."
          cols={70}
          rows={10}
          className="border rounded-md resize-none p-2 "
          onChange={(e) =>
            setShopData({ ...shopData, description: e.target.value })
          }
          value={shopData.description}
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col ">
          <label>Country</label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Enter Country"
            className="border w-full p-3 rounded-md"
            onChange={(e) =>
              setShopData((prev) => ({
                ...prev,
                address: { ...prev.address, country: e.target.value },
              }))
            }
            value={shopData.address.country}
          />
        </div>
        <div className="flex flex-col ">
          <label>State</label>
          <input
            type="text"
            name="state"
            id="state"
            placeholder="Enter State"
            className="border w-full p-3 rounded-md"
            onChange={(e) =>
              setShopData((prev) => ({
                ...prev,
                address: { ...prev.address, state: e.target.value },
              }))
            }
            value={shopData.address.state}
          />
        </div>
        <div className="flex flex-col ">
          <label>City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Enter City"
            className="border w-full p-3 rounded-md"
            onChange={(e) =>
              setShopData((prev) => ({
                ...prev,
                address: { ...prev.address, city: e.target.value },
              }))
            }
            value={shopData.address.city}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label>Category</label>
        {/* <input
          type="text"
          name="category"
          id="category"
          placeholder="Enter Category"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, category: e.target.value })
          }
          value={shopData.category}
        /> */}
        <select
          name="category"
          id="category"
          className={` p-3 rounded-md border`}
          onChange={(e) =>
            setShopData((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          value={shopData.category}
        >
          {/* placeholder option */}
          <option value="" className="border">
            Select category
          </option>
          {categoryOptions.map((category) => (
            <option value={category} key={category} className="text-black">
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label>Contact</label>
        <input
          type="number"
          // type="text"
          // pattern="\d*"
          // inputMode="numeric"
          name="contact"
          id="contact"
          placeholder="Enter Contact"
          className="border p-3 rounded-md"
          onChange={(e) =>
            setShopData({ ...shopData, contact: e.target.value })
          }
          value={shopData.contact}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* <label>Shop Time</label> */}

        <div className="flex flex-col">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            placeholder="Enter Shop Time"
            className="border p-3 rounded-md"
            onChange={(e) =>
              setShopData((prev) => ({
                ...prev,
                shopTime: { ...prev.shopTime, startTime: e.target.value },
              }))
            }
            value={shopData.shopTime.startTime}
          />
        </div>
        <div className="flex flex-col">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            placeholder="Enter Shop Time"
            className="border p-3 rounded-md"
            onChange={(e) =>
              setShopData((prev) => ({
                ...prev,
                shopTime: { ...prev.shopTime, endTime: e.target.value },
              }))
            }
            value={shopData.shopTime.endTime}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <button
          className="border p-3 rounded-md bg-indigo-500 text-indigo-50 hover:bg-indigo-600 cursor-pointer"
          onClick={handleCreateShop}
          disabled={isLoading}
        >
          {isLoading ? "loading..." : "Create Shop"}
        </button>
      </div>
    </div>
  );
};

export default CreateShop;

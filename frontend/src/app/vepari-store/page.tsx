"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaHeart, FaMinus, FaPlus, FaRegHeart, FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../../redux/CartSlice";
import { IoMdClose } from "react-icons/io";
import ProductDetail from "@/components/ProductDetail";
import { likeProduct, unlikeProduct } from "../../../redux/LikesSlice";

type ProductsType = {
  _id?: string;
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
  _id?: string;
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
  isAdmin: boolean;
  isActive: boolean;
  products: ProductsType[];
};

// Function to convert 24-hour format to 12-hour format with AM/PM
const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const VepariStorePage = () => {
  const searchParams = useSearchParams();
  const vepariId = searchParams.get("id");

  const [vepariData, setVepariData] = useState<VepariType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => {
    const fetchVepariData = async () => {
      try {
        const token = localStorage.getItem("vg_token");
        if (!vepariId || !token) return;

        const response = await fetch(
          `http://localhost:5000/api/get-vepari/${vepariId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setVepariData(data?.getVepariData);
          console.log("frpm vepari store page dta", data);
          console.log("frpm vepari store page vepari data", vepariData);
        } else {
          toast.error("Failed to fetch vepari data");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVepariData();
  }, [vepariId]);

  // Check if shop is currently open
  useEffect(() => {
    if (vepariData?.shopTime) {
      const checkShopStatus = () => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
        
        const [startHours, startMinutes] = vepariData.shopTime.startTime.split(':').map(Number);
        const [endHours, endMinutes] = vepariData.shopTime.endTime.split(':').map(Number);
        
        const startTimeInMinutes = startHours * 60 + startMinutes;
        const endTimeInMinutes = endHours * 60 + endMinutes;
        
        setIsShopOpen(currentTime >= startTimeInMinutes && currentTime <= endTimeInMinutes);
      };
      
      checkShopStatus();
      // Set up interval to check every minute
      const interval = setInterval(checkShopStatus, 60000);
      
      return () => clearInterval(interval);
    }
  }, [vepariData]);

  const dispatch = useDispatch();
  const [showProductDetailBox, setShowProductDetailBox] = useState(false);
  const [productId, setProductId] = useState("");

  const cartItems = useSelector((state: RootState) => state?.cart?.cartItems);

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: ProductsType) => {
    dispatch(addToCart(product));
  };

  const handleIncrease = (productId: string, maxQty: number) => {
    const currentQty = getCartQuantity(productId);
    if (currentQty < maxQty) {
      dispatch(increaseQuantity(productId));
    }
  };

  const handleDecrease = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleShowProductDetailBox = (id: string) => {
    setShowProductDetailBox(true);
    setProductId(id);
  };

  const likedProducts = useSelector(
    (state: RootState) => state.liked.likedProducts
  );

  const handleLikedProduct = (product: ProductsType) => {
    const isLiked = likedProducts.some((p) => p._id === product._id);
    if (isLiked) {
      dispatch(unlikeProduct(product));
    } else {
      dispatch(likeProduct(product));
    }
  };

  return (
    <div className="border p-3 bg-gray-50">
      <div className="border rounded-lg overflow-auto">
        {typeof vepariData?.banner === "string" ? (
          <img
            src={vepariData?.banner}
            alt="profile preview"
            className="w-[100%] max-w-[1920px] h-[198px] object-cover"
          />
        ) : null}
      </div>
      <div className=" my-2 flex gap-3 p-1 rounded-lg bg-white border">
        <div className="flex gap-2 w-[40%] ">
          <div className=" ">
            {typeof vepariData?.profile === "string" ? (
              <img
                src={vepariData?.profile}
                alt="profile preview"
                className="w-[100px] h-[100px] rounded-[50%]"
              />
            ) : null}
          </div>
          <div className=" flex  flex-col justify-center">
            <p className="font-semibold text-3xl text-gray-800">
              {vepariData?.shopname}
            </p>
            <p className="font-medium text-gray-600 text-lg">
              Total Products: {vepariData?.products.length}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block w-3 h-3 rounded-full ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium">
                {isShopOpen ? 'Open' : 'Closed'} - {formatTimeTo12Hour(vepariData?.shopTime.startTime || '')} to {formatTimeTo12Hour(vepariData?.shopTime.endTime || '')}
              </span>
            </div>
          </div>
        </div>
        <div className=" flex items-center  p-3 w-[60%]">
          <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 w-full">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" border p-3 grid rounded-lg justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 flex-wrap ">
          {vepariData?.products?.map((product) => {
            const quantity = getCartQuantity(product._id ?? "");
            const maxQty = parseInt(product.quantity);

            return (
              <div
                className="flex flex-col gap-2  w-[250px] h-[370px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
                key={product._id}
                onClick={() =>
                  product._id && handleShowProductDetailBox(product._id)
                }
              >
                <img
                  src={product?.mainImage}
                  alt={product.name}
                  className=" w-[250px] h-[150px] rounded-md"
                />
                <p className=" text-gray-500 text-sm capitalize">
                  {vepariData?.shopname}
                </p>
                <p className="text-gray-800 font-medium capitalize">
                  {product?.name?.length > 50
                    ? product.name.substring(0, 50) + "..."
                    : product.name}
                </p>
                <p className=" text-gray-500 text-sm">{product.brand}</p>
                <p className=" text-gray-900 text-lg font-medium">
                  Rs.{product.price}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {quantity === 0 ? (
                    <button
                      className="bg-indigo-500 flex items-center gap-2 justify-center text-white rounded hover:bg-indigo-600 transition text-md font-semibold py-2 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={!isShopOpen}
                    >
                      Add <FaCartShopping />
                    </button>
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between bg-indigo-500 rounded-md text-white px-2 py-1"
                    >
                      <button
                        onClick={() =>
                          product._id && handleDecrease(product._id)
                        }
                        className="w-8 h-8 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex justify-center items-center"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="font-semibold text-lg px-3">
                        {quantity}
                      </span>

                      <button
                        onClick={() =>
                          product._id && handleIncrease(product._id, maxQty)
                        }
                        disabled={quantity >= maxQty || !isShopOpen}
                        className="w-8 h-8 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-50"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  )}

                  <button
                    className={`border flex items-center gap-2 justify-center ${
                      likedProducts.some((p) => p._id === product._id)
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-white hover:bg-gray-100 border border-gray-400"
                    } transition-all duration-200 rounded-md text-md font-semibold py-2 px-4`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikedProduct(product);
                    }}
                  >
                    {likedProducts.some((p) => p._id === product._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                    Like
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showProductDetailBox && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.7)]">
          <div className="bg-gray-50  p-5 relative rounded-lg w-[100%] max-w-[1400px] h-[700px] mx-3 overflow-auto">
            <button
              onClick={() => setShowProductDetailBox(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <ProductDetail
              productId={productId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VepariStorePage;
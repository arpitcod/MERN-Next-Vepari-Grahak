"use client"
import ProductDetail from "@/components/ProductDetail";
import VepariProductDetail from "@/components/super-admin/VepariProductDetail";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

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

const VepariDetails = () => {
  const searchParams = useSearchParams();
  const vepariId = searchParams.get("id");

  const [vepariData, setVepariData] = useState<VepariType | null>(null);
  const [loading, setLoading] = useState(true);

  const [showProductDetailBox, setShowProductDetailBox] = useState(false);
  const [productId, setProductId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = vepariData?.products?.filter((product: ProductsType) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.description.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  }) || [];

  useEffect(() => {
    const fetchVepariData = async () => {
      try {
        if (!vepariId) return;

        const response = await fetch(
          `http://localhost:5000/api/super-admin-auth/get-vepari-details/${vepariId}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setVepariData(data?.getVepariData);
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

  const handleShowProductDetailBox = (id: string) => {
    setShowProductDetailBox(true);
    setProductId(id);
  };

  return (
    <div className="border p-3 bg-gray-50">
      {/* Banner */}
      <div className="border rounded-lg overflow-auto">
        {typeof vepariData?.banner === "string" ? (
          <img
            src={vepariData?.banner}
            alt="banner"
            className="w-[100%] max-w-[1920px] h-[198px] object-cover"
          />
        ) : null}
      </div>

      {/* Profile + Search */}
      <div className=" my-2 flex gap-3 p-1 rounded-lg bg-white border">
        <div className="flex gap-2 w-[40%]">
          <div>
            {typeof vepariData?.profile === "string" ? (
              <img
                src={vepariData?.profile}
                alt="profile"
                className="w-[100px] h-[100px] rounded-[50%]"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-3xl text-gray-800">
              {vepariData?.shopname}
            </p>
            <p className="font-medium text-gray-600 text-lg">
              Total Products: {vepariData?.products?.length || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center p-3 w-[60%]">
          <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 w-full">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : !vepariData?.products || vepariData?.products.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg font-medium">Product Not Found</p>
        </div>
      ) : (
        <div className="border p-3 grid rounded-lg justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 flex-wrap ">
          {filteredProducts.length === 0 && searchQuery ? (
            <div className="col-span-full text-center py-10">
              <h2 className="text-2xl text-gray-500">Product not found</h2>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <div
                className="flex flex-col gap-2 w-[250px] h-[370px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
                key={product._id}
                onClick={() =>
                  product._id && handleShowProductDetailBox(product._id)
                }
              >
                <img
                  src={product?.mainImage}
                  alt={product.name}
                  className=" w-[250px] h-[150px] rounded-md object-cover"
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetailBox && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.7)]">
          <div className="bg-gray-50  p-5 relative rounded-lg w-[100%] max-w-[1400px] h-[700px] mx-3 overflow-auto">
            <button
              onClick={() => setShowProductDetailBox(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <VepariProductDetail productId={productId} />
          </div>
        </div>
      )}
    </div>
  );
};
  

export default VepariDetails;
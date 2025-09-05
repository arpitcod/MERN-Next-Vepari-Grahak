"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

// type VepariType = {
//   _id?: string;
//   banner: File | string | null;
//   profile: File | string | null;
//   vepariname: string;
//   shopname: string;
//   description: string;
//   address: {
//     country: string;
//     state: string;
//     city: string;
//   };
//   category: string;
//   contact: string;
//   shopTime: {
//     startTime: string;
//     endTime: string;
//   };
//   isAdmin: boolean;
//   isActive: boolean;
//   products: ProductsType[];
// };
const VepariProductDetail = ({ productId }: { productId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchProduct, setFetchProduct] = useState<ProductsType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // fetchSingleProduct
  useEffect(() => {
    const fetchSingleProduct = async () => {
      setIsLoading(true);
      try {
       
        if ( !productId) return;

        const response = await fetch(
          `http://localhost:5000/api/super-admin-auth/get-vepari-single-product/${productId}`,
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
          setFetchProduct(data.singleProduct);
          setSelectedImage(data.singleProduct.mainImage); // set default main image
          console.log("from vepari product details",data);
          
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleProduct();
  }, [productId]);

//   loading 
  if (isLoading || !fetchProduct) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }
  return (
        <div className="p-4 space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {/* Image Section */}
               <div className="space-y-4 shadow-md bg-white p-3 rounded-md">
                 <div className="border rounded-md overflow-hidden shadow-sm">
                   <img
                     src={selectedImage || fetchProduct.mainImage}
                     alt={fetchProduct.name || "Product"}
                     className="w-full h-[400px]  transition-all duration-300"
                   />
                 </div>
                 <div className="flex gap-2 overflow-x-auto flex-nowrap py-1 px-1">
                   {[fetchProduct.mainImage, ...(fetchProduct.images || [])]
                     .filter(Boolean)
                     .map((image, index) => (
                       <img
                         key={index}
                         src={image!}
                         alt={`Thumbnail ${index}`}
                         className={`w-[80px] h-[80px] object-cover border rounded-md cursor-pointer transition hover:scale-105 ${
                           selectedImage === image ? "ring-2 ring-indigo-500" : ""
                         }`}
                         onClick={() => setSelectedImage(image!)}
                       />
                     ))}
                 </div>
               </div>
       
               {/* Info Section */}
               <div className="space-y-3 shadow-md bg-white p-3 rounded-md ">
                 <h2 className="text-2xl font-semibold text-gray-800">
                   {fetchProduct.name}
                 </h2>
                 <p className="text-gray-600">{fetchProduct.description}</p>
                 <p className="text-4xl font-semibold text-indigo-600">
                   ₹{fetchProduct.price}
                 </p>
                 <div className=" space-y-1">
                   <p className="text-lg">
                     <strong>Brand:</strong> {fetchProduct.brand}
                   </p>
                   <p className="text-lg">
                     <strong>Category:</strong> {fetchProduct.category}
                   </p>
                   <p className="text-lg">
                     <strong>Quantity:</strong> {fetchProduct.quantity}
                   </p>
                   <div className="flex flex-wrap gap-2 mt-1">
                     <strong>Tags:</strong>
                     {fetchProduct.tags.map((tag, index) => (
                       <span
                         key={index}
                         className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full"
                       >
                         {tag}
                       </span>
                     ))}
                   </div>
       
                 
                 </div>
               </div>
             </div>
       
             {/* Details Section */}
             <div>
               <label
                 htmlFor="details"
                 className="block text-lg font-medium text-gray-700 mb-1"
               >
                 Product Details
               </label>
               <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 p-4 border rounded-md shadow-sm bg-white overflow-y-auto whitespace-pre-wrap text-gray-700">
                 {fetchProduct.details}
               </div>
             </div>
           </div>
  )
};

export default VepariProductDetail;

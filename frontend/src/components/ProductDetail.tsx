"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/CartSlice";
import { usePathname, useRouter } from "next/navigation";
import { IoStorefront } from "react-icons/io5";
import { likeProduct, unlikeProduct } from "../../redux/LikesSlice";
import { increaseClick } from "../../redux/ProfileViewedSlice";

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
  vepariId:string
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
  vepariId:string
  products: ProductsType[];
};

const ProductDetail = ({ productId }: { productId: string }) => {
  const dispatch = useDispatch();
  // navigate
  const router = useRouter();
  const pathname = usePathname();
  console.log("pathname", pathname);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchProduct, setFetchProduct] = useState<ProductsType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const cartItems = useSelector((state: RootState) => state?.cart?.cartItems);
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );

  const likedProducts = useSelector((state: RootState) => state.liked.likedProducts);
  
  const handleLikedProduct = (product: ProductsType) => {
      const isLiked = likedProducts.some((p) => p._id === product._id);
      if (isLiked) {
          dispatch(unlikeProduct(product))
      } else {
        dispatch(likeProduct(product))
      }
    
    };

  // useEffect(() => {
  //   const storedLikes = JSON.parse(
  //     localStorage.getItem("Liked_products") || "[]"
  //   );
  //   setLikes(storedLikes);

  //   const handleLikesUpdate = () => {
  //     const updatedLikes = JSON.parse(
  //       localStorage.getItem("Liked_products") || "[]"
  //     );
  //     setLikes(updatedLikes);
  //   };

  //   window.addEventListener("likesUpdated", handleLikesUpdate);
  //   return () => window.removeEventListener("likesUpdated", handleLikesUpdate);
  // }, []);

  // add to cart
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

  // fetchSingleProduct
  useEffect(() => {
    const fetchSingleProduct = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("vg_token");
        if (!token || !productId) return;

        const response = await fetch(
          `http://localhost:5000/api/get-single-product/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setFetchProduct(data.singleProduct);
          setSelectedImage(data.singleProduct.mainImage); // set default main image
          console.log("from pproduuct detai fetch producct ",data.singleProduct);
          
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

  if (isLoading || !fetchProduct) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  // handle vepari store

  const handleVepariStore = () => {
    // if (getVepariData && getVepariData._id) {
    if (fetchProduct.vepariId) {
      dispatch(increaseClick(fetchProduct.vepariId));
      // dispatch(increaseClick(getVepariData._id))
      // dispatch(increaseClick(getVepariData._id))
      router.push(`/vepari-store?id=${fetchProduct.vepariId}`);
      // toast.success(fetchProduct.vepariId)
      // toast(`/vepari-store?id=${getVepariData._id}`);
    }
  };
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
              {fetchProduct.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Add to Cart / Quantity Control */}
              <div>
                {(() => {
                  const quantity = getCartQuantity(fetchProduct._id || "");
                  const maxQty = parseInt(fetchProduct.quantity);

                  return quantity === 0 ? (
                    <button
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
                      onClick={() => handleAddToCart(fetchProduct)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex justify-center items-center w-full h-12 bg-indigo-600 text-white font-semibold rounded-lg transition duration-200 shadow-md gap-3 px-4">
                      <button
                        onClick={() =>
                          fetchProduct._id && handleDecrease(fetchProduct._id)
                        }
                        className="w-9 h-9 bg-indigo-700 hover:bg-indigo-800 rounded-full flex justify-center items-center"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="text-xl">{quantity}</span>
                      <button
                        onClick={() =>
                          fetchProduct._id &&
                          handleIncrease(fetchProduct._id, maxQty)
                        }
                        disabled={quantity >= maxQty}
                        className="w-9 h-9 bg-indigo-700 hover:bg-indigo-800 rounded-full flex justify-center items-center disabled:opacity-50"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Store Button */}
              {pathname === "/vepari-store" ? null : (
                <div>
                  <button
                    className="w-full h-12  bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md cursor-pointer"
                    onClick={handleVepariStore}
                  >
                    <IoStorefront size={20} />
                    Visit Store
                  </button>
                </div>
              )}

              {/* Like Button */}
              <div>
                <button
                  className={`w-full h-12 border flex items-center gap-2 justify-center ${
                    likedProducts.some((p) => p._id === fetchProduct._id)
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-white hover:bg-gray-100 border border-gray-400"
                  } transition-all duration-200 rounded-md text-md font-semibold`}
                  onClick={() => {
                    
                    handleLikedProduct(fetchProduct);
                  }}
                >
                  {/* <FaHeart size={15}/> Like  */}
                  {/* {isLiked ? (
                                                       <FaHeart size={15} />
                                                     ) : (
                                                       <FaRegHeart size={15} />
                                                     )}{" "} */}
                  {likedProducts.some((p) => p._id === fetchProduct._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  Like
                </button>
              </div>
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
  );
};

export default ProductDetail;

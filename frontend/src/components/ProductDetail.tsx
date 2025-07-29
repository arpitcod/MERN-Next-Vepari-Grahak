"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { addToCart, increaseQuantity, decreaseQuantity } from "../../redux/CartSlice";

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

const ProductDetail = ({ productId }: { productId: string }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchProduct, setFetchProduct] = useState<ProductsType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const cartItems = useSelector((state: RootState) => state?.cart?.cartItems);
  
  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item._id === productId);
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

            <div className="mt-4">
              {(() => {
                const quantity = getCartQuantity(fetchProduct._id || "");
                const maxQty = parseInt(fetchProduct.quantity);
                
                return quantity === 0 ? (
                  <button
                    className="h-[50px] w-[200px] bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-lg font-semibold"
                    onClick={() => handleAddToCart(fetchProduct)}
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <div className="flex items-center justify-between h-[50px] w-[200px] bg-indigo-500 rounded-lg text-white px-4">
                    <button
                      onClick={() => fetchProduct._id && handleDecrease(fetchProduct._id)}
                      className="w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition flex justify-center items-center"
                    >
                      <FaMinus size={14} />
                    </button>

                    <span className="font-semibold text-xl">{quantity}</span>

                    <button
                      onClick={() => fetchProduct._id && handleIncrease(fetchProduct._id, maxQty)}
                      disabled={quantity >= maxQty}
                      className="w-10 h-10 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-50"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                );
              })()}
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

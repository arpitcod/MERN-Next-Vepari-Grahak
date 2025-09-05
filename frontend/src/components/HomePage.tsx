import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ProductDetail from "./ProductDetail";
import { IoMdClose } from "react-icons/io";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/CartSlice";
import { FaCartShopping } from "react-icons/fa6";
import { likeProduct, unlikeProduct } from "../../redux/LikesSlice";

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
const HomePage = () => {
  const dispatch = useDispatch();

  const [isLoading] = useState(false);
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );
  console.log("from home page data", getVepariData);
  const [showProductDetailBox, setShowProductDetailBox] = useState(false);
  const [productId, setProductId] = useState("");
  
  const searchQuery = useSelector((state: RootState) => state.search.query);
  
  const filteredProducts = getVepariData?.products?.filter((product: ProductsType) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.description.toLowerCase().includes(query) ||
      getVepariData?.shopname?.toLowerCase().includes(query)
    );
  }) || [];


  // add to cart 
  const cartItems = useSelector((state: RootState) => state?.cart?.cartItems);

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find((item:ProductsType) => item._id === productId);
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

  // show product detail 
  const handleShowProductDetailBox = (id: string) => {
    setShowProductDetailBox(true);
    setProductId(id);
  };

  const likedProducts = useSelector((state: RootState) => state.liked.likedProducts);

  const handleLikedProduct = (product: ProductsType) => {
      const isLiked = likedProducts.some((p) => p._id === product._id);
      if (isLiked) {
          dispatch(unlikeProduct(product))
      } else {
        dispatch(likeProduct(product))
      }
    
    };

  return (
    <div>
      {isLoading ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" p-3 grid  justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 flex-wrap ">
          {filteredProducts.length === 0 && searchQuery ? (
            <div className="col-span-full text-center py-10">
              <h2 className="text-2xl text-gray-500">Product not found</h2>
            </div>
          ) : (
            filteredProducts?.map((product:ProductsType) => {
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
                  {getVepariData.shopname}
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
                    >
                      <FaCartShopping /> Add
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
                        disabled={quantity >= maxQty}
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
                    {/* <FaHeart size={15}/> Like  */}
                    {/* {isLiked ? (
                      <FaHeart size={15} />
                    ) : (
                      <FaRegHeart size={15} />
                    )}{" "} */}
                    {
                    likedProducts.some((p) => p._id === product._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )
                    }
                    Like
                  </button>
                </div>
              </div>
            );
          })
          )}
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
              //  getVepariData={getVepariData}
              productId={productId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

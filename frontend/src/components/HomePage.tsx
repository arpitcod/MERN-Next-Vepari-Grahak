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
import { toast } from "react-toastify";
import { increaseClick } from "../../redux/ProductClickSlice";
import { fetchAllVepariProducts } from "@/getData/useGetAllProducts";
import { setAllVepariProducts } from "../../redux/GetAllProductsSlice";
import { useRouter } from "next/navigation";


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
  vepariId?: string | { // Add this field
    _id: string;
    shopname: string;
    // other vepari properties if needed
  };
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

  // router 
  const router = useRouter();
  // loading 
  const [isLoading] = useState(false);

  // get vepari data 
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );

  // getAllVepariProducts
  const getAllVepariProducts = useSelector((state:RootState) => state?.allVepariProducts?.AllVepariProducts)
  console.log("from home page data", getVepariData);
  const [showProductDetailBox, setShowProductDetailBox] = useState(false);
  const [productId, setProductId] = useState("");

  // product clicks 
  // const [countProduct,setCountProduct] = useState(1)
  
  // search query 
  const searchQuery = useSelector((state: RootState) => state.search.query);

  // search query 
  // filtered products 
  const filteredProducts = getAllVepariProducts?.filter((product: ProductsType) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.description.toLowerCase().includes(query) ||
      product?.vepariId?.shopname?.toLowerCase().includes(query)
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
  //   const handleShowProductDetailBox = (id: string) => {
  //   const product = filteredProducts.find((p: ProductsType) => p._id === id);
  //   if (product && product.vepariId) {
  //     dispatch(increaseClick({ vepariId: product.vepariId })); // Pass an object with vepariId
  //   }
  //   setShowProductDetailBox(true);
  //   setProductId(id);
  // };

  // In your HomePage component, update the handleShowProductDetailBox function:
const handleShowProductDetailBox = (id: string) => {
  const product = filteredProducts.find((p: ProductsType) => p._id === id);
  
  // Check if product exists and has a vepariId property
  if (product && product.vepariId) {
    // Make sure vepariId is a string, not an object
    const vepariId = typeof product.vepariId === 'string' 
      ? product.vepariId 
      : product.vepariId._id;
    
    if (vepariId) {
      dispatch(increaseClick({ vepariId }));
    }
  }
  
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

   

    // token 

useEffect(() => {
    const token = localStorage.getItem("vg_token");
    if (!token) {
       router.push("/");
    } 
  }, []);


  return (
    <div className="">
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
                  product?._id && handleShowProductDetailBox(product?._id)
                }
              >
                <img
                  src={product?.mainImage}
                  alt={product.name}
                  className=" w-[250px] h-[150px] rounded-md"
                />
                <p className=" text-gray-500 text-sm capitalize">
                  {product?.vepariId?.shopname}
                </p>
                <p className="text-gray-800 font-medium capitalize  h-14">
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

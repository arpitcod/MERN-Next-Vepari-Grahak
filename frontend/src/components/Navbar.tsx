"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserData } from "../../redux/UserSlice";
import { setGetVepari } from "../../redux/GetVepariSlice";
import { setSearchQuery } from "../../redux/SearchSlice";
import { useRouter } from "next/navigation";
import { RootState } from "../../redux/store";
import useGetUser from "@/getData/useGetUser";
import { fetchVepariData } from "@/getData/useGetVepariData";
import MyCart from "./MyCart";
import { fetchAllVepariProducts } from "@/getData/useGetAllProducts";
import { setAllVepariProducts } from "../../redux/GetAllProductsSlice";
import DarkModeToggle from "./DarkModeToggle";

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

const Navbar = () => {
  useGetUser();

  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );

  useEffect(() => {
    console.log("Vepari data heregetVepariDAta", getVepariData);
  }, [getVepariData]);

  const [showAccount, setShowAccount] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartBox, setShowCartBox] = useState(false);
  
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    phone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("vg_token");
    if (token) {
      setUserToken(token);
    } else {
      router.push("/");
    }
  }, []);

  const handleShowCartBox = () => {
    setShowCartBox(true);
  };

  const handleSignupLogin = async () => {
    if (!user.username || !user.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login/signup failed");
      }

      toast.success(responseData.message || "Login successful");
      localStorage.setItem("vg_token", responseData?.token);
      setUserToken(responseData?.token);
      handleData();
      handleFetchAllProdutsData();
      router.push("/");
      setUser({
        username: "",
        phone: "",
      });
      setShowLogin(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("vg_token");

    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();

      if (response?.ok) {
        localStorage.removeItem("vg_token");
        setUserToken(null);
        dispatch(setUserData(null));
        dispatch(setGetVepari({ vepari: null }));

        toast.success(responseData.message || "Logged out successfully");
        setShowAccount(false);
        router.push("/");
      } else {
        throw new Error(responseData.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout");

      localStorage.removeItem("vg_token");
      setUserToken(null);
      dispatch(setUserData(null));
      dispatch(setGetVepari({ vepari: null }));
      setShowAccount(false);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleData = async () => {
    const data = await fetchVepariData();
    if (data) {
      dispatch(setGetVepari(data));
    } else {
      dispatch(setGetVepari({ vepari: null }));
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const handleFetchAllProdutsData = async () => {
    const data = await fetchAllVepariProducts();
    if (data) {
      dispatch(setAllVepariProducts(data));
      console.log("get all vepari products", data);
    } else {
      dispatch(setAllVepariProducts({ products: null }));
      console.error("error fetch products");
    }
  };

  useEffect(() => {
    handleFetchAllProdutsData();
  }, []);

  const border_bg_text_color =
    "hover:bg-indigo-500 hover:text-white border border-indigo-500 transition-all dark:border-indigo-300 dark:hover:bg-indigo-600";

  return (
    <div className="px-2 flex flex-col sm:justify-between sm:flex-row items-center py-3 bg-white shadow-md gap-3 dark:bg-gray-800 dark:text-white">
      <div>
        <p className="text-2xl cursor-pointer text-indigo-900 dark:text-white">
          Vepari Grahak
        </p>
      </div>

      <div className="border border-indigo-600 dark:border-indigo-400 rounded-md flex items-center w-full sm:w-fit px-2 focus-within:ring-1 focus-within:ring-indigo-600 dark:focus-within:ring-indigo-400">
        <FaSearch className="mx-2 text-lg text-gray-600 dark:text-gray-300" />
        <input
          type="text"
          name="search"
          placeholder="search..."
          className="sm:w-[500px] py-3 rounded-md focus:outline-none bg-transparent dark:placeholder:text-gray-300"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md text-lg cursor-pointer"
        >
          Home
        </Link>

        {userToken ? (
          <div className="relative">
            <button
              type="button"
              className="py-3 px-7 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md flex items-center gap-1 text-lg cursor-pointer"
              onClick={() => setShowAccount(!showAccount)}
            >
              <MdAccountCircle /> My Account
            </button>
            {showAccount && (
              <div className="border border-indigo-600 dark:border-indigo-400 w-full absolute top-15 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md p-1 shadow-xl z-50">
                <Link
                  href="/user/user-profile"
                  className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                >
                  Profile
                </Link>
                <Link
                  href="/user/my-orders"
                  className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                >
                  My Orders
                </Link>
                <Link
                  href="/user/likes"
                  className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                >
                  Likes
                </Link>
                <Link
                  href="/user/faqs"
                  className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                >
                  Faqs
                </Link>

                {getVepariData?.isAdmin === true ? (
                  <Link
                    href="/admin-vepari/profile"
                    className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                  >
                    Vepari Studio
                  </Link>
                ) : (
                  <Link
                    href="/user/create-shop"
                    className={`border block my-1 text-center py-2 rounded-md ${border_bg_text_color} dark:text-white`}
                  >
                    Create Shop
                  </Link>
                )}

                <button
                  className="border block my-1 text-center py-2 bg-red-500 text-white rounded-md w-full cursor-pointer hover:bg-red-700"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="py-2 px-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md flex items-center gap-2 text-lg cursor-pointer"
            onClick={() => setShowLogin(!showLogin)}
          >
            Login/Signup
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer text-white rounded-md flex items-center gap-2 text-lg"
            onClick={handleShowCartBox}
          >
            <FaShoppingCart /> Cart
          </button>
          {(() => {
            const cartItems = useSelector(
              (state: RootState) => state?.cart?.cartItems
            );
            const totalItems = cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            );
            return (
              totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )
            );
          })()}
        </div>

        <DarkModeToggle />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed flex justify-center items-center bg-[rgba(0,0,0,0.7)] inset-0 z-50">
          <div className="loader"></div>
        </div>
      )}

      {/* Login/Signup modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-md shadow-lg w-96 relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer text-gray-800 dark:text-white"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <h2 className="text-2xl text-center font-semibold mb-4 dark:text-white">
              Login/Signup
            </h2>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={user?.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Enter phone number"
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={user?.phone}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSignupLogin();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                  setUser({ ...user, phone: val });
                }
              }}
            />
            <p className="text-sm text-center my-1 dark:text-gray-300">
              Super Admin{" "}
              <Link
                href="/super-admin/login"
                className="text-indigo-600 hover:underline font-semibold dark:text-indigo-400"
                onClick={() => setShowLogin(false)}
              >
                Login here
              </Link>
            </p>
            <button
              className={`w-full bg-gray-800 dark:bg-gray-700 text-white py-2 rounded-md cursor-pointer ${
                user.phone.length < 10 || !user.username
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSignupLogin}
              disabled={user.phone.length < 10 || !user.username || isLoading}
            >
              {isLoading ? "Processing..." : "Login/Signup"}
            </button>
          </div>
        </div>
      )}

      {showCartBox && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.7)]">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 relative rounded-lg w-[100%] max-w-[500px] h-[600px] mx-3 overflow-auto">
            <button
              onClick={() => setShowCartBox(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer text-gray-800 dark:text-white"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <MyCart />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
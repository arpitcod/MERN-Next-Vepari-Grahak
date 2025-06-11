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
import { useRouter } from "next/navigation";
import { RootState } from "../../redux/store";
import useGetUser from "@/getData/useGetUser";
import { fetchVepariData } from "@/getData/useGetVepariData";

const Navbar = () => {
  // Initialize data fetching hooks
  // useGetVepariData();
  

  useGetUser();
  
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari
  );

  useEffect(() => {
    console.log('Vepari data heregetVepariDAta', getVepariData)
  }, [getVepariData]);

  const [showAccount, setShowAccount] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    phone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("vg_token");
    setUserToken(token);
  }, []);

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
      // useGetVepariData()
      handleData()
      router.push("/");
      setUser({
        username: "",
        phone: "",
      });
      setShowLogin(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
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
        // Clear all local state
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
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Something went wrong during logout");
      
      // Even if the server request fails, clear local state for better UX
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


  // get vepari data 
    const handleData = async () =>{
    const data =await fetchVepariData()
    if (data) {
       dispatch(setGetVepari(data));
    }else{
         dispatch(setGetVepari({ vepari: null }));
    }
  }
  useEffect(()=>{
    handleData()
  },[])
  // Determine if user is admin
  // const isAdmin = getVepariData?.vepari?.isAdmin === true;

  

  return (
    <div className="px-2 flex flex-col sm:justify-between sm:flex-row items-center py-3 bg-white shadow-md gap-3">
    {/* <div className="px-2 grid grid-cols-5 items-center py-2 bg-white shadow-md "> */}
      <div className="">
        <p className="text-2xl cursor-pointer text-indigo-900 ">
          Vepari Grahak
        </p>
      </div>

      <div className="border rounded-md flex items-center w-full sm:w-fit px-2">
        <FaSearch className="mx-2 text-lg" />
        <input
          type="text"
          name="search"
          placeholder="search..."
          className=" sm:w-[500px] py-3 rounded-md focus:outline-none "
        />
      </div>

      <div>
        <Link
          href="/"
          className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md text-lg cursor-pointer"
        >
          Home
        </Link>
      </div>

      {userToken ? (
        <div className="relative text-gray-200">
          <button
            type="button"
            className="py-3 px-7 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md flex items-center gap-1 text-lg cursor-pointer"
            onClick={() => setShowAccount(!showAccount)}
          >
            <MdAccountCircle /> My Account
            
          </button>
          {showAccount && (
            <div className="border border-indigo-600 w-full absolute top-15 bg-white  text-gray-800 rounded-md p-1 shadow-xl">
              <Link
                href="/user/user-profile"
                className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
              >
                Profile
              </Link>
              <Link
                href="/user/my-orders"
                className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
              >
                My Orders
              </Link>
              <Link
                href="/user/likes"
                className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
              >
                Likes
              </Link>
              <Link
                href="/user/faqs"
                className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
              >
                Faqs
              </Link>
              
              {getVepariData?.vepari?.isAdmin === true ? (
                <Link
                  href="/admin-vepari/profile"
                  className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
                >
                  Vepari Studio
                </Link>
              ) : (
                <Link
                  href="/user/create-shop"
                  className="border block my-1 text-center py-2 rounded-md bg-indigo-500 hover:bg-indigo-600  text-white transition-all"
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
      )
      }

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed flex justify-center items-center bg-[rgba(0,0,0,0.7)] inset-0">
          <div className="loader"></div>
        </div>
      )}

      {/* Login/Signup modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-96 relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <h2 className="text-2xl text-center font-semibold mb-4">
              Login/Signup
            </h2>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none"
              value={user?.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="Enter phone number"
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none"
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
            <button
              className={`w-full bg-gray-800 text-white py-2 rounded-md cursor-pointer ${
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

      <div>
        <button
          type="button"
          className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer text-white rounded-md flex items-center gap-2 text-lg"
        >
          <FaShoppingCart /> My Cart
        </button>
      </div>
    </div>
  );
};

export default Navbar;
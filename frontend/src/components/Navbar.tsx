"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserData } from "../../redux/UserSlice";
// import useGetUser from "@/getData/useGetUser";
// import UserGetData from "@/getData/UserGetData";
import { useRouter } from "next/navigation";
import { RootState } from "../../redux/store";
import useGetUser from "@/getData/useGetUser";
import useGetVepariData from "@/getData/useGetVepariData";

const Navbar = () => {


  useGetUser()
   useGetVepariData()
  // console.log("from navbar",getVepari);
  
  // console.log("from navbar",getUser);
  
  const [showAccount, setShowAccount] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // dispatch
  const disPatch = useDispatch();
  //router
  const router = useRouter();

  //get vepari data
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari
  );
  console.log("from navbar",getVepariData);
  
  //login signup
  const [user, setUser] = useState({
    username: "",
    phone: "",
  });

  // useGetUser()
  useEffect(() => {
    const token = localStorage.getItem("vg_token");
    if (token) {
      setUserToken(token);
    }
    // console.log(process.env.SERVER_LOCALHOST);
  }, []);
  // handle login sign up

  const handleSignupLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:2929/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) {
        toast.error(responseData.message || "login/signup failed");
        return;
      }

      toast.success(responseData.message || "login successfull");
      localStorage.setItem("vg_token", responseData?.token);
      setUserToken(responseData?.token);
      // disPatch(setUserData(responseData));

      router.push("/");
      setUser({
        username: "",
        phone: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowLogin(false);
    }
  };

  // useEffect(() => {
  //   const storedTheme = localStorage.getItem("theme");

  //   if (storedTheme === "dark") {
  //     document.documentElement.classList.add("dark");
  //     setDarkMode(true);
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     setDarkMode(false);
  //   }
  // }, []);

  // const handleDarkMode = () => {
  //   if (darkMode) {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //     setDarkMode(false);
  //   } else {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //     setDarkMode(true);
  //   }
  // };
  // toast.success("hare krishna")

  // handleLogout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:2929/api/logout", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      const responseData = await response.json();

      if (response?.ok) {
        setIsLoading(true);
        localStorage.removeItem("vg_token");
        setUserToken(null);
        router.push("/");
        disPatch(setUserData(null));
        toast.success(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // const userdata = UserGetData()
  // console.log("from user geet data",userdata);

  return (
    <div className=" px-2 flex justify-between items-center py-2 bg-white shadow-md">
      <div className="">
        <p className="text-2xl cursor-pointer text-amber-950 font-z">
          Vepari Grahak
        </p>
      </div>

      <div className="border rounded-md flex items-center">
        <FaSearch className="mx-2 text-lg" />
        <input
          type="text"
          name="search"
          placeholder="search..."
          className=" w-[500px] py-2 rounded-md focus:outline-none"
        />
      </div>
      {/* homme  */}
      <div>
        <Link
          href="/"
          className="py-2 px-5 bg-gray-800 text-white rounded-md  text-lg cursor-pointer"
        >
          Home
        </Link>
      </div>

      {userToken ? (
        <div className="relative text-gray-200">
          <button
            type="button"
            className="py-2 px-5 bg-gray-800 text-white rounded-md flex items-center gap-1 text-lg cursor-pointer"
            onClick={() => setShowAccount(!showAccount)}
          >
            <MdAccountCircle /> My Account
          </button>
          {showAccount && (
            <div className="border w-full absolute top-15 bg-white text-gray-800 rounded-sm p-1 shadow-xl">
              <Link
                href="/user/user-profile"
                className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
              >
                Profile
              </Link>
              <Link
                href="/user/my-orders"
                className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
              >
                My Orders
              </Link>
              {/* <button
                className="border text-center py-1 w-full cursor-pointer"
                onClick={handleDarkMode}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button> */}
              <Link
                href="/user/likes"
                className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
              >
                Likes
              </Link>
              <Link
                href="/user/faqs"
                className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
              >
                Faqs
              </Link>
              {getVepariData?.getVepariData?.isAdmin === true ? (
                <>
                  <Link
                    href="/admin-vepari/profile"
                    className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
                  >
                    Vepari Studio
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/user/create-shop"
                    className="border block my-1 text-center py-1 rounded-sm hover:bg-gray-800 hover:text-gray-50 transition-all"
                  >
                    Create Shop
                  </Link>
                </>
              )}
              <button
                className="border block my-1 text-center py-1 bg-red-500 text-white rounded-md w-full cursor-pointer hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
              {/* <Link
                href="/"
                className="border block my-1 text-center py-1 bg-red-500 text-white rounded-md"
              >
                Logout
              </Link> */}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="py-2 px-8 bg-gray-800 text-white rounded-md flex items-center gap-2 text-lg cursor-pointer"
          onClick={() => setShowLogin(!showLogin)}
        >
          Login/Signup
        </button>
      )}

      {/* loading ...... */}
      {isLoading && (
        <div className="fixed flex justify-center items-center bg-[rgba(0,0,0,0.7)] inset-0">
          <div className="loader"></div>
        </div>
      )}

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
                user.phone.length < 10 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSignupLogin}
              disabled={user.phone.length < 10}
            >
              Login/Signup
            </button>
            <p className="text-md font-bold text-red-500">
              {isLoading && "loading...."}
            </p>
          </div>
        </div>
      )}

      <div>
        <button
          type="button"
          className="py-2 px-5 bg-gray-800 text-white rounded-md flex items-center gap-2 text-lg"
        >
          <FaShoppingCart /> My Cart
        </button>
      </div>
    </div>
  );
};

export default Navbar;

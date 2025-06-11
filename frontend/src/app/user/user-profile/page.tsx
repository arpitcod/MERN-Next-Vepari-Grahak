"use client";

import useGetUser from "@/getData/useGetUser";
import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserData } from "../../../../redux/UserSlice";

const Page = () => {
  useGetUser();
  const user = useSelector((state: any) => state.user.user);
  // const router = useRouter();
  const [showBox, setShowBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const pathName = usePathname()
  // console.log("user", user);

  const [prevUSer, setPrevUser] = useState({
    username: user?.user?.username,
    phone: user?.user?.phone,
  });

  //dispatch
  const dispatch = useDispatch()
  // show box
  const handleShowBox = () => {
     // everytime box khule, latest user data mukho
  if (!showBox) {
    setPrevUser({
      username: user?.user?.username,
      phone: user?.user?.phone,
    });
  }
  setShowBox(!showBox);
  };
  // edit profile
  const handleEditProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:2929/api/update-user/${user?.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prevUSer),
        }
      );
      const responseData = await response.json();
      if (responseData?.success) {
        dispatch(setUserData({ ...user, user: { ...user.user, ...prevUSer } }));
        toast.success(responseData?.message);
        // router.push("/user/user-profile");
        setShowBox(false)
      } else {
        toast.error(responseData?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* <h1 className="text-center text-xl font-medium mt-3"> {user?.user?.username}</h1> */}
      <div className="border py-3 mx-3 flex items-center mt-3 rounded-md bg-white">
        <HiUser className="text-2xl mx-1" />
        <p className="text-lg font-medium">{user?.user?.username}</p>
      </div>
      <div className="border py-3 mx-3 flex items-center mt-3 rounded-md bg-white">
        <FaPhoneAlt className="text-xl mx-2" />
        <p className="text-lg font-medium">{user?.user?.phone}</p>
      </div>
      {showBox && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-96 relative">
            <button
              onClick={() => setShowBox(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer"
            >
              <IoMdClose className="text-3xl" />
            </button>
            <h2 className="text-2xl text-center font-semibold mb-4">
              Edit Profile
            </h2>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none"
              value={prevUSer?.username}
              onChange={(e) =>
                setPrevUser({ ...prevUSer, username: e.target.value })
              }
            />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter phone number"
              maxLength={10}
              minLength={10}
              className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none"
              value={prevUSer?.phone}
              // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              //   if (e.key === "Enter") {
              //     handleSignupLogin();
              //   }
              // }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrevUser({ ...prevUSer, phone: e.target.value })
              }
            />
             {/* <input
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
                        /> */}
            <button
              className={`w-full bg-gray-800 text-white py-2 rounded-md cursor-pointer ${
                prevUSer?.phone?.length < 10
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleEditProfile}
              disabled={prevUSer?.phone?.length < 10}  
            >
              Edit Profile
            </button>
            <p className="text-md font-bold text-red-500">
              {isLoading && "loading...."}
            </p>
          </div>
        </div>
      )}
      <button
        className="border py-2 mt-3 rounded-md  mx-3 flex items-center px-2 cursor-pointer bg-white"
        onClick={handleShowBox}
      >
        <MdEdit className="mx-1 text-xl text-center" /> Edit Profile
      </button>
    </div>
  );
};

export default Page;

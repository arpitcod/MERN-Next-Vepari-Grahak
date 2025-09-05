"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../redux/super-admin/SuperAdminSearchSlice";

const SuperAdminNavbar = () => {
  // Add inside component
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.superAdminSearch.query
  );
  const activeSection = useSelector(
    (state: RootState) => state.superAdminSearch.activeSection
  );
  // router
  const router = useRouter();

  // loading
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_LOGOUT}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        try {
          const data = await response.json();
          toast.success(data.message || "Logged out successfully");
        } catch {
          toast.success("Logged out successfully");
        }
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Network error occurred during logout");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="shadow-md border border-gray-300 bg-white px-3 py-2 flex flex-col sm:flex-row gap-3 justify-between items-center ">
      <div className="">
        <h1 className="font-medium text-2xl">Super Admin</h1>
      </div>
      <div className="border border-gray-400 bg-indigo-50 rounded-md  flex items-center w-full max-w-[700px] px-2 focus-within:ring-1 focus-within:ring-indigo-600">
        <FaSearch className="mx-2 text-lg" />
        <input
          type="text"
          name="search"
          placeholder={`Search ${activeSection}...`}
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className=" sm:w-[500px] py-3 rounded-md focus:outline-none  "
        />
      </div>
      <div className="flex gap-3 ">
        <Link
          href="/super-admin/dashboard"
          className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 transition-all text-white rounded-md text-lg cursor-pointer"
        >
          Home
        </Link>
        <button
          className="border py-3 px-5 bg-red-500 hover:bg-red-600 transition-all text-white rounded-md text-lg cursor-pointer"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default SuperAdminNavbar;

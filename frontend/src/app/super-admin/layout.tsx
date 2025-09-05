"use client"
import SuperAdminGuard from "@/components/super-admin/SuperAdminGuard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react"

interface LayoutProps {
  children: ReactNode;
}




const layout = ({children}:LayoutProps) => {

    const pathName = usePathname();
    
    // function getCookie(name: string): string | undefined {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop()?.split(';').shift();
    // }

    // // Get token from cookies
    // const token = getCookie('token'); // or whatever your token cookie name is
    
    // // Optional: Check if token exists and handle accordingly
    // if (!token) {
    //     console.log('No token found in cookies');
    //     // You might want to redirect to login or handle unauthorized access
    // }
    
    
    // router 
    // const router = useRouter()

    const superAdminSidebarList = [
    {
      name: "Dashboard",
      link: "/super-admin/dashboard",
    },
    {
      name: "User",
      link: "/super-admin/user",
    },
    {
      name: "Vepari",
      link: "/super-admin/vepari",
    },
    {
      name: "Faqs",
      link: "/super-admin/faqs",
    },
  ];
  return (

    // <SuperAdminGuard>
      
    

     <div className="flex flex-col justify-center sm:flex-row gap-2 border border-indigo-900 py-2 bg-gray-100 px-2 mx-2 rounded-md ">
        <div className="border border-indigo-500 sm:h-[600px] sm:w-[250px] px-2 rounded-lg shadow-sm bg-white ">
          <h1 className="text-center text-2xl font-semibold my-3 text-indigo-600">
            {" "}
            Super Admin
          </h1>
          <div>
            {superAdminSidebarList.map((item, index) => {
              const isActive = pathName === item.link;
              return (
                <Link
                  href={item.link}
                  className={`block  shadow-sm shadow-indigo-50 rounded-lg text-center py-3  my-3 hover:bg-indigo-500 hover:text-gray-100 transition-colors ${
                    isActive
                      ? "bg-indigo-500 text-gray-100"
                      : "bg-indigo-200 text-indigo-800"
                  }`}
                  key={index}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          {/* <div>
            <button
              className="border block my-1 text-center  py-3 bg-red-500 text-white rounded-lg w-full cursor-pointer hover:bg-red-700 shadow-sm"
              onClick={()=> vepari?._id && handleDeleteShop(vepari?._id)}
            >
              {isLoading ? "Loading..." : "Delete Shop"}
            </button>
          </div> */}
        </div>
        <div className="border border-indigo-500 sm:h-[600px] sm:w-[900px] rounded-lg p-1 bg-white shadow-md">
          {children}
        </div>
      </div>
      // </SuperAdminGuard>
  )
}

export default layout
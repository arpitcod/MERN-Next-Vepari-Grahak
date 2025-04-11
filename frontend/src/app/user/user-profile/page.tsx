"use client";

import useGetUser from "@/getData/useGetUser";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  useGetUser();
  const user = useSelector((state: any) => state.user.user);
  // const pathName = usePathname()
  console.log("user", user);


  // const accountList =[
  //   {
  //     name:"Profile",
  //     link:"/user/user-profile"
  //   },
  //   {
  //     name:"My Orders",
  //     link:"/"
  //   },
  //   {
  //     name:"Likes",
  //     link:"/"
  //   },
  //   {
  //     name:"Faqs",
  //     link:"/"
  //   },
  //   {
  //     name:"Create Shop",
  //     link:"/"
  //   },
  //   {
  //     name:"Logout",
  //     link:"/"
  //   }
    
  // ]
  return (
    // <div className="border border-red-500 mt-5 ">

    //   <div className="flex justify-center gap-3 border py-2">
    //     <div className="border h-[500px] w-[200px] px-2">
    //        <h1 className="text-center text-xl font-medium mt-3"> {user?.user?.username}</h1>
    //        {/* <div>
    //             {
    //                 accountList.map((item,index) =>{
    //                   const isActive = pathName === item.link
    //                 return (
    //                   <Link href={item.link} className={`block border rounded-lg text-center py-2 transition-colors my-2 ${isActive ? "bg-gray-800 text-gray-100" : ""}`} key={index}>{item.name}</Link>
    //                 )
    //               }
    //               )
    //             }
    //        </div> */}

    //     </div>
    //     <div className="border h-[500px] w-[500px]"></div>
    //   </div>
    //   {/* {children}Z */}
    // </div>
    <div>
         <h1 className="text-center text-xl font-medium mt-3"> {user?.user?.username}</h1>
    </div>
  );
};

export default Page;

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setVepariProducts } from "../../../redux/VepariProductSlice";
import { setGetVepari } from "../../../redux/GetVepariSlice";
import { setUserData } from "../../../redux/UserSlice";
// import { setUserData } from "../../../redux/UserSlice";

interface LayoutProps {
  children: ReactNode;
}
type VepariType = {
  _id?:string;
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
  isAdmin:boolean;
  isActive:boolean;
  // products:ProductsType[]
};
type UserType ={
  username:string,
  phone:number
}
const Layout = ({ children }: LayoutProps) => {
   const vepari = useSelector((state: RootState) => state?.getVepari?.getVepari as VepariType | null)
   const user =  useSelector((state:RootState) => state?.user?.user as UserType | null)
  const pathName = usePathname();
  const [isLoading,setIsloading] = useState(false)

  // useEffect(() =>{},[vepari])
  const router = useRouter()
  const dispatch = useDispatch()
  const vepariStudioList = [
    {
      name: "Profile",
      link: "/admin-vepari/profile",
    },
    // {
    //   name:"Create Category",
    //   link:"/admin-vepari/create-category"
    // },
    {
      name: "Create Product",
      link: "/admin-vepari/create-product",
    },
    {
      name: "My Products",
      link: "/admin-vepari/my-products",
    },
    {
      name: "Dashboard",
      link: "/admin-vepari/dashboard",
    },
  ];


  // delete shop 

  const handleDeleteShop = async (_id:string) =>{
        // console.log(_id);
        toast.success(_id)
        setIsloading(true)
        try {
          const token = localStorage.getItem("vg_token");
          if (!token) {
            toast.error("token not found")
            return
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_DELETE_VEPARI_SHOP}/${_id}`,{
            method:"DELETE",
            headers: {
             Authorization: `Bearer ${token}`,
             },

          })

          const data = await response.json()

          if (response.ok) {
            router.push("/")
            toast.success(data.message)
            dispatch(setVepariProducts(null))
            dispatch(setGetVepari(null))
            dispatch(setUserData({...user,vepari_shop:null}))
            console.log(data);
            
            // dispatch(setUserData())

          }

          
        } catch (error) {
          console.log(error);
          toast.error("something went wrong")
          
        }finally{
          setIsloading(false)
        }
        
  }
  return (
    <div>
      <div className="flex flex-col justify-center sm:flex-row gap-2 border border-indigo-900 py-2 bg-gray-100 px-2 mx-2 rounded-md ">
        <div className="border border-indigo-500 sm:h-[700px] sm:w-[250px] px-2 rounded-lg shadow-sm bg-white ">
          <h1 className="text-center text-2xl font-semibold my-3 text-indigo-600">
            {" "}
            Vepari Studio
          </h1>
          <div>
            {vepariStudioList.map((item, index) => {
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
          <div>
            <button
              className="border block my-1 text-center  py-3 bg-red-500 text-white rounded-lg w-full cursor-pointer hover:bg-red-700 shadow-sm"
              onClick={()=> vepari?._id && handleDeleteShop(vepari?._id)}
            >
              {isLoading ? "Loading..." : "Delete Shop"}
            </button>
          </div>
        </div>
        <div className="border border-indigo-500 sm:h-[700px] sm:w-[900px] rounded-lg p-1 bg-white shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

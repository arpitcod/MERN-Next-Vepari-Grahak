"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

const Layout = ({children}) => {
    const user = useSelector((state: RootState) => state?.user?.user);
    const getVepariData = useSelector((state:RootState) => state?.getVepari?.getVepari);
    const pathName = usePathname()

    // useEffect(() =>{},[getVepariData])
    const accountList =[
        {
          name:"Profile",
          link:"/user/user-profile"
        },
        {
          name:"My Orders",
          link:"/user/my-orders"
        },
        {
          name:"Likes",
          link:"/user/likes"
        },
        {
          name:"Faqs",
          link:"/user/faqs"
        },

          //get vepari data
         
          // console.log("getVepariData",getVepariData.vepari.isAdmin);
          
            getVepariData?.isAdmin === true ? (
              {
                name:"Vepari Studio",
                link:"/admin-vepari/profile"
              }
            ) : (
              {
                name:"Create Shop",
                link:"/user/create-shop"
              }
            )
          
      //   !getVepariData?.vepari?.isAdmin === true ? (
      //     {
      //     name:"Create Shop",
      //     link:"/user/create-shop"
      //   }
          
      //   ) : (
      //     {
      //    name:"Vepari Studio",
      //    link:"/admin-vepari/profile"
      //  }
       
      //   )

        
      ]
  return (
    <div className=" mt-5 ">

    <div className="flex flex-col justify-center sm:flex-row gap-2 border border-indigo-900 py-2 bg-gray-100 px-2 mx-2 rounded-md">
      <div className="border border-indigo-500 sm:h-[700px] sm:w-[250px] px-2 rounded-lg shadow-sm bg-white ">
         <div className="w-20 h-20 mx-auto mt-3 bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold rounded-full shadow">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
         <h1 className="text-center text-2xl font-medium  text-capitalize"> {user?.username}</h1>
         <div>
              {
                  accountList?.map((item,index) =>{
                    const isActive = pathName === item.link

                  return (
                    <Link href={item.link} className={`block  shadow-sm shadow-indigo-50 rounded-lg text-center py-3  my-2 hover:bg-indigo-500 hover:text-gray-100 transition-colors ${isActive ? "bg-indigo-500 text-gray-100" : "bg-indigo-200 text-indigo-800"}`} key={index}>{item.name}</Link>
                  )
                }
                )
              }
         </div>

      </div>
      <div className="border border-indigo-500 sm:h-[700px] sm:w-[900px] rounded-lg p-1 bg-white shadow-md">

            {children}
      </div>
    </div>
  </div>
  )
}

export default Layout
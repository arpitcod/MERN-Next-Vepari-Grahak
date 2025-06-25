"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'


interface LayoutProps{
    children : ReactNode;
}
const layout = ({children}:LayoutProps) => {
       const pathName = usePathname();
        const vepariStudioList =[
            {
              name:"Profile",
              link:"/admin-vepari/profile"
            },
            // {
            //   name:"Create Category",
            //   link:"/admin-vepari/create-category"
            // },
            {
              name:"Create Product",
              link:"/admin-vepari/create-product"
            },
            {
              name:"My Products",
              link:"/admin-vepari/my-products"
            },
            {
              name:"Dashboard",
              link:"/admin-vepari/dashboard"
            },

    
            
          ]
  return (
    <div>

<div className="flex flex-col justify-center sm:flex-row gap-2 border border-indigo-900 py-2 bg-gray-100 px-2 mx-2 rounded-md ">
      <div className="border border-indigo-500 sm:h-[700px] sm:w-[250px] px-2 rounded-lg shadow-sm bg-white ">
         <h1 className="text-center text-2xl font-medium my-3 text-indigo-600"> Vepari Studio</h1>
         <div>
              {
                  vepariStudioList.map((item,index) =>{
                    const isActive = pathName === item.link
                  return (
                    <Link href={item.link} className={`block  shadow-sm shadow-indigo-50 rounded-lg text-center py-3  my-3 hover:bg-indigo-500 hover:text-gray-100 transition-colors ${isActive ? "bg-indigo-500 text-gray-100" : "bg-indigo-200 text-indigo-800"}`} key={index}>{item.name}</Link>
                  )
                }
                )
              }
         </div>
         <div>
         <button
                className="border block my-1 text-center  py-3 bg-red-500 text-white rounded-lg w-full cursor-pointer hover:bg-red-700 shadow-sm"
                // onClick={handleLogout}
              >
                Delete Shop
              </button>
         </div>

      </div>
      <div className="border border-indigo-500 sm:h-[700px] sm:w-[900px] rounded-lg p-1 bg-white shadow-md">

            {children}
      </div>
    </div>
    </div>
  )
}

export default layout

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
            {
              name:"Create Category",
              link:"/admin-vepari/create-category"
            },
            {
              name:"Create Product",
              link:"/admin-vepari/create-product"
            },
            {
              name:"Dashboard",
              link:"/admin-vepari/dashboard"
            },

    
            
          ]
  return (
    <div>

<div className="flex justify-center gap-2 border py-2 bg-gray-100">
      <div className="border h-[550px] w-[200px] px-2 rounded-lg shadow-sm bg-white">
         <h1 className="text-center text-2xl font-medium mt-3"> Vepari Studio</h1>
         <div>
              {
                  vepariStudioList.map((item,index) =>{
                    const isActive = pathName === item.link
                  return (
                    <Link href={item.link} className={`block border shadow-sm rounded-lg text-center py-2 transition-colors my-2 hover:bg-gray-800 hover:text-gray-100 transition-colors ${isActive ? "bg-gray-800 text-gray-100" : ""}`} key={index}>{item.name}</Link>
                  )
                }
                )
              }
         </div>
         <div>
         <button
                className="border block my-1 text-center  py-2 bg-red-500 text-white rounded-lg w-full cursor-pointer hover:bg-red-700 shadow-sm"
                // onClick={handleLogout}
              >
                Delete Shop
              </button>
         </div>

      </div>
      <div className="border h-[550px] w-[800px] rounded-lg p-1 bg-white shadow-md">

            {children}
      </div>
    </div>
    </div>
  )
}

export default layout

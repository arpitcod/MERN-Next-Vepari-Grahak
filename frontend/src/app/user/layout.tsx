"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const layout = ({children}) => {
    const user = useSelector((state: any) => state.user.user);
    const pathName = usePathname()
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
        {
          name:"Create Shop",
          link:"/user/create-shop"
        },

        
      ]
  return (
    <div className=" mt-5 ">

    <div className="flex justify-center gap-2 border py-2 bg-gray-100">
      <div className="border h-[550px] w-[200px] px-2 rounded-lg shadow-sm bg-white">
         <h1 className="text-center text-xl font-medium mt-3"> {user?.user?.username}</h1>
         <div>
              {
                  accountList.map((item,index) =>{
                    const isActive = pathName === item.link
                  return (
                    <Link href={item.link} className={`block border shadow-sm rounded-lg text-center py-2 transition-colors my-2 hover:bg-gray-800 hover:text-gray-100 transition-colors ${isActive ? "bg-gray-800 text-gray-100" : ""}`} key={index}>{item.name}</Link>
                  )
                }
                )
              }
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
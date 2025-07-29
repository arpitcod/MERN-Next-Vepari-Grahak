"use client"
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
type ProductsType = {
  _id?: string;           // keep optional only if it's actually optional
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: string;
  tags: string[];
  description: string;
  details: string;
  mainImage?: string;
  images?: string[];
};

type VepariType = {
  _id?: string;
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
  isAdmin: boolean;
  isActive: boolean;
  products: ProductsType[];
};
const Page = () => {
   const vepari = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );
  const card = [
    {
      name:"Total Products",
      count:vepari?.products?.length
    },
    {
      name:"Profile Viewed",
      count:"10"
    },
    {
      name:"Product Click",
      count:"5"
    },
    {
      name:"Product Ordered",
      count:"2"
    },
    
  ]
  return (
    <div className=' p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center place-items-center'>

      {
        card.map((c) =>(
          <>
            <div className='border w-[100%] max-w-[400px] h-[150px] flex justify-center items-center flex-col rounded-lg bg-indigo-600 text-white shadow-md'>
                <p className='text-ld font-semibold'>{c.name}</p>
                <p className='text-6xl font-bold '>{c.count}</p>
            </div>
          </>
        ))
      }
       
    </div>
  )
}

export default Page
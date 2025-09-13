"use client"
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { selectTotalClicks, selectVepariClicks } from '../../../../redux/ProductClickSlice';
import { profileClickCount } from '../../../../redux/ProfileViewedSlice';
import { toast } from 'react-toastify';
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
// In your dashboard page component:
// Get clicks for this specific vepari
const vepariClicks = useSelector((state: RootState) => 
  state.productClicks.clicksByVepari[vepari?._id || ""] || 0
);




  const myViews = useSelector((state: RootState) => profileClickCount(state, vepari?._id));
  // toast.success(vepari?._id)


  // const totalClicksLength = useSelector(selectTotalClicks);
  // const profileViewedLength = useSelector(profileClickCount);
  const card = [
    {
      name:"Total Products",
      count:vepari?.products?.length
    },
    {
      name:"Profile Viewed",
      count:myViews
    },
    {
      name:"Product Clicks",
      count:vepariClicks
    },
    // {
    //   name:"Total Clicks",
    //   count:vepariClicks
    // },
    {
      name:"Product Ordered",
      count:"?"
    },
    
  ]
  return (
    <div className=' p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center place-items-center'>

      {
        card.map((c) =>(
          <>
            <div className='border border-gray-300 w-[100%] max-w-[400px] h-[150px] flex justify-center items-center flex-col rounded-lg bg-white text-gray-700 hover:bg-indigo-500 hover:text-white transition-all shadow-md'>
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
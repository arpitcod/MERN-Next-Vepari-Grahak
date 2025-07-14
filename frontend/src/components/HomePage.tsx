import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


type ProductsType = {
  _id?: string; // keep optional only if it's actually optional
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
  products:ProductsType[]
};
const HomePage = () => {
  const [isLoading] = useState(false);
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );

  console.log("from home page data", getVepariData);

  return (
    <div>
      {isLoading ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" p-3 grid  justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 flex-wrap ">
          {getVepariData?.products?.map((product) => (
            <div
              className="flex flex-col gap-2  w-[250px] h-[370px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
              key={product._id}
            >
              <img
                src={product?.mainImage}
                alt={product.name}
                className=" w-[250px] h-[150px] rounded-md"
              />

              <p className=" text-gray-500 text-sm capitalize">
                {getVepariData.shopname}
              </p>
              <p className="text-gray-800 font-medium capitalize">
                {product.name
                  ? product.name.length > 10
                    ? product.name.substring(0, 50) + "..."
                    : product.name
                  : ""}
              </p>
              <p className=" text-gray-500 text-sm">{product.brand}</p>
              <p className=" text-gray-900 text-lg font-medium">
                Rs.{product.price}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="border p-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600  transition-all duration-200 rounded-md">
                  add to cart
                </button>
                <button className="border p-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600  transition-all duration-200 rounded-md">
                  like
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

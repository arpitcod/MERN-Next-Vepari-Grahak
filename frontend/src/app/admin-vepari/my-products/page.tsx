"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setVepariProducts } from "../../../../redux/VepariProductSlice";

const MyProductsPage = () => {
  const dispatch = useDispatch();

  const [getProducts, setGetProducts] = useState([]);
  // Redux stateમાંથી vepari data લવવું
  const vepari = useSelector(
    (state: RootState) => state.getVepari.getVepari?.vepari
  );

  const [isLoadiing, setIsLoading] = useState(false);
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("vg_token");
      if (!token || !vepari?._id) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SINGLE_VEPARI_PRODUTCS}/${vepari._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setGetProducts(data);
      dispatch(setVepariProducts(data));
      console.log(getProducts);
    } catch (error) {
      console.log("Error fetching products:", error);
      dispatch(setVepariProducts(null));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("getProducts", getProducts);
  }, [getProducts]);

  useEffect(() => {
    if (vepari?._id) {
      fetchProducts();
    }
  }, [vepari?._id]); // vepari._id change thay tyare fetch

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <h1 className="text-center font-medium">Total Products: {getProducts?.totalProducts}</h1>
      {/* product card  */}

      {isLoadiing ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" p-3 grid  justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-wrap ">

          {
           getProducts?.products?.map((product: any)  =>(

              <div className="flex flex-col gap-2  w-[250px] h-[350px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer" key={product._id}>
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className=" w-[250px] h-[150px] rounded-md"
                />
                <p className=" text-gray-500 text-sm capitalize">{vepari.shopname}</p>
                <p className="text-gray-800 font-medium capitalize">{product.name}</p>
                <p className=" text-gray-500 text-sm">{product.brand}</p>
                <p className=" text-gray-900 text-lg font-medium">Rs.{product.price}</p>
                <div className="grid grid-cols-2 gap-2 justify-between">
                      <button className="border py-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-all rounded-md">Add(0)</button>
                      <button className="border py-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-all rounded-md">Like</button>
                </div>
              </div>

            ))
          }
         
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;

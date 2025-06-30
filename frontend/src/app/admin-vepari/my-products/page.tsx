"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setVepariProducts } from "../../../../redux/VepariProductSlice";
import { IoMdClose } from "react-icons/io";
import EditVepariProduct from "@/components/EditVepariProduct";
import { FaEdit } from "react-icons/fa";

const MyProductsPage = () => {
  const dispatch = useDispatch();

  const [getProducts, setGetProducts] = useState([]);
  // Redux stateમાંથી vepari data લવવું
  const vepari = useSelector(
    (state: RootState) => state.getVepari.getVepari?.vepari
  );

  const [isLoadiing, setIsLoading] = useState(false);

  const [showEditProductBox, setEditProductBox] = useState(false);
  const [productId, setProductId] = useState("");

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
      dispatch(setVepariProducts({products:data.products}));
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

  const handleShowEditProductBox = (id: string) => {
    setProductId(id);
    setEditProductBox(true);
  };

  // console.log(productId);

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <h1 className="text-center font-medium">
        Total Products: {getProducts?.totalProducts}
      </h1>
      {/* product card  */}

      {isLoadiing ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" p-3 grid  justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-wrap ">
          {getProducts?.products?.map((product: any) => (
            <div
              className="flex flex-col gap-2  w-[250px] h-[350px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
              key={product._id}
            >
              <img
                src={product.mainImage}
                alt={product.name}
                className=" w-[250px] h-[150px] rounded-md"
              />

              <p className=" text-gray-500 text-sm capitalize">
                {vepari.shopname}
              </p>
              <p className="text-gray-800 font-medium capitalize">
                {product.name}
              </p>
              <p className=" text-gray-500 text-sm">{product.brand}</p>
              <p className=" text-gray-900 text-lg font-medium">
                Rs.{product.price}
              </p>
              {/* <div className="grid grid-cols-2 gap-2 justify-between"> */}
              {/* <button className="border py-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-all rounded-md">
                  Add(0)
                </button> */}
              <button
                onClick={() => handleShowEditProductBox(product._id)}
                className="flex items-center justify-center gap-1 py-2 border bg-indigo-500 text-indigo-50 hover:bg-indigo-600  transition-all duration-200 rounded-md shadow-sm font-medium"
              >
                <FaEdit className="text-lg" />
                Edit
              </button>
              {/* </div> */}
            </div>
          ))}
        </div>
      )}

      {showEditProductBox && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.7)]">
          <div className="bg-white  p-5 relative rounded-lg">
            <button
              onClick={() => setEditProductBox(false)}
              className="absolute top-2 right-2 text-xl cursor-pointer"
            >
              <IoMdClose className="text-3xl" />
            </button>

            <EditVepariProduct productId={productId} setEditProductBox={setEditProductBox}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;

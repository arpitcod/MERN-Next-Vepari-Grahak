"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setVepariProducts } from "../../../../redux/VepariProductSlice";
import { IoMdClose } from "react-icons/io";
import EditVepariProduct from "@/components/EditVepariProduct";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
// import { setGetVepari } from "../../../../redux/GetVepariSlice";
import { toast } from "react-toastify";
import { setGetVepari } from "../../../../redux/GetVepariSlice";
import { removeProduct } from "../../../../redux/GetAllProductsSlice";

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
const MyProductsPage = () => {
  const dispatch = useDispatch();

  const [getProducts, setGetProducts] = useState<ProductsType[]>([]);
  // Redux stateમાંથી vepari data લવવું
  const vepari = useSelector(
    (state: RootState) => state?.getVepari?.getVepari as VepariType | null
  );
  const products = (vepari?.products as ProductsType[]) || [];
  //  const vepariProducts = useSelector((state: RootState) =>state?.vepariProducts?.vepariProducts?.products)

  console.log("vepari", vepari);
  console.log("products", products);
  // console.log("getVepari",getVepari);

  const [isLoadiing, setIsLoading] = useState(false);

  const [showEditProductBox, setEditProductBox] = useState(false);
  const [productId, setProductId] = useState("");

  // useEffect(() =>{
  //   console.log("vepari",vepari);

  // },[vepari])
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("vg_token");
      if (!token) {
        toast.error("token not  found");
      }
      if (!vepari?._id) {
        toast.error("vepari id not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SINGLE_VEPARI_PRODUTCS}/${vepari?._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      dispatch(setVepariProducts({ products: data?.products }));
      dispatch(setGetVepari({ ...vepari, products: data?.products }));
      setGetProducts(data?.products);
      console.log("get products", getProducts);
      console.log("data", data);
    } catch (error) {
      console.log("Error fetching products:", error);
      dispatch(setVepariProducts(null));
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //       if (vepari) {

  //       }
  // }, [getProducts]);

  useEffect(() => {
    if (vepari) {
      fetchProducts();
    }
  }, []); // vepari._id change thay tyare fetch

  // useEffect(() =>{
  //     if (vepari) {
  //         console.log(vepari);

  //     }
  // },[vepari,setGetProducts])

  const handleShowEditProductBox = (id: string) => {
    setProductId(id);
    setEditProductBox(true);
  };

  const handleDeleteProduct = async (id: string) => {
    // toast.success(id);
    try {
      const token = localStorage.getItem("vg_token");
      if (!token) {
        toast.error("token not found")
      };
      const response = await fetch(`http://localhost:5000/api/delete-product/${id}`,{
        method:"DELETE",
        headers:{
            Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
         toast.success(data.message)
         dispatch(removeProduct(id)) // Remove from all vepari products Redux state
         fetchProducts()
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong")
      
    }
  };     
  // console.log(productId);

  // vepari data લોડ ન થયું હોય ત્યારે loading message
  // if (!vepari) {
  //   return <div className="text-center py-5">Loading Vepari data...</div>;
  // }
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <h1 className="text-center font-medium">
        Total Products: {products?.length || 0}
      </h1>
      {/* product card  */}

      {isLoadiing ? (
        <h1 className="text-center text-2xl">Loading...</h1>
      ) : (
        <div className=" p-3 grid  justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-wrap ">
          {products?.length === 0 ? (
            <p className="text-center col-span-full">Product not Found</p>
          ) : (
            vepari?.products?.map((product: ProductsType) => (
              <div
                className="flex flex-col gap-2  w-[250px] h-[360px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
                key={product?._id}
              >
                <img
                  src={product?.mainImage}
                  alt={product.name}
                  className=" w-[250px] h-[150px] rounded-md"
                />

                <p className=" text-gray-500 text-sm capitalize">
                  {vepari?.shopname}
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
                <div className="grid grid-cols-2 gap-2 justify-between">
                  <button
                    onClick={() =>
                      product._id && handleShowEditProductBox(product?._id)
                    }
                    className="flex items-center justify-center gap-1 py-2 border bg-indigo-500 text-indigo-50 hover:bg-indigo-600  transition-all duration-200 rounded-md shadow-sm font-medium cursor-pointer"
                  >
                    <FaEdit className="text-lg" />
                    Edit
                  </button>
                  <button 
                    className="flex items-center justify-center gap-0.5 border py-2 bg-red-500 text-indigo-50 hover:bg-red-600 transition-all rounded-md cursor-pointer"
                    onClick={() => product._id && handleDeleteProduct(product?._id)}
                  
                  >
                    <MdDelete className="text-xl" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
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

            <EditVepariProduct
              productId={productId}
              setEditProductBox={setEditProductBox}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;

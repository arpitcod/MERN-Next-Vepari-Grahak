"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setVepariProducts } from "../../redux/VepariProductSlice";
import { useRouter } from "next/navigation";
import { setGetVepari } from "../../redux/GetVepariSlice";

type ProductFromAPI = {
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: string;
  tags: string[];
  description: string;
  details: string;
  mainImage: string;     // URL from backend
  images: string[];     // URLs from backend
};

  type ProductsType = {
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: string;
  tags: string[];
  description: string;
  details: string;
};

const EditVepariProduct = ({
  productId,
  setEditProductBox
}: {
  productId: string;
  setEditProductBox: (value: boolean) => void;
}) => {

  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter()

  const [fetchProduct, setFetchProduct] = useState<ProductFromAPI | null>(null);
  const [productData, setProductData] = useState<ProductsType>({
    name: "",
    brand: "",
    price: "",
    quantity: "",
    category: "",
    tags: [],
    description: "",
    details: "",

  });

  //  const getVepariData = useSelector(
  //   (state: RootState) => state?.getVepari?.getVepari
  // );
  // const vepari = getVepariData?.vepari;

  // useEffect(() => {
  //   if (vepari?.category) {
  //     setProductData((prev) => ({
  //       ...prev,
  //       category: vepari.category,
  //     }));
  //   }
  // }, [vepari]);

  // images
  const [images, setImages] = useState<(File | null)[]>(Array(7).fill(null));
  const [previews, setPreviews] = useState<string[]>(Array(7).fill(""));

  // main image
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [prevMainImage, setPrevMainImage] = useState<string>("");

  // tags

  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState<string>("");

 

  // get single product

  useEffect(() => {
    const fetchSingleProduct = async () => {
      setIsloading(true);

      try {
        const token = localStorage.getItem("vg_token");
        if (!token || !productId) return;

        const response = await fetch(
          `http://localhost:5000/api/get-single-product/${productId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.singleProduct) {
          setFetchProduct(data.singleProduct);
          console.log("single product", data.singleProduct);
          console.log("single product", data);
        }
      } catch (error) {
        console.log(error);
        toast.error("something went wrong");
      } finally {
        setIsloading(false);
      }
    };

    fetchSingleProduct();
  }, [productId]);

  useEffect(() => {
    if (fetchProduct) {
      setProductData({
      name: fetchProduct.name || "",
      brand: fetchProduct.brand || "",
      price: fetchProduct.price || "",
      quantity: fetchProduct.quantity || "",
      category: fetchProduct.category || "",
      description: fetchProduct.description || "",
      details: fetchProduct.details || "",
      tags: fetchProduct.tags || [],
      // mainImage: fetchProduct.mainImage || null,    // we keep file null initially
      // images: fetchProduct.images ||  [],         // initially empty
    });

      setTags(fetchProduct.tags || [])
      setPrevMainImage(  fetchProduct.mainImage || "")
      setPreviews(fetchProduct.images || new Array(7).fill(""))

       // fetchProduct.images should be array of image URLs
    // if (fetchProduct.images && Array.isArray(fetchProduct.images)) {
    //   // make sure always have 7 items
    //   const previewsArray = [...fetchProduct.images];
    //   while (previewsArray.length < 7) {
    //     previewsArray.push("");
    //   }
    //   setPreviews(previewsArray);
    // } else {
    //   setPreviews(Array(7).fill(""));
    // }


  }
  }, [fetchProduct]);

   // images
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews[index] = URL.createObjectURL(file);
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[index] = null;
    newPreviews[index] = "";
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedTag = inputTag.trim();

    if ((e.key === "Enter" || e.key === ",") && trimmedTag) {
      e.preventDefault();

      if (tags.length >= 8) {
        toast.error("Maximum 8 tags allowed");
        return;
      }

      // if (trimmedTag.length < 3) {
      //   toast.error("Minimum 3 characters required");
      //   return;
      // }

      // if (trimmedTag.length > 10) {
      //   toast.error("Maximum 10 characters allowed");
      //   return;
      // }

      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setInputTag("");
      } else {
        toast.error("Tag already added");
      }
    }
  };

  // remove tag
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  
  // update product
  const handleUpdateProduct = async () =>{
    const formData = new FormData()

    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("price", String(productData.price));
    formData.append("quantity", String(productData.quantity));
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("details", productData.details);

      // tags
     tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // main image 
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    // images 
    images.forEach((img) => {
      if (img) {
        formData.append(`images`, img);
      }
    });

    try {
      setIsloading(true)
      const token = localStorage.getItem("vg_token");
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/update-vepari-product/${productId}`,{
        method:"PUT",
        headers:{
            Authorization: `Bearer ${token}`,

        },
        body:formData
      })

      const data = await response.json()

      if (response.ok) {
          toast.success(data.message)
          dispatch(setVepariProducts({products:data.products}));
          // dispatch(setGetVepari({ vepari: data.products }));
          setEditProductBox(false)
          router.push("/admin-vepari/my-products");
    
          console.log("updated data",data);
          

      }


    } catch (error) {
      console.log(error);
      toast.error("something went wrong")

    }finally{
      setIsloading(false)
    }
  }

  const input_style =
    "border border-indigo-300 p-3 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
  return (
    <div className="w-[900px] h-[600px] overflow-auto">
      <h1>hare krishna</h1>
      <p>{productId}</p>
      <div className="max-w-5xl mx-auto p-6  rounded-lg   h-full">
        <h1 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">
          Update Product
        </h1>

        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={input_style}
            placeholder="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({
                ...productData,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* Brand */}
        <div className="flex flex-col">
          <label htmlFor="brand" className="text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            id="brand"
            className={input_style}
            placeholder="Brand"
            value={productData.brand}
            onChange={(e) =>
              setProductData({
                ...productData,
                brand: e.target.value,
              })
            }
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className={input_style}
            placeholder="Price"
            value={productData.price}
            onChange={(e) =>
              setProductData({
                ...productData,
                price: e.target.value,
              })
            }
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            className={input_style}
            placeholder="Quantity"
            value={productData.quantity}
            onChange={(e) =>
              setProductData({
                ...productData,
                quantity: e.target.value,
              })
            }
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            className={input_style}
            placeholder="Category"
            value={productData.category}
            onChange={(e) =>
              setProductData({ ...productData, category: e.target.value })
            }
            disabled
          />
        </div>

        {/* Tags (You can replace this later with tag input logic) */}
        {/* Tags Input */}
        <div className="flex flex-col">
          <label htmlFor="tags" className="text-sm font-medium text-gray-700">
            Tags <span className="text-red-500">Limit 8 Tags</span>
          </label>
          <div className="flex flex-wrap gap-2 border border-indigo-300 p-2 rounded-md focus-within:ring-2 ring-indigo-400">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              className="flex-1 min-w-[100px] outline-none p-1"
              placeholder="Type and press Enter or ',' "
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className={input_style}
            placeholder="Description"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />
        </div>

        {/* Main Image */}
        <div className="flex flex-col ">
          <label
            htmlFor="mainImage"
            className="text-sm font-medium text-gray-700"
          >
            Main Image
          </label>
          <div className=" flex justify-center">
            <div className="relative border-2 border-dashed border-gray-300 p-2 rounded-md w-[250px] h-[150px] flex flex-col justify-center items-center bg-gray-50 hover:border-indigo-400">
              <input
                type="file"
                name="mainImage"
                id="mainImage"
                accept="image/*"
                className={`${input_style} hidden`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setMainImage(file);
                  setPrevMainImage(URL.createObjectURL(file));
                }}
              />

              <label
                htmlFor="mainImage"
                className="cursor-pointer w-full h-full flex items-center justify-center"
              >
                {prevMainImage ? (
                  <img
                    src={prevMainImage}
                    alt="Main Preview"
                    className="object-cover w-full h-full rounded flex items-center"
                  />
                ) : (
                  <span className="text-sm text-gray-500 text-center">
                    Upload (250px x 150px)
                  </span>
                )}
              </label>

              {prevMainImage && (
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setPrevMainImage("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Multiple Image Uploads */}
        <label className="text-sm font-medium text-gray-700 mb-2">
          Product Images (Max 7)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 my-4">
          {images.map((_, index) => (
            <div
              key={index}
              className="relative border-2 border-dashed border-gray-300 p-2 rounded-md w-[100px] h-[100px] flex flex-col justify-center items-center bg-gray-50 hover:border-indigo-400"
            >
              <input
                type="file"
                id={`image-${index}`}
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="hidden"
              />
              <label
                htmlFor={`image-${index}`}
                className="cursor-pointer w-full h-full flex items-center justify-center"
              >
                {previews[index] ? (
                  <img
                    src={previews[index]}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-500 text-center">
                    Upload {index + 1}
                  </span>
                )}
              </label>

              {previews[index] && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="details"
            className="text-sm font-medium text-gray-700"
          >
            Details
          </label>
          <textarea
            name="details"
            id="details"
            placeholder="Details..."
            className="w-full h-48 border border-indigo-300 rounded-md  p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={productData.details}
            onChange={(e) =>
              setProductData({ ...productData, details: e.target.value })
            }
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpdateProduct}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg font-medium transition"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default EditVepariProduct;

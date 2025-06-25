"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../../../redux/store";
// import { setVepariProducts } from "../../../../redux/VepariProductSlice";

const Page = () => {
  type ProductsType = {
    name: string;
    brand: string;
    price: string;
    quantity: string;
    category: string;
    tags: string[]; // array of tag strings
    description: string;
    details: string;
    mainImage: File | null; // single file
    images: File[]; // array of multiple files
  };

  // dispatch 
  // const dispatch = useDispatch()
  // fetcch vepari data
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari
  );
  const vepari = getVepariData?.vepari;

  useEffect(() => {
    if (vepari?.category) {
      setProductData((prev) => ({
        ...prev,
        category: vepari.category,
      }));
    }
  }, [vepari]);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // images
  const [images, setImages] = useState<(File | null)[]>(Array(7).fill(null));
  const [previews, setPreviews] = useState<string[]>(Array(7).fill(""));

  // main image
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [prevMainImage, setPrevMainImage] = useState<string>("");

  // tags

  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState<string>("");

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

  // const handleOnchangeMainImage = (e: React.ChangeEvent<HTMLInputElement>) =>{
  //     const file = e.target.files?.[0]
  //     if (!file) return;
  //     setMainImage(mainImage)

  //     const pre = [...prevMainImage];
  //       pre = URL.createObjectURL(file)
  //       setPrevMainImage(pre)
  // }
  // const handleCreateProduct = () => {
  //   console.log("Images to upload:", images);
  // };

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

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // products data

  const [productData, setProductData] = useState<ProductsType>({
    name: "",
    brand: "",
    price: "",
    quantity: "",
    category: "",
    tags: [],
    description: "",
    details: "",
    mainImage: null,
    images: [],
  });

  const handleCreateProduct = async () => {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("price", String(productData.price));
    formData.append("quantity", String(productData.quantity));
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("details", productData.details);

    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    images.forEach((img) => {
      if (img) {
        formData.append(`images`, img);
      }
    });

    try {
      setIsLoading(true);
      const token = localStorage.getItem("vg_token");
      if (!token) return;
      const response = await fetch(`http://localhost:5000/api/create-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form fields except category
        setProductData((prev) => ({
          name: "",
          brand: "",
          price: "",
          quantity: "",
          category: prev.category, // keep category from vepari
          tags: [],
          description: "",
          details: "",
          mainImage: null,
          images: [],
        }));

        // Reset main image preview
        setMainImage(null);
        setPrevMainImage("");

        // Reset multiple images and previews
        setImages(Array(7).fill(null));
        setPreviews(Array(7).fill(""));

        // Reset tags
        setTags([]);
        setInputTag("");

        // dispatch(setVepariProducts(data))


        toast.success(data.message || "New Product Created");
        console.log("data", data);
        console.log("response", response);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("something went wrong pls try again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const input_style =
    "border border-indigo-300 p-3 rounded-md my-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
  return (
    <div className="max-w-5xl mx-auto p-6  rounded-lg  overflow-auto h-full">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">
        Create Product
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
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
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
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
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
        <label htmlFor="details" className="text-sm font-medium text-gray-700">
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
        onClick={handleCreateProduct}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg font-medium transition"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Create Product"}
      </button>
    </div>
  );
};

export default Page;

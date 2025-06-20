"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  // images
  const [images, setImages] = useState<(File | null)[]>(Array(7).fill(null));
  const [previews, setPreviews] = useState<string[]>(Array(7).fill(""));

  // main image
  const [mainImage, setMainImage] = useState<string | null>(null);
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


  const handleCreateProduct = () =>{
    console.log({images,tags,mainImage});
    
  }

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
        />
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="text"
          name="price"
          id="price"
          className={input_style}
          placeholder="Price"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="text"
          name="quantity"
          id="quantity"
          className={input_style}
          placeholder="Quantity"
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
        />
      </div>

      {/* Tags (You can replace this later with tag input logic) */}
      {/* Tags Input */}
      <div className="flex flex-col">
        <label htmlFor="tags" className="text-sm font-medium text-gray-700">
          Tags
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
          <div className="relative border-2 border-dashed border-gray-300 p-2 rounded-md w-[300px] h-[300px] flex flex-col justify-center items-center bg-gray-50 hover:border-indigo-400">
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
                <span className="text-md text-gray-500 text-center">
                  Upload
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
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreateProduct}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg font-medium transition"
      >
        Create Product
      </button>
    </div>
  );
};

export default Page;

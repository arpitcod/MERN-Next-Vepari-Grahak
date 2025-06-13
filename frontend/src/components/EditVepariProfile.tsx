"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { setGetVepari } from "../../redux/GetVepariSlice";
import { useRouter } from "next/navigation";

type FetchVepariType = {
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
};

const EditVepariProfile = ({ setShowBox }) => {
  const router = useRouter();
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari
  );
  const vepari = getVepariData?.vepari;
  const [isLoading, setIsLoading] = useState(false);
  const [getVepariProfileBanner, setGetVepariProfileBanner] = useState([]);

  const dispatch = useDispatch();
  const categoryOptions = [
    "Grocery",
    "Electronics",
    "Clothing",
    "Stationery",
    "Furniture",
    "Hardware",
    "Toys",
    "Sports",
    "Books",
    "Medicines",
    "Mobile & Accessories",
    "Beauty & Personal Care",
    "Home Decor",
    "Footwear",
    "Watches & Accessories",
    "Kitchenware",
    "Cleaning Supplies",
    "Pet Supplies",
    "Automobile",
    "Baby Products",
  ];

  // const [searchCategory, setSearchCategory] = useState("");

  // const filteredCategory = categoryOptions.filter((category) =>
  //   category.toLowerCase().includes(searchCategory.toLowerCase())
  // );
  const [fetchVepariData, setFetchVepariData] = useState<FetchVepariType>({
    banner: null,
    profile: null,
    vepariname: "",
    shopname: "",
    description: "",
    address: {
      country: "india",
      state: "",
      city: "",
    },
    category: "",
    contact: "",
    shopTime: {
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (vepari) {
      setFetchVepariData({
        banner: vepari.banner || null,
        profile: vepari.profile || null,
        vepariname: vepari.vepariname || "",
        shopname: vepari.shopname || "",
        description: vepari.description || "",
        address: {
          country: vepari?.address?.country || "india",
          state: vepari?.address?.state || "",
          city: vepari?.address?.city || "",
        },
        category: vepari.category || "",
        contact: vepari.contact || "",
        shopTime: {
          startTime: vepari.shopTime?.startTime || "",
          endTime: vepari.shopTime?.endTime || "",
        },
      });
    }
  }, [vepari]);

  // console.log("vepari id",vepari._id);

  useEffect(() => {
    const getVepariBannerProfile = async () => {
      try {
        const token = localStorage.getItem("vg_token");
        if (!token || !vepari?._id) {
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/get-vepari-banner-profile/${vepari?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setGetVepariProfileBanner(data);
        // console.log("Fetched banner/profile", data);
      } catch (error) {
        toast.error("internel server error");
        console.log("Error fetching vepari banner/profile", error);
      }
    };

    getVepariBannerProfile();
  }, [vepari]);

  // useEffect(() => {
  //   const fetchVepariData = async () => {
  //     try {
  //       const token = localStorage.getItem("vg_token");
  //       if (!token || !vepari?._id) {
  //         return;
  //       }
  //       const response = await fetch(
  //         `http://localhost:5000/api/get-vepari/${vepari._id}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       const data = await response.json();
  //       if (response.ok) {
  //         toast.success(data.message);
  //         setFetchVepariData(data?.getVepariData);
  //         // console.log("fetch vepari data data data", data?.getVepariData);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchVepariData();
  // }, []);

  const handleEditVepariProfile = async () => {
    const formData = new FormData();
    formData.append("vepariname", fetchVepariData.vepariname);
    formData.append("shopname", fetchVepariData.shopname);
    formData.append("description", fetchVepariData.description);
    formData.append("category", fetchVepariData.category);
    formData.append("contact", fetchVepariData.contact);

    // Add address fields
    formData.append("country", fetchVepariData.address.country);
    formData.append("state", fetchVepariData.address.state);
    formData.append("city", fetchVepariData.address.city);

    // Add shop time fields
    formData.append("startTime", fetchVepariData.shopTime.startTime);
    formData.append("endTime", fetchVepariData.shopTime.endTime);

    if (fetchVepariData.banner instanceof File) {
      formData.append("banner", fetchVepariData.banner);
    }
    if (fetchVepariData.profile instanceof File) {
      formData.append("profile", fetchVepariData.profile);
    }
    // if (fetchVepariData.banner) {
    //     formData.append("banner", fetchVepariData.banner);
    //   }
    //   if (fetchVepariData.profile) {
    //     formData.append("profile", fetchVepariData.profile);
    //   }
    // Basic validation
    if (!fetchVepariData.shopname.trim()) {
      toast.error("Shop name is required");
      return;
    }
    // // Handle image uploads
    // if (fetchVepariData.banner instanceof File) {
    //   formData.append("banner", fetchVepariData.banner);
    // }
    // if (fetchVepariData.profile instanceof File) {
    //   formData.append("profile", fetchVepariData.profile);
    // }

    // // Add basic fields
    // formData.append("vepariname", fetchVepariData.vepariname);
    // formData.append("shopname", fetchVepariData.shopname);
    // formData.append("description", fetchVepariData.description);
    // formData.append("category", fetchVepariData.category);
    // formData.append("contact", fetchVepariData.contact);

    // Add address as a nested JSON object
    // formData.append(
    //   "address",
    //   JSON.stringify({
    //     country: fetchVepariData.address.country,
    //     state: fetchVepariData.address.state,
    //     city: fetchVepariData.address.city,
    //   })
    // );

    // // Add shopTime as a nested JSON object
    // formData.append(
    //   "shopTime",
    //   JSON.stringify({
    //     startTime: fetchVepariData.shopTime.startTime,
    //     endTime: fetchVepariData.shopTime.endTime,
    //   })
    // );
    setIsLoading(true);
    try {
      const token = localStorage.getItem("vg_token");
      if (!token || !vepari?._id) {
        toast.error("Authentication required");
        return;
      }

      // Validate required fields
      if (!fetchVepariData.vepariname || !fetchVepariData.shopname) {
        toast.error("Vepari name and shop name are required");
        return;
      }
      // console.log(fetchVepariData);

      // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `http://localhost:5000/api/shop-profile-update/${vepari._id}`,
        {
          method: "PUT",
          headers: {
            // "Content-Type": "application/json", // ✅ Needed for JSON body
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify(fetchVepariData),
          body: formData,

          // body:JSON.stringify(formData),
        }
      );

      const data = await response.json();
      setIsLoading(true);
      if (response.ok) {
        dispatch(setGetVepari({ vepari: data.updatedShop }));
        toast.success(data.message || "Profile updated successfully");
        setShowBox(false);
        console.log("formdata", formData);
        router.push("/admin-vepari/profile");
        console.log("updatedShop", data.updatedShop);
        console.log("updatedShop data", data);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   handleEditVepariProfile()
  // },[])
  // console.log("fetchVepariData", fetchVepariData);

  // style ..........................

  const border_color = "border border-indigo-600";

  return (
    <div className="">
      <div className="flex  flex-col gap-3 h-[500px] sm:h-full overflow-auto sm:p-2">
        <div className="flex flex-col">
          <label className="">Banner</label>
          <input
            type="file"
            name="banner"
            accept="image/*"
            id="banner"
            className="border p-3 rounded-md"
            onChange={(e) => {
              console.log("changing banner to", e.target.value);
              setFetchVepariData((prev) => ({
                ...prev,
                banner: e.target.files?.[0] || null,
              }));
            }}
          />
        </div>
        {/* preview banner  */}
        {fetchVepariData?.banner && (
          <div
            className={`flex justify-center items-center border rounded-md py-2 ${border_color}`}
          >
            {typeof fetchVepariData.banner === "string" ? (
              <img
                src={getVepariProfileBanner?.bannerUrl}
                alt={"banner"}
                className="w-[600px] h-[150px] "
              />
            ) : fetchVepariData.banner instanceof File ? (
              <img
                src={URL.createObjectURL(fetchVepariData?.banner)}
                alt="banner preview"
                className="w-[500px] h-[200px] border"
              />
            ) : null}
          </div>
        )}

        <div className="flex flex-col">
          <label>Profile</label>
          <input
            type="file"
            name="profile"
            id="profile"
            accept="image/*"
            className="border p-3 rounded-md"
            onChange={(e) => {
              console.log("changing banner to", e.target.value);
              setFetchVepariData((prev) => ({
                ...prev,
                profile: e.target.files?.[0] || null,
              }));
            }}
          />
        </div>
        {fetchVepariData?.profile && (
          <div
            className={`flex justify-center items-center border rounded-md py-2 ${border_color}`}
          >
            {typeof fetchVepariData.profile === "string" ? (
              <img
                src={getVepariProfileBanner?.profileUrl}
                alt="profile preview"
                className="w-[100px] h-[100px] rounded-[50%]"
              />
            ) : fetchVepariData.profile instanceof File ? (
              <img
                src={URL.createObjectURL(fetchVepariData.profile)}
                alt="profile preview"
                className="w-[100px] h-[100px] rounded-circle"
              />
            ) : null}
          </div>
        )}

        <div className="flex flex-col">
          <label>Vepari Name</label>
          <input
            type="text"
            name="vepariname"
            id="vepariname"
            placeholder="Enter vepari name"
            className={` p-3 rounded-md ${border_color}`}
            onChange={(e) =>
              setFetchVepariData((prev) => ({
                ...prev,
                vepariname: e.target.value,
              }))
            }
            // onChange={(e) => {
            //   console.log("changing vepari to", e.target.value);
            //   setFetchVepariData({
            //     ...fetchVepariData,
            //     vepariname: e.target.value,
            //   });
            // }}
            value={fetchVepariData.vepariname}
          />
        </div>
        <div className="flex flex-col">
          <label>Shop Name</label>
          <input
            type="text"
            name="shopname"
            id="shopname"
            placeholder="Enter Shopname"
            className={`${border_color} p-3 rounded-md`}
            // onChange={(e) => {
            //   console.log("changing shopname to", e.target.value);
            //   setFetchVepariData({
            //     ...fetchVepariData,
            //     shopname: e.target.value,
            //   });
            // }}
            onChange={(e) =>
              setFetchVepariData((prev) => ({
                ...prev,
                shopname: e.target.value,
              }))
            }
            value={fetchVepariData.shopname}
          />
        </div>

        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="write description..."
            cols={70}
            rows={10}
            className={`${border_color} rounded-md resize-none p-2 `}
            // onChange={(e) => {
            //   console.log("changing description to", e.target.value);
            //   setFetchVepariData({
            //     ...fetchVepariData,
            //     description: e.target.value,
            //   });
            // }}
            onChange={(e) =>
              setFetchVepariData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={fetchVepariData.description}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col ">
            <label>Country</label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder="Enter Country"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) => {
                console.log("changing shopname to", e.target.value);
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value },
                }));
              }}
              value={fetchVepariData.address.country}
            />
          </div>
          <div className="flex flex-col ">
            <label>State</label>
            <input
              type="text"
              name="state"
              id="state"
              placeholder="Enter State"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) => {
                console.log("changing state to", e.target.value);
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value },
                }));
              }}
              value={fetchVepariData.address.state}
            />
          </div>
          <div className="flex flex-col ">
            <label>City</label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="Enter City"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) => {
                console.log("changing shopname to", e.target.value);
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value },
                }));
              }}
              value={fetchVepariData.address.city}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label>Category</label>
          {/* <input
            type="text"
            name="search"
            id="search"
            className={"border"}
            placeholder="search category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          /> */}
          <select
            name="category"
            id="category"
            className={`${border_color} p-3 rounded-md`}
            onChange={(e) =>
              setFetchVepariData((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            value={fetchVepariData.category}
          >
            {/* placeholder option */}
            <option value="" className="">
              Select category
            </option>

            {
              categoryOptions.map((category) =>(
                <option value={category} key={category} className="capitalize">
                  {category}
                </option>
              ))
            }
            {/* {filteredCategory.length > 0 ? (
              filteredCategory.map((category) => (
                <option value={category} key={category} className="capitalize">
                  {category}
                </option>
              ))
            ) : (
              <option disabled>No match found</option>
            )} */}
          </select>
          {/* <input
            type="text"
            name="category"
            id="category"
            placeholder="Enter Category"
            className={`${border_color} p-3 rounded-md`}
            // onChange={(e) => {
            //   console.log("changing shopname to", e.target.value);
            //   setFetchVepariData({
            //     ...fetchVepariData,
            //     category: e.target.value,
            //   });
            // }}
          /> */}
        </div>
        <div className="flex flex-col">
          <label>Contact</label>
          <input
            type="number"
            name="contact"
            id="contact"
            placeholder="Enter Contact"
            className={`${border_color} p-3 rounded-md`}
            // onChange={(e) => {
            //   console.log("changing shopname to", e.target.value);
            //   setFetchVepariData({
            //     ...fetchVepariData,
            //     contact: e.target.value,
            //   });
            // }}
            onChange={(e) =>
              setFetchVepariData((prev) => ({
                ...prev,
                contact: e.target.value,
              }))
            }
            value={fetchVepariData.contact}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              placeholder="Enter Shop Time"
              className={`${border_color} p-3 rounded-md`}
              onChange={(e) => {
                console.log("changing shopname to", e.target.value);
                setFetchVepariData((prev) => ({
                  ...prev,
                  shopTime: { ...prev.shopTime, startTime: e.target.value },
                }));
              }}
              value={fetchVepariData.shopTime.startTime}
            />
          </div>
          <div className="flex flex-col">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              placeholder="Enter Shop Time"
              className={`${border_color} p-3 rounded-md`}
              onChange={(e) => {
                console.log("changing shopname to", e.target.value);
                setFetchVepariData((prev) => ({
                  ...prev,
                  shopTime: { ...prev.shopTime, endTime: e.target.value },
                }));
              }}
              value={fetchVepariData.shopTime.endTime}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <button
            className={`border p-3 rounded-md text-white cursor-pointer transition-all duration-200 ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            onClick={handleEditVepariProfile}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVepariProfile;

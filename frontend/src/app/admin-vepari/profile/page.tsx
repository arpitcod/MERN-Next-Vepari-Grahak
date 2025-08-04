  "use client";
  import React, { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import { RootState } from "../../../../redux/store";
  import { toast } from "react-toastify";
  import { IoMdClose } from "react-icons/io";
  import EditVepariProfile from "@/components/EditVepariProfile";

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
};


type VepariBannerProfileType = {
  bannerUrl: string;
  profileUrl: string;
};
  const Profile = () => {
    // const getVepariData = useSelector(
    //   (state: RootState) => state?.getVepari?.getVepari
    // );
    const vepari = useSelector(
      (state: RootState) => state?.getVepari?.getVepari as VepariType | null
    ); ;

    const [showBox, setShowBox] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // get vepari profile banner state
    const [getVepariProfileBanner, setGetVepariProfileBanner] = useState<VepariBannerProfileType | null>(null);

    const [fetchVepariData, setFetchVepariData] = useState<VepariType>({
      banner: null,
      profile: null,
      vepariname: "",
      shopname: "",
      description: "",
      address: {
        country: "",
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

    // Redux data change thay etle state update karo
    useEffect(() => {
      if (vepari) {
        setFetchVepariData({
          banner: vepari.banner || null,
          profile: vepari.profile || null,
          vepariname: vepari.vepariname || "",
          shopname: vepari.shopname || "",
          description: vepari.description || "",
          address: {
            country: vepari?.address?.country || "",
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

    // const handleEditShop = () => {
    //   console.log(fetchVepariData);
    // };

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
          // toast.success(data.message)
          console.log("Fetched banner/profile", data);
        } catch (error) {
          toast.error("internel server error");
          console.log("Error fetching vepari banner/profile", error);
        }
      };

      getVepariBannerProfile();
    }, [vepari]);

    const handleEditShop = () => {
      // everytime box khule, latest user data mukho
      // if (!showBox) {
      //   // setPrevUser({
      //   //   username: user?.user?.username,
      //   //   phone: user?.user?.phone,
      //   // });
      // }
      setShowBox(!showBox);
    };
    // colors

    // const border_color = "border border-indigo-600"
    const border_color = "border border-indigo-600";

    return (
      <div className="flex flex-col gap-3 h-full overflow-auto p-2">
        <p className="text-3xl text-center font-medium text-indigo-600">
          Vepari Profile
        </p>

        <div className="flex flex-col">
          <label>Banner <strong className="">(use a picture that’s at least 1920 x 198 pixels and 4MB or less)</strong></label>
          {/* <input
            type="file"
            name="banner"
            accept="image/*"
            id="banner"
            disabled
            className="border p-3 rounded-md"
            onChange={(e) => setFetchVepariData({ ...fetchVepariData, banner: e.target.files?.[0] || null })}
          /> */}
        </div>
        {/* preview banner  */}
        {fetchVepariData?.banner && (
          <div
            className={`flex justify-center items-center border  ${border_color}`}
          >
            {typeof fetchVepariData.banner === "string" ? (
              // <img src={`http://localhost:5000/api/get-vepari-banner-profile/${vepari?._id}`} alt={vepari._id} className="w-[50%]" />

              <img
                src={getVepariProfileBanner?.bannerUrl}
                alt={getVepariProfileBanner?.bannerUrl}
                className="w-[1920px] h-[198px] "
              />
            ) : fetchVepariData.banner instanceof File ? (
              <img
                src={URL.createObjectURL(fetchVepariData.banner)}
                alt="banner preview"
                className="w-[1920px] h-[198px]"
              />
            ) : null}
          </div>
        )}
        {/* {
    fetchVepariData.banner &&(
      <div className="flex justify-center items-center">
        {
          fetchVepariData?.banner && (
            <img src={URL.createObjectURL(fetchVepariData.banner as File)} alt="banner preview" className="w-[50%]" />
          )
        }
      </div>
    )

  } */}

        <div className="flex flex-col">
          <label>Profile <strong className="">(use a picture that’s at least 100 x 100 pixels and 4MB or less)</strong></label>
          {/* <input
            type="file"
            name="profile"
            id="profile"
            accept="image/*"
            className="border p-3 rounded-md"
            onChange={(e) =>
              setFetchVepariData({ ...fetchVepariData, profile: e.target.files?.[0] || null })
            }
          /> */}
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
            disabled
            onChange={(e) =>
              setFetchVepariData({
                ...fetchVepariData,
                vepariname: e.target.value,
              })
            }
            value={fetchVepariData.vepariname}
          />
        </div>
        <div className="flex flex-col">
          <label>Shop Name</label>
          <input
            type="text"
            disabled
            name="shopname"
            id="shopname"
            placeholder="Enter Shopname"
            className={`${border_color} p-3 rounded-md`}
            onChange={(e) =>
              setFetchVepariData({ ...fetchVepariData, shopname: e.target.value })
            }
            value={fetchVepariData.shopname}
          />
        </div>

        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            name="description"
            disabled
            id="description"
            placeholder="write description..."
            cols={70}
            rows={10}
            className={`${border_color} rounded-md resize-none p-2 `}
            onChange={(e) =>
              setFetchVepariData({
                ...fetchVepariData,
                description: e.target.value,
              })
            }
            value={fetchVepariData.description}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col ">
            <label>Country</label>
            <input
              type="text"
              disabled
              name="country"
              id="country"
              placeholder="Enter Country"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) =>
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value },
                }))
              }
              value={fetchVepariData.address.country}
            />
          </div>
          <div className="flex flex-col ">
            <label>State</label>
            <input
              type="text"
              disabled
              name="state"
              id="state"
              placeholder="Enter State"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) =>
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value },
                }))
              }
              value={fetchVepariData.address.state}
            />
          </div>
          <div className="flex flex-col ">
            <label>City</label>
            <input
              type="text"
              disabled
              name="city"
              id="city"
              placeholder="Enter City"
              className={`${border_color} w-full p-3 rounded-md`}
              onChange={(e) =>
                setFetchVepariData((prev) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value },
                }))
              }
              value={fetchVepariData.address.city}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label>Category</label>
          <input
            type="text"
            name="category"
            disabled
            id="category"
            placeholder="Enter Category"
            className={`${border_color} p-3 rounded-md`}
            onChange={(e) =>
              setFetchVepariData({ ...fetchVepariData, category: e.target.value })
            }
            value={fetchVepariData.category}
          />
        </div>
        <div className="flex flex-col">
          <label>Contact</label>
          <input
            type="number"
            name="contact"
            disabled
            id="contact"
            placeholder="Enter Contact"
            className={`${border_color} p-3 rounded-md`}
            onChange={(e) =>
              setFetchVepariData({ ...fetchVepariData, contact: e.target.value })
            }
            value={fetchVepariData.contact}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* <label>Shop Time</label> */}

          <div className="flex flex-col">
            <label>Start Time</label>
            <input
              type="time"
              disabled
              name="startTime"
              id="startTime"
              placeholder="Enter Shop Time"
              className={`${border_color} p-3 rounded-md`}
              onChange={(e) =>
                setFetchVepariData((prev) => ({
                  ...prev,
                  shopTime: { ...prev.shopTime, startTime: e.target.value },
                }))
              }
              value={fetchVepariData.shopTime.startTime}
            />
          </div>
          <div className="flex flex-col">
            <label>End Time</label>
            <input
              type="time"
              disabled
              name="endTime"
              id="endTime"
              placeholder="Enter Shop Time"
              className={`${border_color} p-3 rounded-md`}
              onChange={(e) =>
                setFetchVepariData((prev) => ({
                  ...prev,
                  shopTime: { ...prev.shopTime, endTime: e.target.value },
                }))
              }
              value={fetchVepariData.shopTime.endTime}
            />
          </div>
        </div>

        {showBox && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50 ">
            <div className="bg-white p-5  rounded-md shadow-lg w-96 relative sm:h-[600px] sm:w-[900px] overflow-auto">
              <button
                onClick={() => setShowBox(false)}
                className="absolute top-2 right-2 text-xl cursor-pointer"
              >
                <IoMdClose className="text-3xl" />
              </button>
              <h2 className="text-2xl text-center font-semibold mb-4 text-indigo-600">
                Edit Profile
              </h2>

                  <div className="">
                      <EditVepariProfile 
                        setShowBox={setShowBox}
                      />

                  </div>

            </div>
          </div>
        )}
        <div className="flex flex-col">
          <button
            className="border p-3 rounded-md bg-indigo-500 text-indigo-50 hover:bg-indigo-600 cursor-pointer"
            onClick={handleEditShop}
          >
            Edit Shop
          </button>
        </div>
      </div>
    );
  };

  export default Profile;

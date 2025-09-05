"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { setAllData } from "../../../../redux/super-admin/AllDataSlice";
import { setActiveSection } from "../../../../redux/super-admin/SuperAdminSearchSlice";

const Vepari = () => {
  const router = useRouter();
  const getVepariData = useSelector(
    (state: RootState) => state?.allData?.allData?.vepariData
  );

  const searchQuery = useSelector((state: RootState) => state.superAdminSearch.query);
  
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleVepariDetails = (_id: string) => {
    router.push(`/vepari-details?id=${_id}`);
  };

  const handleDeleteVepari = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vepari profile?"
    );
    if (!confirmDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/super-admin-auth/delete-vepari-profile/${id}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedVepari = getVepariData.filter(
          (vepari) => vepari._id !== id
        );
        dispatch(setAllData({ vepariData: updatedVepari }));
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  dispatch(setActiveSection('vepari'));
}, []);

// Vepari filtering
const filteredVepari = getVepariData?.filter(vepari => 
  vepari.shopname.toLowerCase().includes(searchQuery.toLowerCase()) ||
  vepari.vepariname.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
    <div className="p-6 bg-gray-50 h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Vepari Shops
      </h1>

      {filteredVepari?.length === 0 && searchQuery ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg font-medium">Vepari Not Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVepari?.map((vepari, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl relative shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() => vepari?._id && handleVepariDetails(vepari?._id)}
            >
              <img
                src={vepari.profile}
                alt={vepari.shopname}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h1 className="text-xl font-semibold text-gray-800">
                {vepari.shopname}
              </h1>
              <button
                className="flex items-center justify-center gap-0.5 absolute top-2 right-2 h-10 w-10 border bg-red-500 text-indigo-50 hover:bg-red-600 transition-all rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevent opening details page
                  vepari._id && handleDeleteVepari(vepari._id);
                }}
              >
                <MdDelete className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vepari;

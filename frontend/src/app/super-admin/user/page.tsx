"use client";
import React, { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { setAllData } from "../../../../redux/super-admin/AllDataSlice";
import { setActiveSection } from "../../../../redux/super-admin/SuperAdminSearchSlice";

const User = () => {
  const getAllData = useSelector(
    (state: RootState) => state?.allData?.allData?.userData
  );
  const dispatch = useDispatch();
  console.log(getAllData);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null); // modal state

  const searchQuery = useSelector((state: RootState) => state.superAdminSearch.query);

  // handle delete user
  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/super-admin-auth/delete-user/${id}`,
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
        const updatedUsers = getAllData.filter((user) => user._id !== id);
        dispatch(setAllData({ userData: updatedUsers }));
        toast.success(data.message);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setActiveSection('users'));
  }, []);

  // Users filtering
  const filteredUsers = getAllData?.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {
        filteredUsers?.length === 0 && searchQuery ? (
          <div className="col-span-full text-center py-10">
            <h2 className="text-2xl text-gray-500">No Users found</h2>
          </div>
        ) : (
          filteredUsers?.map((user, index) => {
            // Check if user is a vepari (has vepari profile)
            const isVepari = user.vepari_shop !== undefined && user.vepari_shop !== null;
            
            return (
              <div
                key={index}
                className={`border rounded-2xl shadow-md p-4 flex justify-between items-center space-y-2 transition duration-300 ${
                  isVepari 
                    ? "border-amber-800 bg-amber-100 hover:shadow-amber-200" 
                    : "border-gray-400 bg-white hover:shadow-xl"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-gray-800 text-lg flex gap-3">
                    <strong className={`font-semibold ${isVepari ? "text-amber-700" : "text-indigo-600"}`}>
                      Username:
                    </strong>
                    <p>{user.username}</p>
                   
                  </div>
                  <div className="text-gray-600 flex gap-3">
                    <strong className={`font-semibold ${isVepari ? "text-amber-700" : "text-indigo-600"}`}>
                      Phone:
                    </strong>
                    <p>{user.phone}</p>
                  </div>
                </div>
                <div>
                  <button
                    className={`flex items-center justify-center gap-0.5 h-10 w-10 border text-indigo-50 rounded-full cursor-pointer transition-all ${
                      isVepari 
                        ? "bg-amber-500 hover:bg-amber-600" 
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => user._id && handleDeleteUser(user?._id)}
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </div>
              </div>
            );
          })
        )
      }
    </div>
  );
};

export default User;
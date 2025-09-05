"use client"
import { fetchAllData } from "@/getData/super-admin/useGetAllData";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllData } from "../../../../redux/super-admin/AllDataSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleData = async () => {
    const data = await fetchAllData();
    if (data) {
      dispatch(setAllData(data));
      console.log("from dashboard ",data);
      
    } else {
      dispatch(setAllData({ allData: null }));
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const getAllData = useSelector((state:RootState) =>state?.allData.allData)
  console.log("from redux data",getAllData);
  

  return (
    <div className="border border-red-500 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center place-items-center">
      <div className="border w-[100%] max-w-[400px] h-[150px] flex justify-center items-center flex-col rounded-lg bg-indigo-600 text-white shadow-md">
        <p className="text-ld font-semibold">Total Users</p>
        <p className="text-6xl font-bold ">{getAllData?.userData?.length}</p>
      </div>
      <div className="border w-[100%] max-w-[400px] h-[150px] flex justify-center items-center flex-col rounded-lg bg-indigo-600 text-white shadow-md">
        <p className="text-ld font-semibold">Total Vepari</p>
        <p className="text-6xl font-bold ">{getAllData?.vepariData?.length}</p>
      </div>
      
    </div>
  );
};

export default Dashboard;

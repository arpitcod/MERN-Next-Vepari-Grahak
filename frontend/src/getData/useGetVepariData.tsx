"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGetVepari } from "../../redux/GetVepariSlice";
import { RootState } from "../../redux/store";

const useGetVepariData = () => {
  const disPatch = useDispatch();
  const getVepariData = useSelector(
    (state: RootState) => state?.getVepari?.getVepari
  );
  console.log("from use get vepari data ", getVepariData);

  useEffect(() => {
    const token = localStorage.getItem("vg_token")
    const getVepariData = async () => {
      try {
        await fetch(`http://localhost:2929/api/get-vepari-profile`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: token as string,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            disPatch(setGetVepari(data));
            // console.log("from get vepari hook",data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getVepariData();
  }, [disPatch]);
};

export default useGetVepariData;

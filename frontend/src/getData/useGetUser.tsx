"use client"

import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setUserData } from "../../redux/UserSlice"

const useGetUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("vg_token");
        if (!token) {
          dispatch(setUserData(null));
          return;
        }

        const response = await fetch(`http://localhost:5000/api/get_user`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        if (data.success) {
          dispatch(setUserData(data.user));
        } else {
          dispatch(setUserData(null));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        dispatch(setUserData(null));
        // Optionally remove token if it's invalid
        localStorage.removeItem("vg_token");
      }
    };

    getUser();
  }, [dispatch]);
};

export default useGetUser;
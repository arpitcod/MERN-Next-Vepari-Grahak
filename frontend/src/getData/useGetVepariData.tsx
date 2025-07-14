// "use client";

// import { useEffect } from "react";
// import { useDispatch} from "react-redux";
// import { setGetVepari } from "../../redux/GetVepariSlice";

// const useGetVepariData = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
 

//     getVepariData();
//   }, [dispatch]);
// };

// export default useGetVepariData;

   export const fetchVepariData = async () => {
      try {
        const token = localStorage.getItem("vg_token");
        if (!token) {
          // Clear vepari data if no token exists
          // dispatch(setGetVepari({ vepari: null }));
          return null;
        }

        const response = await fetch(`http://localhost:5000/api/get-vepari-profile`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch vepari data');
        }

        if (data.success) {
          // dispatch(setGetVepari(data));
          return data.vepari
          console.log("from useget vepari",data);
          
        } else {
          // dispatch(setGetVepari({ vepari: null }));
          return null
        }
      } catch (error) {
        console.error('Error fetching vepari data:', error);
        // dispatch(setGetVepari({ vepari: null }));
        return null
      }
    };

    
// "use client";
// import { useEffect } from "react";

// import { RootState } from "../../redux/store";
// import { useSelector } from "react-redux";

//   const GetVepariProducts = () => {
//   useEffect(() => {
// //   const getVepariData = useSelector(
// //       (state: RootState) => state?.getVepari?.getVepari
// //     );
//     // const vepari = getVepariData?.vepari;
//      const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem("vg_token");
//         if (!token) return;
//         const response = await fetch(`${process.env.NEXT_PUBLIC_SINGLE_VEPARI_PRODUTCS}`,
//           {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json()
//        return data;
       
        
//       } catch (error) {

//         console.log(error);
//         return null
//       }
//     };

//     fetchProducts()
//   }, []);
  
// };


// export default GetVepariProducts


// "use client"

// import { useDispatch } from "react-redux"
// // import { setUserData } from "../../redux/UserSlice"
// import { useEffect } from "react"
// import { setGetUser } from "../../redux/GetUserSlice"


// const UserGetData = () => {
//     const disPatch = useDispatch()
//     // const [user,setUser] = useState({})
// useEffect(() =>{
// const token = localStorage.getItem("vg_token")
//   const getUser = async () =>{
//     try {
//       await fetch("http://localhost:2929/api/get_user", {
//         method: "GET",
//         headers: {
//           "content-type": "application/json",
//           "Authorization":token as string,
//         },
//       })
//         .then((response) => response.json())
//         .then((responseData) => {
//           if (responseData.success) {
//             disPatch(setGetUser(responseData?.userId));
//             console.log(responseData);
            
//           }
//         });

       
      
//     } catch (error) {
//       console.log(error);
      
//     }
//   }
//   getUser()
// },[disPatch])

// // UserGetData()
// }


// export default UserGetData
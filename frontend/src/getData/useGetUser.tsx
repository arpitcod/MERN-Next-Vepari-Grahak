"use client"

import { useDispatch } from "react-redux"
// import { setUserData } from "../../redux/UserSlice"
import { useEffect } from "react"
// import { setGetUser } from "../../redux/GetUserSlice"
import { setUserData } from "../../redux/UserSlice"

const useGetUser = () =>{
  // const [user,setUser] = useState({})
  const disPatch = useDispatch()
  useEffect(() =>{
const token = localStorage.getItem("vg_token")
  const getUser = async () =>{
    try {
      await fetch("http://localhost:2929/api/get_user", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Authorization":token as string,
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success) {
            disPatch(setUserData(responseData));
            console.log(responseData);
            
          }
        });

       
      
    } catch (error) {
      console.log(error);
      
    }
  }
  getUser()
},[disPatch])

}


export default useGetUser
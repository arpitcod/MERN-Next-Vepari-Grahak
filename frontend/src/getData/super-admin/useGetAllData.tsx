

export const fetchAllData = async () =>{
    try {
        const response = await fetch("http://localhost:5000/api/super-admin-auth/get-all-users",{
            method:"GET",
            headers:{
                "content-type": "application/json",
            },
            credentials:"include"
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "failed to fetch data")

        }
        if (data.success) {
            return data?.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        return null
        
    }
}
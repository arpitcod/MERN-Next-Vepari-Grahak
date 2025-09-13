import { toast } from "react-toastify";

export const fetchAllVepariProducts = async () => {
  // Wait for client-side hydration
  // if (typeof window === 'undefined') return [];

  try {
      // if (typeof window === 'undefined') return [];
    const token = localStorage.getItem("vg_token");
   if (!token) {
     toast.error("Not authorized");
     return [];
   }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_ALL_VEPARI_PRODUCTS}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
        
    }
    if (data.success) {
    return data?.success ? data.products || [] : [];
        // console.log(data);
        
    }else{
        return null
    }
  } catch (error: any) {
    console.error("Error fetching products:", error);
    toast.error(error?.message || "Error fetching products");
    return [];
  }
};

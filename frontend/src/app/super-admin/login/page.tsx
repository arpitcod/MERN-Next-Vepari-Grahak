'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IoIosEyeOff, IoMdEye } from 'react-icons/io';
import { toast } from 'react-toastify';

const SuperAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // loading 
  const [isLoading,setIsLoading] = useState(false)

  //router

  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitData = async () =>{
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPER_ADMIN_LOGIN}`,{
        method:"POST",
        headers:{
            "content-type": "application/json",
        },
        body:JSON.stringify(formData),
        credentials: 'include'
      })

      const data = await response.json();
      if (response.ok) {
        router.push("/super-admin")
        toast.success(data.message)
        console.log(data);
      } else {
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong")
      
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Super Admin Login</h2>

        
          <div>
            <label className="block text-indigo-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-indigo-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-indigo-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 px-3 text-indigo-600 focus:outline-none"
              >
                {showPassword ? <IoIosEyeOff size={25} /> : <IoMdEye size={25}/>}
              </button>
            </div>
          </div>

          <button
            className={`w-full ${isLoading ? "bg-indigo-200 text-indigo-800" : "bg-indigo-600 hover:bg-indigo-700 text-white"}   font-semibold py-2 px-4 rounded my-4`}
            disabled={isLoading}
            onClick={handleSubmitData}

          >
            { isLoading ? "Wait..." : "Login"}
          </button>
        {/* </form> */}
      </div>
    </div>
  );
};

export default SuperAdminLogin;

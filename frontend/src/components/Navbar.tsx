"use client";
import React, { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

const Navbar = () => {
    const [showAccount,setShowAccount] = useState(false);

    const handleShowAccount = () =>{
        setShowAccount(!showAccount)
    }
  return (
    <div className="border mx-2 flex justify-between items-center py-1">
      {/* logo  */}
      <div className="border">
        <p className="text-2xl ">Vepari Grahak</p>
      </div>
      {/* search  */}
      <div className="border rounded-sm flex items-center">
         <FaSearch className="mx-2 text-lg"/>

        <input
          type="text"
          name="search"
          id=""
          placeholder="search..."
          className=" w-[500px] py-2 rounded-md focus:outline-none"
        />
      </div>
      {/* account  */}
      <div className="relative">
            <button type="button" className="py-2 px-5 bg-gray-800 text-white rounded-md flex items-center gap-1 text-lg" onClick={handleShowAccount}> <MdAccountCircle /> My Account</button>
            {
                showAccount === true  && (

                    <div className="border w-full absolute top-15 bg-white rounded-sm ">
                            <p>account</p>
                    </div>
                )
            }
      </div>
      {/* my cart */}
      <div className="border">
        <button type="button" className="py-2 px-5 bg-gray-800 text-white rounded-md flex items-center gap-2 text-lg"><FaShoppingCart />
         My Cart</button>
      </div>
    </div>
  );
};

export default Navbar;

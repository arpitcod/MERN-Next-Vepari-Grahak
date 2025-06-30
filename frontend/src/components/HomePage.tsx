import React from 'react'

const HomePage = () => {
  return (
    <div>
         <div className=" p-3 grid  justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-wrap ">
          {/* {getProducts?.products?.map((product: any) => ( */}
            <div
              className="flex flex-col gap-2  w-[250px] h-[350px] p-2 shadow-md border border-gray-400 rounded-lg bg-white cursor-pointer"
            //   key={product._id}
            //   onClick={handleShowEditProductBox}
            >
              <img
                src={"http://localhost:5000/uploads/products/mainImage-1750853868141.jpg"}
                alt={"sample"}
                className=" w-[250px] h-[150px] rounded-md"
              />
              <p className=" text-gray-500 text-sm capitalize">
                {"demo"}
              </p>
              <p className="text-gray-800 font-medium capitalize">
                {"demo"}
              </p>
              <p className=" text-gray-500 text-sm">{"demo"}</p>
              <p className=" text-gray-900 text-lg font-medium">
                Rs.{"12312"}
              </p>
              <div className="grid grid-cols-2 gap-2 justify-between">
                <button className="border py-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-all rounded-md">
                  Add(0)
                </button>
                <button className="border py-2 bg-indigo-500 text-indigo-50 hover:bg-indigo-600 transition-all rounded-md">
                  Like
                </button>
              </div>
            </div>
          {/* ))} */}
        </div>
    </div>
  )
}

export default HomePage
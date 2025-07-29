import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/CartSlice";
import { MdDelete } from "react-icons/md";

const MyCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state?.cart?.cartItems);

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Cart</h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          My Cart ({getTotalItems()} items)
        </h1>
        <div className="text-xl font-semibold text-indigo-600">
          ₹{getTotalPrice()}
        </div>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-lg p-3 shadow-sm flex gap-4"
          >
            <div className="flex justify-center items-center ">
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md "
                />

            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-md">{item.name.length > 60
                    ? item.name.substring(0, 60) + "..."
                    : item.name}</h3>
                <p className="text-gray-500 text-sm">{item.brand}</p>
                <p className="text-indigo-600 font-semibold text-lg">
                  ₹{item.price}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center bg-indigo-500 rounded-md text-white overflow-hidden">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item._id))}
                    className="w-8 h-8 hover:bg-indigo-600 transition flex justify-center items-center cursor-pointer"
                  >
                    <FaMinus size={12} />
                  </button>

                  <span className="px-3 font-semibold text-lg">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(increaseQuantity(item._id))}
                    className="w-8 h-8 hover:bg-indigo-600 transition flex justify-center items-center cursor-pointer"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  <MdDelete className="bg-red-500 text-indigo-50 w-8 h-8 rounded-full p-1 hover:bg-red-600 transition-all" />

                </button>
              </div>
            </div>

            {/* <div className="text-right font-semibold text-indigo-600">
              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
            </div> */}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-indigo-600">
            ₹{getTotalPrice()}
          </span>
        </div>

        <button className="w-full bg-indigo-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-600 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default MyCart;

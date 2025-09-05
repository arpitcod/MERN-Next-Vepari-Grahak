"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setActiveSection } from "../../../../redux/super-admin/SuperAdminSearchSlice";

const Faqs = () => {

  const dispatch = useDispatch()
  const getAllData = useSelector(
    (state: RootState) => state?.allData?.allData?.faqsData
  );

  const searchQuery = useSelector((state: RootState) => state.superAdminSearch.query);
  
  console.log("from faqs page", getAllData);

  useEffect(() => {
  dispatch(setActiveSection('faq'));
}, []);

// FAQ filtering
const filteredFAQs = getAllData?.filter(faq => 
  faq?.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
  faq.faq.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="h-full bg-gradient-to-b from-gray-100 to-gray-200 py-6 px-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFAQs?.length === 0 && searchQuery ? (
          <div className="col-span-full text-center py-10">
            <h2 className="text-2xl text-gray-500">No FAQs found</h2>
          </div>
        ) : (
        filteredFAQs?.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              <span className="text-indigo-600">Username: </span>
              {faq.user.username}
            </h2>
            
            <p className="text-gray-600">
              <span className="text-indigo-600 font-semibold">Faq: </span>
              {faq.faq}
            </p>
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default Faqs;

"use client"
import useGetVepariData from '@/getData/useGetVepariData'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
// import { HiUser } from 'react-icons/hi'
// import { IoMdClose } from 'react-icons/io'
// import { MdEdit } from 'react-icons/md'

const Profile = () => {
  useGetVepariData()

  const getVepariData = useSelector((state:RootState) => state?.getVepari?.getVepari);
  console.log("from get vepari data",getVepariData);
  console.log("from get vepari data",getVepariData?.getVepariData);
  
  return (
     <div>
              <h1>hare krishna </h1>
      </div>
  )
}

export default Profile
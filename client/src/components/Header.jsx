import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react';
import { AppContent } from '../context/AppContext';
const Header = () => {

  const {userData} =useContext(AppContent)
  console.log(userData);
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-gray-800'>
      <img src={assets.header_img} alt="" className='w-40 h-40 rounded-full mb-6' />
      <h1 className='flex gap-3 items-center text-xl md:text-4xl sm:text-3xl mb-3' >Hey { userData ? userData.name : `Developer`} <img src={assets.hand_wave} alt="" className='w-8 aspect-square'/></h1>

      <h2 className='items-center text-3xl sm:text-4xl font-semibold m-3'>welcome to our App
      </h2>
      <p className='mb-8 max-w-md text-center'>Explore our wide range of expertly designed courses to upgrade your skills and accelerate your career.</p>
    <button className='text-gray-800 px-4 py-2 border rounded-full hover:bg-gray-100'>Get Started Today</button>
    </div>
  )
}

export default Header

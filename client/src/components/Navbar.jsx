import React from 'react'
import{assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar=()=> {

  const navigate= useNavigate();
  const {userData,setIsLoggedIn,apiUrl,setUserData}= useContext(AppContent);

  const handleLogout= async()=>{
    axios.defaults.withCredentials=true;
    try{
      const {data} = await axios.post(`${apiUrl}/api/auth/logout`);
      
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false);
        navigate('/')
      
    }catch(error){
      toast.error(error.message)
    }
  }


   const sendVerificationEmail = async()=>{
    try{
      const {data} = await axios.post(`${apiUrl}/api/auth/send-verify-otp`,{},{withCredentials:true});
      if(data.success){
        navigate('/verify-email')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)  
    }
    }

  return (
    <div className='w-full flex justify-between items-center absolute top-0 p-4 sm:px-6 sm:px-24'>
      <img src={assets.logo} alt="logo" className='w-40 sm:w-50'/>
      {userData ? 
      <div className=' w-8 h-8 flex justify-center items-center gap-3 border border-gray-500  rounded-full text-white bg-black group relative'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 pt-10 text-black rounded '>

          <ul className='list-none bg-gray-200 p-2 m-0 text-sm'>
            {!userData.isVerifiedAccount && <li className='px-2 py-1 hover:bg-gray-100 cursor-pointer ' onClick={sendVerificationEmail }>verify Email</li> 
            }
            <li className='px-2 py-1  hover:bg-gray-100 cursor-pointer pr-10' onClick={ handleLogout} >Logout</li>
          </ul>
        </div>
      </div> 
      :
              <button className='flex items-center rounded-full border gap-2 border-gray-500 px-6 py-2 transition-all hover:bg-gray-100 text-gray-800' onClick={()=> navigate('./login')}>Login<img src={assets.arrow_icon} alt="arrowIcon" /></button>
}
    </div>
  )
}

export default Navbar


import { Navigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AppContent } from '../context/AppContext';


const  EmailVerify = () => {
  
const navigate = useNavigate();

const inputRef = React.useRef([])
const {apiUrl,userData,isLoggedIn,getUserData} = useContext(AppContent);

const inputHandler=(e,index)=>{
  const value= e.target.value;
  if(value.length > 0 && index < inputRef.current.length -1){
    inputRef.current[index+1].focus();
  }
}
const keyHandler =((e,index)=>{
  const value=e.target.value;
  if(e.key === 'Backspace' && value === '' && index > 0){
    inputRef.current[index-1].focus();
  }
})

const handlePaste = (e) => {
  const paste=e.clipboardData.getData('text');
  const pasteArray=paste.split('');
  pasteArray.forEach((char,index)=>{
    if(inputRef.current[index]){
      inputRef.current[index].value=char;
    }
  })
}

const onSubmitHandler= async (e)=>{
  e.preventDefault();
  try{
    const otpArray = inputRef.current.map(e => e.value);
    const otp = otpArray.join('');
    const {data} = await axios.post(`${apiUrl}/api/auth/verify-account`,{otp},{withCredentials:true});

    if(data.success){
      toast.success(data.message);
      getUserData();
      navigate('/');
    
  }else{
      toast.error(data.message);
  }
  }catch(error){
    toast.error(error.message);
}
}

useEffect(()=>{
userData && isLoggedIn && userData.isVerifiedAccount && navigate('/')
},[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 min-h-screen '>
      <img src={assets.logo} alt="" onClick={()=> navigate('/')} className='w-28 sm:w-32 absolute top-3 left-4 sm:left-6'/>

      <form action="" className='bg-slate-200 w-96 shadow-lg rounded-lg p-8 text-sm' onSubmit={onSubmitHandler}>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Verify Your Email</h2>
        <p className='mb-6 text-gray-600 '>Enter 6-digit Verification Code we sent to your email address
        </p>
        <div className='flex justify-between mb-8 ' onPaste={(e)=> handlePaste(e)}>
          {Array(6).fill(0).map((_,index)=>{
            return <input type="text" required maxLength={1} key={index} className=' w-12 h-12 rounded-md text-center text-xl text-white bg-[#333A5C]' 
            ref={e=> inputRef.current[index]=e}
            onInput={(e)=> inputHandler(e,index)}
            onKeyDown={(e)=> keyHandler(e,index)}
            />
          })}
        </div>
        <button className='w-full text-white bg-gradient-to-br from-purple-300 to-blue-500 p-3 rounded-full text-md'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify

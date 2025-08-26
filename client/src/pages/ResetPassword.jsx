
import React, { useState } from 'react';
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
function ResetPassword() {
  const navigate = useNavigate();
const [email,setEmail]=useState('')
const [newPassword,setNewPassword]=useState('');

const [isEmailSent,setIsEmailSent]=useState('');
const [otp,setOtp] = useState(0);
const [isOtpVerified,setIsOtpVerified]=useState(false);


 const {apiUrl,getUserData}= useContext(AppContent);

 
 const inputRef = React.useRef([])
 // input focus handler
 const inputHandler=(e,index)=>{
   const value=e.target.value;
    if(value.length > 0 && index < inputRef.current.length -1){
      inputRef.current[index+1].focus();
    }
  }
  // backspace key handler
  const keyHandler =((e,index)=>{
  const value=e.target.value;
  if(e.key === 'Backspace' && value === '' && index > 0){
    inputRef.current[index-1].focus();
  }
})
// paste handler
const onPasteHandler=(e)=>{
  const paste=e.clipboardData.getData('text');  
  const pasteArray=paste.split('');
  pasteArray.forEach((char,index)=>{
    if(inputRef.current[index]){
      inputRef.current[index].value=char;
    }
  })
}


//  send reset otp to email
const onSubmitEmail=async(e)=>{
  e.preventDefault();
  try{
    const {data}= await axios.post(`${apiUrl}/api/auth/send-reset-opt`,{email},{withCredentials:true});
    if(data.success){
      toast.success(data.message);
      setIsEmailSent(true);
    }
  }catch(error){
    toast.error(error.message)
  }
}

// submit otp handler
const onSubmitOtp= async(e)=>{
  e.preventDefault();
  const otpArray=inputRef.current.map(e=> e.value);
  setOtp(otpArray.join(''));
  setIsOtpVerified(true);
}

// submit new password handler
const onSubmitNewPasswordr= async(e)=>{
  e.preventDefault(); 
      try{
        const {data}= await axios.post(`${apiUrl}/api/auth/reset-password`,{newPassword,otp,email},{withCredentials:true});
        if(data.success){
          toast.success(data.message);
          navigate('/login');
        }else{  
          toast.error(data.message);
 }
  }catch(error){
    toast.error(error.message)  
  }
}
  return (
    <div className='flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200 min-h-screen '>
      <img src={assets.logo} alt="" onClick={()=> navigate('/')} className='w-40 sm:w-50 absolute top-5 sm:left-20 '/>


{/*  */}
{!isEmailSent && 
      <form action="" className='bg-slate-200 w-96 shadow-lg rounded-lg p-8 text-sm ' onSubmit={onSubmitEmail}>
         <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Reset Password </h2>
        <p className='mb-6 text-gray-600 '>Enter your registered email to reset your password</p>

        <div className='flex gap-4 mb-5 bg-[#333A5C] py-2.5 px-5 rounded-full'>
          <img src={assets.mail_icon} alt="" />
          <input type="email" 
          required 
          className='text-white bg-transparent outline-none ' 
          placeholder='email.@gmail.com' 
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          />
        </div>
        <button className='w-full text-white bg-gradient-to-br from-purple-300 to-blue-500 p-3 rounded-full text-md'
        >submit</button>
      </form>
}

           {/* otp input form  */}

      { !isOtpVerified && isEmailSent && 

        <form action="" className='bg-slate-200 w-96 shadow-lg rounded-lg p-8 text-sm' onSubmit={onSubmitOtp}>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Verify Reset Password OTP</h2>
        <p className='mb-6 text-gray-600 '>Enter 6-digit Verification Code we sent to your email address
        </p>
        <div className='flex justify-between mb-8 ' onPaste={(e)=> onPasteHandler(e)} >
          {Array(6).fill(0).map((_,index)=>{
            return <input type="text" required maxLength={1} key={index} 
            className=' w-12 h-12 rounded-md text-center text-xl text-white bg-[#333A5C]' 
            ref={(e)=> inputRef.current[index]=e}
            onInput={(e)=> inputHandler(e,index)}
           onKeyDown={(e)=> keyHandler(e,index)}
            />
          })}
        </div>
        <button className='w-full text-white bg-gradient-to-br from-purple-300 to-blue-500 p-3 rounded-full text-md' 
        >Verify Email</button>
      </form>

      }

    {/* new password Form */}
      { isOtpVerified && isEmailSent &&
          <form action="" className='bg-slate-200 w-96 shadow-lg rounded-lg p-8 text-sm'
          onSubmit={onSubmitNewPasswordr}
          >
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Enter your new Password</h2>
            <div className='flex gap-4 mb-5 bg-[#333A5C] py-2.5 px-5 rounded-full'>
              <img src={assets.lock_icon} alt="" />
              <input type="password" 
              placeholder='password' 
              name='password' 
              required
              onChange={(e)=> setNewPassword(e.target.value)} 
              value={newPassword}  
              className='text-white outline-none '/>
            </div>
            <button className='w-full text-white bg-gradient-to-br from-purple-300 to-blue-500 p-3 rounded-full text-md'
            >Submit</button>

          </form>
}
    </div>
  )
}

export default ResetPassword

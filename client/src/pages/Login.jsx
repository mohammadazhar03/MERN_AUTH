import React, { use, useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import {useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import {toast } from 'react-toastify';
function Login() {
    const [state,setState]=useState('SignUp')
    const navigate = useNavigate();

    const {backendUrl,setIsLoggedIn,getUserData , isLoggedIn} = useContext(AppContent)

    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit= async (e)=>{
      try{
          e.preventDefault();
        axios.defaults.withCredentials= true;
        if(state==='SignUp'){
           const {data} =  await axios.post(`${backendUrl}/api/auth/register`,{name,email,password})
           
                if(data.success){
                    toast.success(data.message)
                    setIsLoggedIn(true)
                    getUserData();
                    navigate('/')
                }else{
                    toast.error(data.message)
                }
        }else{
            const {data}= await axios.post(`${backendUrl}/api/auth/login`,{email,password})
            console.log(data)
                if(data.success){
                    toast.success(data.message)
                    setIsLoggedIn(true)
                    getUserData();
                    navigate('/')
                }else{
                    toast.error(data.message);
                }
        }
      }catch(error){
        toast.error( error.message)
      }
    }

useEffect(()=>{
if(isLoggedIn){
    getUserData();
}
},[isLoggedIn])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-200'>
        <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute w-40 sm:w-50 left-5 top-5 sm:left-20 '/>

        <div className='bg-slate-900 text-indigo-300 sm:w-96 rounded-lg p-10 shadow-lg w-full text-sm'>
            <h2 className='text-white font-semibold text-3xl text-center mb-4'>{state=== 'SignUp' ? 'Create Account' : 'Login'}</h2>
        <h2 className='text-center text-sm mb-6'>{state=== 'SignUp' ? 'Create Your Account' : 'Login to Your account!'}</h2>

        <form  onSubmit={handleSubmit}>
            {state=== 'SignUp' && (
                <div className='flex items-center w-full gap-3 bg-[#333A5C] rounded-full py-2 px-4 mb-4'>
                <img src={assets.person_icon} alt="" />
                <input className='bg-transition outline-none text-gray-400' onChange={(e)=> setName(e.target.value)} value={name} type="text" required placeholder='Full Name' autoComplete='name'/>
            </div>
        )}
            
            <div className='flex items-center w-full gap-3 bg-[#333A5C] rounded-full py-2 px-4 mb-4'>
                <img src={assets.mail_icon} alt="" />
                <input className='bg-transition outline-none text-gray-400' onChange={(e)=> setEmail(e.target.value)} value={email} type="email" required placeholder='Email@gmail.com' autoComplete='email'/>
            </div>

            <div className='flex items-center w-full gap-3 bg-[#333A5C] rounded-full py-2 px-4 mb-4 '>
                <img src={assets.lock_icon} alt="" />
                <input className='bg-transition outline-none text-gray-400' 
                onChange={(e)=> setPassword(e.target.value)} 
                value={password} 
                type="password" 
                required placeholder='password'
                autoComplete={state === 'SignUp' ? 'new-password' : 'current-password'}
                />
            </div>

            <p className='text-indigo-300 mb-4 cursor-pointer' onClick={()=> navigate('/reset-password') }>Forget Password ?</p>

            <button className='text-white py-2.5 w-full bg-gradient-to-r from-indigo-300 to-indigo-900 font-medium rounded-full'>{state}</button>


            {state=== 'SignUp' ? ( <p className='text-gray-400 text-xs mt-2'>Already have an Account? {' '}
                <span className='text-blue-400 text-sm underline cursor-pointer' onClick={()=> setState('Login')}>Login here</span>
            </p>
        ) : (
        <p className='text-gray-400 text-xs mt-2'>Don't have an Account? {' '}
                <span className='text-blue-400 text-sm underline cursor-pointer' onClick={()=> setState('SignUp')}>SignUp here</span>
            </p>
        )  
    }
           
            
        </form>
        </div>

    </div>
  )
}

export default Login

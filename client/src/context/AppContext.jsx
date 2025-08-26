import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props)=>{

    const backendUrl= import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn , setIsLoggedIn]=useState(false);
    const [userData,setUserData]=useState(null);

   const getUserData = async()=>{
    try{
        const {data} = await axios.get(`${backendUrl}/api/user/data`,{withCredentials:true});
        if(data.success) {

            setUserData(data.userData)
        }else{
            if(data.message !== 'Token is missing'){
            toast.error(data.message)
        }
        setUserData(null)
    }     
}catch(error){
    if (error.response?.status !== 401) {
        toast.error(error.message);
    }}
    setUserData(null)
}

    const getAuthenticationStatus= async()=>{
        try{
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`,{withCredentials:true});
            if(data.success){
                setIsLoggedIn(true)
                getUserData();
            }else{
                setIsLoggedIn(false)
                setUserData(null)
            }
            
        }catch(error){
             // treat 401/unauthorized as normal "not logged in"
            if (error.response?.status !== 401) {
            toast.error(error.message);
                }
            setIsLoggedIn(false);
            setUserData(null);
  }}


    useEffect(()=>{
        getAuthenticationStatus();
    },[])

   const value={
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData, getUserData,getAuthenticationStatus
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
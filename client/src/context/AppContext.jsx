import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const AppContent = createContext();

export const AppContextProvider = (props)=>{

    const backendUrl= import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn,setIsLoggedIn]= useState(false);
    const [userData,setUserData]= useState('');
    // const [loading,setLoading]= useState(true);
    
    const getUserData=async ()=>{
        const {data}= await axios.get(`${backendUrl}/api/user/data`,{withCredentials:true});
        try{
            if(data.success){
            setUserData(data.userData);
            setIsLoggedIn(true);
        }
        }catch(error){
            toast.error(error.message)
        }   
    }


    const getAuthenticationStatus= async()=>{
        try{
            const {data}= await axios.get(`${backendUrl}/api/auth/is-auth`,{withCredentials:true});
            if(data.success){
                setIsLoggedIn(true);
                await getUserData();
            }else{
                setIsLoggedIn(false);
                setUserData('');
            }
        }catch(error){
            setIsLoggedIn(false);
            setUserData('');
            toast.error(error.message)
        }
    }
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
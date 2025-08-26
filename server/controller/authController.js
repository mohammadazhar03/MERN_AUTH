const express = require('express');
const userModel = require('../models/userModel.js')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transport = require('../config/nodemailer.js');
const mailOption = require('./mailOption.js');
const { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } = require('../config/emailTemplates.js') ;

const register = async ( req,res)=>{
    const {email,name,password}=req.body;
    // check Details missing
    if(!email || !name || !password){
        return res.json({success:false, message: 'Missing Details' })
    }

    try{
        // checking user email exist or not
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:'User Already exist'});
        }

        // creating new user
        const hashedPassword = await bcrypt.hash(password , 10)
        const user = new userModel({name,email,password:hashedPassword})
        await user.save();

        // creating Token and send as cookie 
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge:7*24*60*60*1000
        })

        // welcome Email form brevo.com
        // const mailOption={
        //         from:process.env.SENDER_EMAIL,
        //         to:email,
        //         subject: "Welcome to Course4you",
        //         text:`welcome to course4You website ${email}`
        //     }

        //     await transport.sendMail(mailOption);
        mailOption(email);
        return res.json({success:true, message:'User Registered Successfully'})

    } catch(error){
        return res.json({success:false,message:error.message})
    }

}

const logIn = async (req,res)=>{
    const{email,password}=req.body;
    if(!email || !password ){
        return res.json({success:false,message:'missing Details'})
    }
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false , message:'Invalid email'})
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.json({success:false,message:'invalid password'})
        }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production' ? 'none' : 'lax',
        maxAge:7 * 24 * 60*60*1000,
    })
    return res.json({success:true , message:'User LoggedIn Successfully'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

const logOut = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req,res)=>{

    // userId is taking from userAuth middleware and set in req object 
    try{
        // const{userId}=req.body;
        const user = await userModel.findById(req.userId)

        if(user.isVerifiedAccount){
            return res.json({success:false , message:"Account is already verified"})
        }
       const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        user.verifyOtp= otp
        user.verifyOtpExpireAt=Date.now() + 24 * 60 * 60 * 1000
        await user.save();

        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification Otp',
            // text:`To verify your account enter this ${otp} in website`
            html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
        }

        await transport.sendMail(mailOption);
    return res.json({success:true , message:"Verification Otp sent to your email"})    

    }catch(error){
        return res.json({success:false, message:`error is ${error.message}`})
    }
}

const verifyEmail= async(req,res)=>{
    const {otp}=req.body;
    if(!req.userId || !otp){
        return res.json({success:false , message:"Missing details"})
    }
    try{
        const user = await userModel.findById(req.userId)
        if(!user){
            return res.json({success:false , message:"User is Not Found"})
        }
        
        if(user.verifyOtp == " " || user.verifyOtp !== otp){
             return res.json({success:false , message:"Invalid Otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false , message:"opt is Expired"})
        }

        user.isVerifiedAccount= true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json({success:true , message:"email is verified successfully"})

    }catch(error){
            return res.json({success:false, message:error.message})
    }
}

// use Authenticated 
const isAutheticated = async  (req,res)=>{
    try{
        return res.json({success:true,message:"Account is authenticated"})
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}

// password reset Otp
const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        res.json({success:false, message:"Email is not Found"})
    }
    try{
        const user= await userModel.findOne({email});
        if(!user){
            res.json({success:false, message:"User not Found"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        // set otp and expire time in user schema 
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now() + 15*60*1000  // 15 minutes ;
        await user.save();

        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset Otp',
            // text:`your resetting password Otp is ${otp} you can use it to reset you password in valid time`
            html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
        }
        await transport.sendMail(mailOption);

        return res.json({success:true,message:"reset Otp sent successfully"})

    }catch(error){
            return res.json({success:false, message:error.message})
    }
}

// reset password via Otp
const resetnewPassword = async (req,res)=>{
    const {email,newPassword,otp} = req.body;

    if(!email || !newPassword || !otp){
        return res.json({success:false, message: 'email , newPassword and otp should be enterd'})
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User is Not Found"})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false, message:"Invalid Otp"})
        }
        user.password=hashedPassword;
        user.resetOtp="";
        user.resetOtpExpireAt=0;

        await user.save();

        return res.json({success:true, message:"your password resetting is succesfully done"})

    }catch(error){
            return res.json({success:false, message:error.message})
    }
}

module.exports={register,logIn,logOut,sendVerifyOtp,verifyEmail,sendResetOtp,resetnewPassword,isAutheticated}
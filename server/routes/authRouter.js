const express = require('express');
const { register, logIn, logOut, sendVerifyOtp, verifyEmail, sendResetOtp, isAutheticated, resetnewPassword } = require('../controller/authController.js');
const  userAuth = require('../middleware/userAuth.js')
const authRouter=express.Router();
authRouter.post('/register',register);
authRouter.post('/login',logIn);
authRouter.post('/logout',logOut);
authRouter.post('/send-verify-otp',userAuth ,sendVerifyOtp);
authRouter.post('/verify-account',userAuth , verifyEmail);
authRouter.get('/is-auth',isAutheticated)
authRouter.post('/send-reset-opt',sendResetOtp);
authRouter.post('/reset-password',resetnewPassword)


module.exports=authRouter;
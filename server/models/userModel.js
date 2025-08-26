const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type: String, required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String, required:true},

    // Otp verification 
    verifyOtp:{type:String,default:""},
    verifyOtpExpireAt:{type:Number,default:0},

    // resetOpt verfication
    resetOtp:{type:String,default:""},
    resetOtpExpireAt:{type:Number,default:0},

    // isUserAccoutVerified
    isVerifiedAccount:{type:Boolean,default:false}
})

const userModel = mongoose.model.user || mongoose.model('user',userSchema);

module.exports = userModel;
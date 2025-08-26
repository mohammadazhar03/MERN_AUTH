const userModel = require("../models/userModel.js");

const userController= async (req,res)=>{
   
    try{
        // const {userId}= req.body;
        const user = await userModel.findById(req.userId);
        if(!user){
            return res.json({success:false , message:'User details not found'})
        }
        res.json({
            success:true,
            userData:{
                name:user.name,
                isVerifiedAccount:user.isVerifiedAccount
            }
        })
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}

module.exports=userController;
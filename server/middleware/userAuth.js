const jwt = require('jsonwebtoken')
const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({ success: false, message:"Token is missing"});
    }
    try{
        // verify token and decode it 
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
            // userId is setting in req object to access in other controller
            req.userId=tokenDecode.id;
        }else{
            return res.json({ success: false, message:"Not authorised user login again"});
        }
        next();
    } catch(error){
        return res.json({ success: false, message: error.message });
    }
}
module.exports=userAuth
const userModel = require('../models/userModel.js')
const transport= require('../config/nodemailer.js')
require('dotenv').config();


const mailOption = async (email)=>{
    try{
        const emailOption={
    from:process.env.SENDER_EMAIL,
    to:email,
    subject: "Welcome to Course4you",
    text:`welcome to course4You website ${email}`
}
await transport.sendMail(emailOption);
console.log(`email sent to ${email}`)
    }catch(error){
        console.log(`Email send Failed`)
    }
}
module.exports=mailOption
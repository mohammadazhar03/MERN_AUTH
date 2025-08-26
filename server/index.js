const express = require('express');
const app=express();
const cors=require('cors')
const mongoDB = require('./config/mongoDB.js');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter.js');
const userRouter = require('./routes/userRouter.js');

mongoDB();
require('dotenv').config()
const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins, credentials: true}));

app.get('/',(req,res)=> res.send('API is Running'))
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT || 5000,()=>{
console.log(`Server is Running on Port ${process.env.PORT}`)
})

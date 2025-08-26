const express = require('express');
const app=express();
const cors=require('cors')
const mongoDB = require('./config/mongoDB.js');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter.js');
const userRouter = require('./routes/userRouter.js');

mongoDB();
require('dotenv').config()
const allowedOrigins = [
    'http://localhost:5173',  // local dev
    'https://yourfrontend.netlify.app' // deployed frontend
];


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin like mobile apps or Postman
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.get('/',(req,res)=> res.send('API is Running'))
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(process.env.PORT || 5000,()=>{
console.log(`Server is Running on Port ${process.env.PORT}`)
})

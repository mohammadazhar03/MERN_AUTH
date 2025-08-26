const express = require('express');
const userAuth = require('../middleware/userAuth.js');
const userController = require('../controller/userController.js');

const userRouter = express.Router();
userRouter.get('/data',userAuth,userController)

module.exports=userRouter;
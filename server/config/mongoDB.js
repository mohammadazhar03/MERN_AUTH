const mongoose = require('mongoose');

const mongoDB = async ()=>{

    mongoose.connection.on('connected',()=>{
        console.log('mongoose is connected')
    })
    await  mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`,)

}
module.exports= mongoDB
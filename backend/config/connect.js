const colors = require('colors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const connectDB = async () => {
 
}

const start = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          
          console.log(connect.connection.host);
    } catch (error) {
        console.log(error)
        process.exit()
    }
}
start()
module.exports = connectDB

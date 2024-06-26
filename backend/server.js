require('dotenv').config()
require('express-async-errors')

const express = require('express')
const path = require('path') 
var cors = require('cors')
const app = express()
app.use(express.json())

const connectDB = require('./config/connect')
const userRoutes = require('./routes/userRoutes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const chatRoutes = require('./routes/chatRoutes')
const msgRoutes = require('./routes/msgRoutes')
connectDB()
const port = process.env.PORT | 3001

// app.use('/',(req,res)=>{
//     res.json({msg:"hello"})
// })
app.use(cors({
    origin:["https://sockchat.onrender.com"]
}))
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/message', msgRoutes)

// --------------------------deployment------------------------------

// const dirname1 = process.cwd()
// console.log(process.cwd())
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(dirname1,'/frontend' , "/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(dirname1, '/frontend', 'build', 'index.html'))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }
// "proxy": "https://sampledeployment.onrender.com/",
// --------------------------deployment------------------------------


app.use(notFound)
app.use(errorHandler)

const server = app.listen(port,console.log(`server is listening on http://localhost:${port}/`))

const io = require('socket.io')(server,{
    pingTimrOut: "60000",
    cors:{
        origin: ["http://localhost:3000"],
    }
});

io.on('connection', (socket) => {
    console.log("connected");
    socket.on( 'setup',(userData)=>{
        
        socket.join(userData._id);
        socket.emit("connected")
        
    })

    socket.on('join chat', (room)=>{
        socket.join(room)
        console.log("user joined room : " + room)
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        
        if(!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved)
        });
    })
})

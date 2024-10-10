const express =  require("express")
let app =  express()
let indexRouter =  require("./routes/index")
const path =  require("path")
const  http =  require("http")
const  socketIo =  require("socket.io")
const { log } = require("console")
const  server =  http.createServer(app)
const io =  socketIo(server)

let waitingUser = []
let rooms = {}
io.on("connection" ,function (socket) {
    socket.on("joinRoom" ,  function(){
        if(waitingUser.length > 0 ){
          let partner =  waitingUser.shift()
          
          
          const roomname =  `${socket.id}-${partner.id}`          
          socket.join(roomname);
          partner.join(roomname);

          io.to(roomname).emit("joined" , roomname)
        }
        else{
            waitingUser.push(socket)
            
        }
    })
    socket.on("disconnect" , function(){
      let index =   waitingUser.findIndex(waitingUser => waitingUser.id === socket.id)
      waitingUser.splice(index , 1)
    })
    socket.on("message" , function(data){
     socket.broadcast.to(data.room).emit("message" , data.message)  
           
    })
    socket.on("startVideoCall" ,function (data){
     socket.broadcast.to(data.room).emit("incomingCall")      
    })
    socket.on("acceptCall" , function ({room}) {
      socket.broadcast(room).emit("callAccepted")      
    } )
    socket.on("sigalingMessage" ,function ({room}){
      socket.broadcast.to(room).emit("sigalingMessage" , data.message)
      
    })
    
})


app.set("view engine" ,"ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname ,"public")))


app.use("/" , indexRouter)
server.listen(3000)
const express =  require("express")
let app =  express()
let indexRouter =  require("./routes/index")

const path =  require("path")


app.set("view engine" ,"ejs")
app.use(express.json())
app.use(express.urlencoded({extends:true}))
app.use(express.static(path.join(__dirname ,"public")))


app.use("/" , indexRouter)
app.listen(3000)
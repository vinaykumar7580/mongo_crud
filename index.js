const express=require("express")
const cors=require("cors")
const {userRouter}=require("./routes/userRoute")
const {noteRouter}=require("./routes/noteRoute")
const {connection}=require("./db")
const {auth}=require("./middleware/auth.middleware")

const app=express()
app.use(express.json())
app.use(cors())


app.use("/auth",userRouter)

app.use(auth)
app.use("/notes",noteRouter)

app.listen(4040,async(req,res)=>{
    try{
        await connection
        console.log("mongoDB connected")

    }catch(err){
        console.log(err)
        console.log("mongoDB not connected")
    }
    console.log("server running on port 4040")
})
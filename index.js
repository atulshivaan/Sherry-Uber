import cookieParser from "cookie-parser";
import express from "express"
import dotenv from "dotenv"
import connectDB from "./Db/connectDB.js";
import  authRouter  from "./routes/user.routes.js";
dotenv.config()

const app =express();
const port =process.env.PORT || 5050

app.get("/",(req,res)=>{
    res.send("defwafwqfr");
})

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
//routes
app.use("/api/auth",authRouter)

app.listen(port,(req,res)=>{
   connectDB();
    console.log(`port is running on ${port}`);
    
})
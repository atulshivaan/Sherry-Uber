import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app =express();
const port =process.env.PORT || 5050

app.get("/",(req,res)=>{
    res.send("defwafwqfr");
})


app.listen(port,(req,res)=>{
    console.log(`port is running on ${port}`);
    
})
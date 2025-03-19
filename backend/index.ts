import { Request, Response } from "express";
import express from "express"
import authRoutes from "./routes/authRouter"
import connectDb from "./db/db";
import dotenv, { config } from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
// connect db call 
dotenv.config()

connectDb()
const app = express()


//midlwware
app.use(express.json())
app.use("/api/",authRoutes)
app.use(cookieParser())
// app.use(cors(
//     Credential:true,
//     origin:""
// ))


app.get("/" , (rq:Request,rs:Response) =>{
    rs.send("hare krishna")
    
})
const port = process.env.PORT
app.listen(port , ()=>{
    console.log("server run successful");
    
})
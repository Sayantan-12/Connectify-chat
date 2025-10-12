import express from "express"
import dotenv from "dotenv"
import dbConnect from "./DB/dbConnect.js"
import authRouter from "./route/authUser.js"
import messageRouter from "./route/messageRoute.js"
import userRouter from "./route/userRoute.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path"

import {app, server} from './socket/socket.js'

const __dirname = path.resolve();

dotenv.config();     // In this way we can access dotenv from anywhere in the server
dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);
app.use('/api/user',userRouter);

app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


// app.get("/", (req,res)=>{
//     res.send("Server is working");
// })

const PORT = process.env.PORT

server.listen(PORT, ()=>{
    dbConnect();
    console.log(`Working at ${PORT}`);
});
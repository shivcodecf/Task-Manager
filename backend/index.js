import express from 'express'

import connectDB from './db/connect.js';

import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';

dotenv.config(); 

const PORT = process.env.PORT || 8000;

import userRoute from "./routes/users.route.js"

import tasksRoute from "./routes/tasks.route.js"
import cors from 'cors'





const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));

app.use(express.json());





app.use(cookieParser());

app.use("/api/v1/user",userRoute);

app.use("/api/v1/tasks",tasksRoute);





connectDB();





app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})



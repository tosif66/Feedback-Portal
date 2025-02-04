// importing dependencies and setting up the server
import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// creating instance of express in app
const app = express();

// setting up the port to 5000 or the port provided by the environment
const port = process.env.PORT || 5000;

connectDB();

const allowOrigins = ['https://feedback-portal-1-69kw.onrender.com',
    'https://feedback-portal-90bo.onrender.com','https://timely-cascaron-e38cca.netlify.app']

// using express.json to parse the request body
app.use(express.json());

// using cookie parser and cors
app.use(cookieParser());
app.use(cors({origin:allowOrigins,credentials:true}));

// API Endpoints
app.get('/',(req,res)=> res.send('Api is working'));

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admin',adminRouter)

// starting the server on the port
app.listen(port, () => console.log(`Server is running on port ${port}`));
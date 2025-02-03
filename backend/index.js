// importing depencdencies and setting up the server
import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import path from 'path';

const __dirname = path.resolve();

// creating instance of express in app
const app = express();

// setting up the port to 5000 or the port provided by the environment
const port = process.env.PORT || 5000;

connectDB();

const allowOrigins = ['http://localhost:5173']

// if express.json throw error please change it into express()
app.use(express.json());

// using cookie parser and cors
app.use(cookieParser());
app.use(cors({origin:allowOrigins,credentials:true}));

// API Endpoints
app.get('/',(req,res)=> res.send('Api is working'));

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admin',adminRouter)

app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend","dist","index.html"))
})

// starting the server on the port
app.listen(port, () => console.log(`Server is running on port ${port}`));
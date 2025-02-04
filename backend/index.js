import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// Create an instance of express
const app = express();

// Set the port
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Define allowed origins for CORS
const allowOrigins = [
  'https://feedback-portal-1-69kw.onrender.com',
  'https://feedback-portal-90bo.onrender.com',
  'https://timely-cascaron-e38cca.netlify.app',
  'http://localhost:5173'
];

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Handle preflight requests
app.options('*', cors()); // Enable preflight for all routes

// API Endpoints
app.get('/', (req, res) => res.send('API is working'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
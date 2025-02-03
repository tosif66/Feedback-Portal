import express from 'express';
import userAuth from '../middleware/userAuth.js';
// Update route configuration
import { 
    getUserData, 
    submitFeedback, 
    getUserFeedbacks  
    } from '../controllers/userController.js';
  
  const userRouter = express.Router();
  
  userRouter.get('/data', getUserData);
  userRouter.get('/user-feedback', userAuth, getUserFeedbacks);  
  userRouter.post('/submit-feedback', userAuth, submitFeedback);

export default userRouter;
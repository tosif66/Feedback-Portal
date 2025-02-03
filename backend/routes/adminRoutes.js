import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import superAdminAuth from '../middleware/superAdminAuth.js';
import { adminDashboard, createAdmins, deleteAdmin, manageAdmins, manageUsers, updateAdmin, viewFeedback, superAdminDashboard } from '../controllers/adminController.js';
import { addUser, deleteUser, updateUser } from '../controllers/authController.js';

const adminRouter = express.Router();

// Admin-only routes
adminRouter.get('/dashboard', adminAuth, adminDashboard);
adminRouter.get('/view-feedback', adminAuth, viewFeedback);
adminRouter.get('/manage-users', adminAuth, manageUsers); 

adminRouter.post('/add-user', adminAuth, addUser);
adminRouter.put('/update-user/:userId', adminAuth, updateUser);
adminRouter.delete('/delete-user/:userId', adminAuth, deleteUser);




// Superadmin-only routes
adminRouter.get('/super-dashboard', superAdminAuth, superAdminDashboard);
adminRouter.post('/create-admin', superAdminAuth, createAdmins);
adminRouter.get('/manage-admins', superAdminAuth, manageAdmins);
adminRouter.delete('/delete-admin/:adminId', superAdminAuth, deleteAdmin);
adminRouter.put('/update-admin/:adminId', superAdminAuth, updateAdmin);

export default adminRouter;

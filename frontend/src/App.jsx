import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import FeedbackForm from "./components/FeedBackForm";
import NotFound from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import AdminPanel from "./dashboard/AdminPanel";
import UserTable from "./components/UserTable";
import SuperAdminPanel from "./dashboard/SuperAdminPanel";
import UserFeedback from "./pages/UserFeedback";

const App = () => (
  <>
    {/* Toast notifications container */}
    <ToastContainer />
    

    {/* App Routes */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin-panel" element={<AdminPanel />} />
      <Route path="/super-admin-panel" element={<SuperAdminPanel/>} />
      <Route path="/user-table" element={<UserTable />} />
      <Route path="/user-feedback" element={<UserFeedback />} />
      
      

    </Routes>
  </>
  
);

export default App;

import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { SidebarData } from '../icons/Icons.jsx'; // Import the function
import { LogOut } from "lucide-react";
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminTable from './AdminTable.jsx';

const Sidebar = ({ setActiveComponent, isSuperAdmin }) => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

  // Call the SidebarData function to get the array of sidebar items
  const sidebarItems = SidebarData(isSuperAdmin);

  const signout = async () => {
    try {
      axios.defaults.withCredentials = true; // Ensures cookies are included
      const logout = await axios.post(`${backendUrl}/api/auth/logout`);
      const data = logout.data;

      if (data?.success === false) {
        console.log(data?.message);
      }

      // Clear context or global state
      setUserData(null);
      localStorage.clear(); // Clear localStorage
      setIsLoggedIn(false);
      navigate('/login');
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during logout');
    }
  };

  return (
    <div className="flex flex-col relative pt-10 transition-all duration-300 ease">
      {/* Logo */}
      <div className="flex h-20 font-bold text-[22px] gap-4 items-center justify-center">
        <img src={assets.dclogo} alt="Dc Infotech Logo" className="h-21 w-21" />
      </div>

      {/* Menu */}
      <div className="mt-13 ml-0 flex flex-col gap-8">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSelected(index); // Highlight the selected item
              setActiveComponent(() => item.component); // Set the active component
            }}
            className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 
            ${
              selected === index
                ? "bg-pink-500 text-white before:content-[''] before:block before:h-full before:w-1 before:bg-white before:mr-2"
                : 'hover:bg-gray-100 hover:text-black'
            } flex items-center gap-4`}
          >
            <item.icon />
            <span>{item.heading}</span>
          </div>
        ))}

        {/* Signout Button */}
        <div
          onClick={signout}
          className="flex items-center bottom-0 gap-2 h-10 ml-0 
          relative transition-all ease cursor-pointer text-lg 
          hover:text-[#fff] hover:bg-black rounded-lg 
          before:content-[''] before:w-2 before:h-[100%] before:bg-white"
        >
          <LogOut />
          <span>Signout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
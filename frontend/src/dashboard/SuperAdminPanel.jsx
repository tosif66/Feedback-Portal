import React, { useState } from 'react';
import WaveBackground from '../components/WaveBackground';
import Sidebar from '../components/Sidebar';
import MainDash from './MainDash'; // Import your default component
// Import the AdminTable component

const SuperAdminPanel = () => {
  // Default to MainDash as the active component
  const [activeComponent, setActiveComponent] = useState(() => MainDash);

  return (
    <div className="relative flex w-full h-screen bg-gray-100">
      {/* Wave Background */}
      <div className="absolute inset-0 z-0">
        <WaveBackground />
      </div>

      {/* Sidebar */}
      <div className="relative z-10 w-48 bg-white shadow-md">
        <Sidebar setActiveComponent={setActiveComponent} isSuperAdmin={true} />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 p-6 overflow-y-auto bg-white shadow-lg rounded-lg">
        {React.createElement(activeComponent)}
      </div>
    </div>
  );
};

export default SuperAdminPanel;
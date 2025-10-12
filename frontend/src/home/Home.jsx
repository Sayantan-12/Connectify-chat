import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div
      className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[75%] md:h-full  
      rounded-xl shadow-lg bg-gradient-to-t from-blue-800 to-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0"
    >
      {/* Sidebar Section */}
      <div className={`w-full py-2  md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      {/* Divider */}
      {selectedUser && isSidebarVisible && (
        <div className="divider divider-horizontal px-3 md:flex" />
      )}

      {/* Message Container Section */}
      <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gradient-to-t from-blue-800 to-gray-900`}>
        <MessageContainer onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;

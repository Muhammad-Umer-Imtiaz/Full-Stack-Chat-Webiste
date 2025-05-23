// import React from 'react';
// import { useChatStore } from '../store/useChatStore';
// import Sidebar from '../Components/Sidebar';
// import NoChatSelected from '../Components/NoChatSelected';
// import ChatContainer from '../Components/ChatContainer';
// import Navbar from '../Components/Navbar';

// const Home = () => {
//   const { selectedUser } = useChatStore();

//   return (
//     <div className='h-screen'>
//       <Navbar  />
//       <div className="flex h-full  bg-gradient-to-br from-blue-50 to-blue-100 pt-20">
//         <Sidebar />
//         <div className="w-full ">
//           {selectedUser ? (
//             <ChatContainer />
//           ) : (
//             <NoChatSelected />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import Sidebar from '../Components/Sidebar';
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';
import Navbar from '../Components/Navbar';
import { Menu, X } from 'lucide-react';

const Home = () => {
  const { selectedUser } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="h-16 flex-none z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative pt-0">
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div 
          className={`
            fixed lg:relative
            lg:top-0 top-16 left-0 bottom-0
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out
            w-72 lg:w-1/4 xl:w-1/5
            bg-white/80 backdrop-blur-md
            z-40 lg:z-auto
            ${selectedUser ? 'lg:block' : 'lg:block'}
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
          `}
        >
          <Sidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 w-full lg:w-3/4 xl:w-4/5 z-10">
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <div className="h-full">
              <NoChatSelected />
            </div>
          )}
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

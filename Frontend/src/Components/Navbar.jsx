import { FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      const success = await logout();
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-transparent backdrop-blur-sm py-4 px-6 flex items-center justify-around fixed top-0 w-full z-50">
      {/* Left side - Logo */}
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/" className="flex gap-3 items-center hover:opacity-75 transition-opacity">
          <img src={logo} alt="logo" width={50} height={50} className="object-contain" />
          <span className="hidden sm:inline">Chatty</span>
        </Link>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-6">
        {authUser && (
          <>
            <p className="text-black">{authUser.userName}</p>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <FiUser className="text-xl" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center space-x-2 transition-colors duration-200
                ${isLoggingOut 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-red-600'}`}
            >
              <FiLogOut className="text-xl" />
              <span className="hidden sm:inline">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

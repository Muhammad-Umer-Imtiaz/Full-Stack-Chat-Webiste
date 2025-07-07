import { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./sekelotons/SidebarSekeloton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filterUsers = users?.filterUsers || [];

  // Filter users based on search query and online status
  const filteredUsers = filterUsers
    .filter(user => {
      const matchesSearch = user.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
      return matchesSearch && matchesOnline;
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        bg-white/80 backdrop-blur-md
        border-r border-base-300
        shadow-lg lg:shadow-none
        z-40 lg:z-auto
        w-72 lg:w-full
        h-[calc(100vh-4rem)] 
        fixed lg:relative
        flex flex-col
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full p-5 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-700" />
          <span className="font-medium text-black">Contacts</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 
                     text-sm text-gray-700 
                     bg-gray-100 rounded-lg 
                     focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:bg-white 
                     transition-all duration-300"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Online filter toggle */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-black whitespace-nowrap">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto flex-1 w-full py-3 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-4 animate-fade-in">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 transition-all duration-200
  ${selectedUser?._id === user._id
                  ? "bg-gray-300 ring-1 ring-gray-400 "
                  : "hover:bg-gray-200 "
                }`}

            >
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="w-12 h-12 object-cover rounded-full transition-transform duration-300 hover:scale-105"
                />
                {onlineUsers.includes(user._id) ? (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
                ) : (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-gray-300 rounded-full ring-2 ring-white" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col min-w-0">
                <div className="font-medium text-black">{user.userName}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

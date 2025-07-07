import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../Store/useAuthStore.js';
import { useNavigate } from "react-router-dom";
import { Camera, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar.jsx';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, checkAuth } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) checkAuth();
  }, [authUser, checkAuth]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);
    setSelectedImage(URL.createObjectURL(file));

    try {
      await updateProfile(formData);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to update profile picture');
      setSelectedImage(null);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-16  ">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <div className=" rounded-3xl bg-white shadow-xl p-6 md:p-10">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600 mt-3 text-lg">Manage your account settings</p>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <img
                src={selectedImage || authUser?.profilePic || '/avatar.png'}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100
                         shadow-md group-hover:shadow-lg transition-all duration-300"
              />
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-2 right-2 bg-indigo-600 p-3 rounded-full cursor-pointer
                         shadow-md hover:bg-indigo-700 transition-all duration-200
                         transform group-hover:scale-105 active:scale-95"
              >
                <Camera className="w-5 h-5 text-white" />
              </label>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>
            {isUpdatingProfile && (
              <div className="mt-4 flex items-center gap-2 text-indigo-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Updating profile...</span>
              </div>
            )}
          </div>

          {/* User Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Info Cards */}
            <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Username</h3>
              <p className="text-lg font-semibold text-gray-900">{authUser?.userName}</p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Email</h3>
              <p className="text-lg font-semibold text-gray-900">{authUser?.email}</p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Member Since</h3>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(authUser?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Password Update Button */}
            <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <button
                onClick={() => navigate('/update-password')}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg
                         font-medium hover:bg-indigo-700 transition-all duration-200
                         flex items-center justify-center gap-2
                         transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <KeyRound className="w-5 h-5" />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
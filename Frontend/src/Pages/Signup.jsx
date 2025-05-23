import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { GoEyeClosed } from "react-icons/go";
import { FiEye } from "react-icons/fi";
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        profilePic: ""
    });

    const navigate = useNavigate();
    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        const { userName, email, password } = formData;

        if (!userName.trim()) return toast.error("Username is required");
        if (!email.trim()) return toast.error("Email is required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return toast.error("Please enter a valid email");

        if (!password.trim()) return toast.error("Password is required");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePic: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) return;

        const formDataToSend = new FormData();
        formDataToSend.append("userName", formData.userName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);

        if (formData.profilePic) {
            formDataToSend.append("profilePic", formData.profilePic);
        }

        await signup(formDataToSend); // Await in case you want to do something after
        navigate("/"); // Redirect to home after signup
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-4 text-black py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                            >
                                {showPassword ? <GoEyeClosed size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Profile Picture (Optional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {formData.profilePic && (
                            <div className="mt-4">
                                <img
                                    src={URL.createObjectURL(formData.profilePic)}
                                    alt="Profile Preview"
                                    className="w-20 h-20 rounded-full object-cover mx-auto"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="animate-spin size-5 inline-block mr-2" />
                                    Loading...
                                </>
                            ) : (
                                <>Sign Up</>
                            )}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;

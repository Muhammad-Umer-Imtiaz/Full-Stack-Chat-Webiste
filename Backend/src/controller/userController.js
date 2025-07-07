import { User } from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/JWT.js";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream"; // Needed to handle memory buffer upload

// SIGNUP
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  const file = req.file; // Uploaded file (multer memory storage)

  try {
    if (!password)
      return res.status(400).json({ message: "Password is required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = "";

    if (file) {
      profilePicUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) return reject(new Error("Cloudinary upload failed"));
            resolve(result.secure_url);
          }
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    }

    const newUser = new User({
      email,
      userName,
      password: hashPassword,
      profilePic: profilePicUrl,
    });

    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({ message: `${userName}, Welcome to our site!` });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Signup First" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect password, try again" });
    }

    // Generate token
    generateToken(user._id, res);

    // Remove password from user object
    const userWithoutPassword = await User.findById(user._id).select("-password");

    // Send both user data and message
    res.status(200).json({
      message: `${user.userName}, Welcome back!`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE PROFILE PICTURE
export const updateProfile = async (req, res) => {
  const file = req.file;
  const userId = req.user._id;

  try {
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const uploadImage = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        (error, result) => {
          if (error) return reject(new Error("Cloudinary upload failed"));
          resolve(result.secure_url);
        }
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadImage },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CHECK AUTH
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Unauthorized - No token provided" });
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const userId = req.user._id;

  try {
    if (!password || !newPassword)
      return res.status(400).json({ message: "Please fill all fields" });
    if (password === newPassword)
      return res
        .status(400)
        .json({ message: "Old and new passwords cannot be the same" });

    const user = await User.findById(userId).select("+password");
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please sign up first." });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res
        .status(400)
        .json({ message: "Incorrect password. Try again." });

    if (newPassword.length <= 6)
      return res
        .status(400)
        .json({ message: "New password must be greater than 6 characters" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
 export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
 };
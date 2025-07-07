import jwt from "jsonwebtoken";
import { User } from "../Model/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "Invalid Token" });
    const decode = await jwt.verify(token, process.env.SECRETKEY);
    if (!decode)
      return res.status(400).json({ message: "Token doesn't Match" });
    const user = await User.findById(decode.userId).select("-password");
    if (!user) return res.status(400).json({ message: "user Not Found" });
    req.user = user;
    next(); 
  } catch (error) {
    console.log(error);
  }
};

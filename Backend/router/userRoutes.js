import express from "express";
import {
  checkAuth,
  getProfile,
  login,
  logout,
  signup,
  updatePassword,
  updateProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import upload from "../Middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update-password", isAuthenticated, updatePassword);
router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePic"),
  updateProfile
);
router.get("/profile", isAuthenticated, getProfile)
router.get("/check", isAuthenticated, checkAuth);
export default router;

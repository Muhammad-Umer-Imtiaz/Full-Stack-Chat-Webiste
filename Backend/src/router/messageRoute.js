import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getMessages,
  getUSerForSidebar,
  sendMessages,
} from "../controller/messageController.js";
import upload from "../Middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/user", isAuthenticated, getUSerForSidebar);
router.post("/sendmessage/:id",isAuthenticated,upload.array("image",5),sendMessages);
router.get("/:id", isAuthenticated, getMessages); //here i get all messages
export default router;

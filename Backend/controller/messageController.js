import { User } from "../Model/userModel.js";
import { Message } from "../Model/messageModel.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

// Get users for sidebar (excluding the logged-in user)
export const getUSerForSidebar = async (req, res) => {
  try {
    const loginUserId = req.user._id; 

    const filterUsers = await User.find({ _id: { $ne: loginUserId } }).select(
      "-password"
    );

    if (!filterUsers || filterUsers.length === 0) {
      return res.status(400).json({ message: "Failed to get users" });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      filterUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send a message (text and optional images)
export const sendMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const files = req.files;
    const senderId = req.user._id;

    // Prevent sending message to self
    if (receiverId === senderId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a message to yourself" });
    }

    // Require either a message or files
    if (!message && (!files || files.length === 0)) {
      return res
        .status(400)
        .json({ message: "Please provide a message or an image" });
    }

    let imageUrls = [];

    // Upload each file to Cloudinary
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "Chat_App_Message_pics",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary Error:", error);
                return reject(new Error("Image upload failed"));
              }
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    // Save message to DB
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || undefined,
      image: imageUrls.length > 0 ? imageUrls : undefined,
    });

    await newMessage.save();

    // Emit message in real-time to receiver (if connected)
    const receiverSocketId = await getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

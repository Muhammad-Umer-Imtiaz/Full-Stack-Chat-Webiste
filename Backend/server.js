import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./Database/dbConnection.js";
import userRoute from "./router/userRoutes.js";
import messageRoute from "./router/messageRoute.js";
import { app, server } from "./utils/socket.js";

dotenv.config();

app.use(
  cors({
    origin: process.env.FrontendURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
if (!process.env.FrontendURL) {
  console.warn("Warning: FrontendURL not defined in .env");
}
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 7000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);


server.listen(port, () => {
  console.log(`App listening at port ${port}`);
  dbConnection();
});
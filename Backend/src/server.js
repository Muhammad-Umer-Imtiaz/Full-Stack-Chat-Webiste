import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./Database/dbConnection.js";
import userRoute from "./router/userRoutes.js";
import messageRoute from "./router/messageRoute.js";
import { app, server } from "./utils/socket.js";
import path from "path";

dotenv.config();
const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FrontendURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 7000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/build")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/build/index.html"));
  });
}

server.listen(port, () => {
  console.log(`App listening at port ${port}`);
  dbConnection();
});
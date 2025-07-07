import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      dbName: "Chat-Website",
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connection Failed:", error);
  }
};

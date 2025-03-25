import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import { initDB } from "./models/index.js";
import albumRoutes from "./routes/album.route.js";

import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/", albumRoutes);

initDB().then(() => {
  app.listen(port, () => {
    logger.info(`server is running at ${port}`);
  });
});

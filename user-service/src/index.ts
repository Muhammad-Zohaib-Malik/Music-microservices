import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1", userRouter);

app.listen(5000, () => {
  logger.info(`server is running at ${port}`);
  connectDB();
});

import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import songRoutes from "./routes/song.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", songRoutes);

app.listen(port, () => {
  logger.info(`server is running at ${port}`);
});

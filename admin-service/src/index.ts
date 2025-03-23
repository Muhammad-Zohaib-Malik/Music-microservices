import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import { initDB } from "./models/index.js";
import albumRoutes from "./routes/album.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", albumRoutes);

initDB().then(() => {
  app.listen(port, () => {
    logger.info(`server is running at ${port}`);
  });
});

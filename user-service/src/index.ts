import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log(`server is running at ${port}`);
});

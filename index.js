require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db.js");
const userRouter = require("./src/api/routes/user");
const eventRouter = require("./src/api/routes/event");
const attenderRouter = require("./src/api/routes/attender");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/attenders", attenderRouter);

app.use("*", (req, res, next) => {
  res.status(404).json("Route Not Found");
});

app.listen("3000", () => {
  console.log("escuchando en http://localhost:3000");
});

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const uploadRouter = require("./routes/uploadRouter");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRouter);
app.use("/api/posts",postRouter);
app.use("/api/upload", uploadRouter);
app.get('/', (req, res) => {
  res.send({ message: "Test confirmed" });
});

// Error Handler Middleware
app.use(errorHandler);



// Database Connection + Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

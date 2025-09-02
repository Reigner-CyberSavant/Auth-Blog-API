// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      // stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;

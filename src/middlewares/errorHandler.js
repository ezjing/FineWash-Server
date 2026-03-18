const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    message: "서버 오류가 발생했습니다.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;


const AsyncHandler = (handler) => {
  if (typeof handler !== "function") {
    throw new TypeError("AsyncHandler expects a function");
  }

  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

module.exports = AsyncHandler;


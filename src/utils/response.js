const Ok = (res, payload = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, ...payload });
};

const Fail = (res, statusCode, message, payload = {}) => {
  return res.status(statusCode).json({ success: false, message, ...payload });
};

module.exports = {
  Ok,
  Fail,
};

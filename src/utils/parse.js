const ToNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const HasText = (value) => {
  return value != null && String(value).trim() !== "";
};

module.exports = {
  ToNumber,
  HasText,
};


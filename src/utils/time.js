const FormatTimeForApi = (value) => {
  if (value == null) return null;
  const raw = String(value);
  return raw.length >= 5 ? raw.substring(0, 5) : raw;
};

const NormalizeTime = (value) => {
  if (value == null || String(value).trim() === "") return null;
  const raw = String(value).trim();
  if (/^\d{2}:\d{2}$/.test(raw)) return `${raw}:00`;
  return raw;
};

module.exports = {
  FormatTimeForApi,
  NormalizeTime,
};

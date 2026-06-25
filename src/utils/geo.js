const { ThrowFromCode } = require("./app_error");
const CODES = require("./error_codes");

const ToNumberOrNull = (v) => {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const HaversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GeocodeAddressKakao = async (address) => {
  const query = String(address ?? "").trim();
  if (!query) ThrowFromCode(CODES.GEO.REQUIRED_ADDRESS);

  const apiKey = String(process.env.KAKAO_REST_API_KEY ?? "").trim();
  if (!apiKey) ThrowFromCode(CODES.GEO.MISSING_API_KEY);

  if (typeof fetch !== "function") {
    ThrowFromCode(CODES.GEO.FETCH_UNAVAILABLE);
  }

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    ThrowFromCode(
      CODES.GEO.PROVIDER_ERROR,
      `${CODES.GEO.PROVIDER_ERROR.message} (status=${resp.status}) ${body}`.trim(),
    );
  }

  const json = await resp.json();
  const doc = Array.isArray(json?.documents) ? json.documents[0] : null;
  const lat = ToNumberOrNull(doc?.y);
  const lng = ToNumberOrNull(doc?.x);

  if (lat == null || lng == null) ThrowFromCode(CODES.GEO.NOT_FOUND);

  return { lat, lng };
};

module.exports = {
  ToNumberOrNull,
  HaversineDistanceKm,
  GeocodeAddressKakao,
};

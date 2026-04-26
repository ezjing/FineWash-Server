const { AppError } = require("./app_error");

const ToNumberOrNull = (v) => {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const HaversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // km
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

/**
 * Kakao Local API로 주소를 지오코딩합니다.
 * - env: KAKAO_REST_API_KEY 필요 (예: "xxxx" / "KakaoAK " 프리픽스 없이)
 */
const GeocodeAddressKakao = async (address) => {
  const query = String(address ?? "").trim();
  if (!query) {
    throw new AppError("GEO_REQUIRED_ADDRESS", 400, "address는 필수입니다.");
  }

  const apiKey = String(process.env.KAKAO_REST_API_KEY ?? "").trim();
  if (!apiKey) {
    throw new AppError(
      "GEO_MISSING_API_KEY",
      500,
      "서버 지오코딩 키(KAKAO_REST_API_KEY)가 설정되지 않았습니다.",
    );
  }

  if (typeof fetch !== "function") {
    throw new AppError(
      "GEO_FETCH_UNAVAILABLE",
      500,
      "현재 런타임에서 fetch를 사용할 수 없습니다(Node 18+ 권장).",
    );
  }

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    query,
  )}`;

  const resp = await fetch(url, {
    method: "GET",
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new AppError(
      "GEO_PROVIDER_ERROR",
      502,
      `지오코딩 요청이 실패했습니다. (status=${resp.status}) ${body}`.trim(),
    );
  }

  const json = await resp.json();
  const doc = Array.isArray(json?.documents) ? json.documents[0] : null;
  const lat = ToNumberOrNull(doc?.y);
  const lng = ToNumberOrNull(doc?.x);

  if (lat == null || lng == null) {
    throw new AppError(
      "GEO_NOT_FOUND",
      400,
      "주소를 좌표로 변환할 수 없습니다(지오코딩 결과 없음).",
    );
  }

  return { lat, lng };
};

module.exports = {
  ToNumberOrNull,
  HaversineDistanceKm,
  GeocodeAddressKakao,
};

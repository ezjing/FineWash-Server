# FineWash 서버-클라이언트 연동 가이드

## 🚀 빠른 시작

### 1. 백엔드 서버 실행

```bash
cd /Users/ezjing/Desktop/Project/Source/FineWash-Server

# 의존성 설치 (처음 한 번만)
npm install

# 환경 변수 파일 생성 (없는 경우)
cp .env.development .env

# .env 파일 수정 (필요 시 SQLite 경로만 설정)
# DB_PATH=./database.sqlite

# 서버 실행
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 2. Flutter 클라이언트 실행

```bash
cd /Users/ezjing/Desktop/Project/Source/FineWash-Client

# iOS 시뮬레이터 (기본 설정)
flutter run

# Android 에뮬레이터 사용 시
# lib/services/api_service.dart 파일에서 baseUrl을 수정:
# static const String baseUrl = 'http://10.0.2.2:3000/api';
```

## 📡 API 엔드포인트

### 결제 검증 API (새로 추가됨)

**POST** `/api/payments/verify`

요청:
```json
{
  "imp_uid": "imp_1234567890",
  "merchant_uid": "reservation_uuid",
  "amount": 30000
}
```

응답:
```json
{
  "success": true,
  "verified": true,
  "message": "결제가 검증되었습니다.",
  "payment": {
    "imp_uid": "imp_1234567890",
    "merchant_uid": "reservation_uuid",
    "amount": 30000
  }
}
```

## 🔧 주요 변경 사항

### 백엔드 서버

1. **결제 검증 API 추가** (`/api/payments/verify`)
   - 포트원 결제 검증 엔드포인트
   - 개발 환경에서는 간단한 검증만 수행
   - 실제 운영 시 포트원 REST API로 검증 필요

2. **Reservation 모델에 결제 정보 필드 추가**
   - `imp_uid`: 포트원 결제 고유번호
   - `merchant_uid`: 주문 고유번호
   - `payment_amount`: 결제 금액

3. **예약 생성 시 결제 정보 저장**
   - 예약 생성 API에서 결제 정보를 함께 저장

4. **API 응답 형식 통일**
   - `bookings` → `reservations`로 변경
   - 클라이언트와 호환되도록 필드명 통일

### Flutter 클라이언트

1. **결제 검증 로직**
   - 결제 성공 후 백엔드 서버에 검증 요청
   - 검증 성공 시에만 예약 저장

2. **예약 저장 시 결제 정보 포함**
   - `imp_uid`, `merchant_uid`, `payment_amount` 전송

## ⚠️ 주의사항

### 개발 환경

- 현재 결제 검증은 개발 환경을 위한 간단한 검증만 수행합니다.
- 실제 운영 시에는 반드시 포트원 REST API를 사용하여 검증해야 합니다.

### 포트원 API 연동 (운영 환경)

`src/routes/payments.js` 파일의 주석 처리된 코드를 활성화하고 포트원 API 키를 설정하세요:

```javascript
// 포트원 REST API 사용
const response = await axios.get(
  `https://api.iamport.kr/payments/${imp_uid}`,
  {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }
);
```

## 🧪 테스트 방법

1. **서버 실행 확인**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **결제 검증 API 테스트**
   ```bash
   curl -X POST http://localhost:3000/api/payments/verify \
     -H "Content-Type: application/json" \
     -d '{
       "imp_uid": "test_imp_uid",
       "merchant_uid": "test_merchant_uid",
       "amount": 30000
     }'
   ```

3. **Flutter 앱에서 테스트**
   - 예약 화면에서 결제 진행
   - 결제 완료 후 예약 저장 확인
   - 예약 목록에서 결제 정보 확인

## 📝 다음 단계

1. SQLite DB 파일은 서버 최초 실행 시 자동 생성됨 (database.sqlite)
2. 포트원 실제 API 키 설정 (운영 환경)
3. 결제 검증 로직 강화 (포트원 REST API 연동)

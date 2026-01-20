# FineWash 결제 연동 테스트 가이드

## 🧪 테스트 환경 설정

### 1. 백엔드 서버 실행

```bash
cd /Users/ezjing/Desktop/Project/Source/FineWash-Server

# 환경 변수 확인
cat .env

# 서버 실행
npm run dev
```

서버가 정상 실행되면:
```
Server is running on port 3000
Health check: http://localhost:3000/api/health
```

### 2. Flutter 클라이언트 실행

#### iOS 시뮬레이터 (기본)
```bash
cd /Users/ezjing/Desktop/Project/Source/FineWash-Client
flutter run
```

#### Android 에뮬레이터
`lib/services/api_service.dart` 파일 수정:
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

## 📋 테스트 시나리오

### 시나리오 1: 출장 세차 예약 + 결제

1. **앱 실행 및 로그인**
   - 로그인 화면에서 로그인
   - 홈 화면으로 이동

2. **출장 세차 예약**
   - "출장 세차 예약" 메뉴 선택
   - 차량 선택 (없으면 등록)
   - 세차 종류 선택 (기본/프리미엄/풀 패키지)
   - 주소 검색 및 입력
   - 날짜 및 시간 선택
   - "예약하기" 버튼 클릭

3. **결제 진행**
   - 결제 모달이 표시됨
   - 포트원 결제 화면에서 테스트 결제 진행
   - 결제 완료

4. **결과 확인**
   - 백엔드 서버에서 결제 검증 수행
   - 예약 저장 완료
   - 예약 확인 화면으로 이동

### 시나리오 2: 제휴 세차장 예약 + 결제

1. **제휴 세차장 예약**
   - "제휴 세차장 예약" 메뉴 선택
   - 차량 선택
   - 세차장 선택
   - 세차 종류 선택
   - 날짜 및 시간 선택
   - "예약하기" 버튼 클릭

2. **결제 및 확인**
   - 결제 진행 (시나리오 1과 동일)
   - 예약 저장 확인

## 🔍 API 테스트 (cURL)

### 1. 서버 상태 확인
```bash
curl http://localhost:3000/api/health
```

### 2. 결제 검증 API 테스트
```bash
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "imp_uid": "test_imp_123456",
    "merchant_uid": "reservation_test_001",
    "amount": 30000
  }'
```

예상 응답:
```json
{
  "success": true,
  "verified": true,
  "message": "결제가 검증되었습니다.",
  "payment": {
    "imp_uid": "test_imp_123456",
    "merchant_uid": "reservation_test_001",
    "amount": 30000
  }
}
```

### 3. 예약 목록 조회 (인증 필요)
```bash
# 먼저 로그인하여 토큰 획득
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 토큰으로 예약 목록 조회
curl http://localhost:3000/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 문제 해결

### 서버가 시작되지 않는 경우

1. **포트 충돌**
   ```bash
   # 포트 3000 사용 중인 프로세스 확인
   lsof -i :3000
   
   # 프로세스 종료
   kill -9 PID
   ```

2. **MySQL 연결 오류**
   - `.env` 파일의 DB 설정 확인
   - MySQL 서버가 실행 중인지 확인
   - 데이터베이스가 생성되어 있는지 확인

### 클라이언트에서 서버 연결 실패

1. **iOS 시뮬레이터**
   - `baseUrl`이 `http://localhost:3000/api`인지 확인

2. **Android 에뮬레이터**
   - `baseUrl`이 `http://10.0.2.2:3000/api`인지 확인

3. **실제 기기**
   - 컴퓨터의 IP 주소로 변경
   - 예: `http://192.168.1.100:3000/api`
   - 같은 Wi-Fi 네트워크에 연결되어 있는지 확인

### 결제 검증 실패

1. **개발 환경**
   - 현재는 항상 성공으로 처리됨
   - 서버 로그 확인: `결제 검증 요청: { imp_uid, merchant_uid, amount }`

2. **운영 환경**
   - 포트원 REST API 연동 필요
   - `src/routes/payments.js` 파일의 주석 처리된 코드 활성화

## 📊 데이터베이스 확인

### 예약 데이터 확인
```sql
SELECT 
  resv_idx,
  mem_idx,
  veh_idx,
  main_option,
  mid_option,
  imp_uid,
  merchant_uid,
  payment_amount,
  date,
  time,
  contract_yn,
  created_date
FROM reservations
ORDER BY created_date DESC;
```

### 결제 정보가 저장되었는지 확인
```sql
SELECT 
  resv_idx,
  imp_uid,
  merchant_uid,
  payment_amount
FROM reservations
WHERE imp_uid IS NOT NULL;
```

## ✅ 체크리스트

- [ ] 백엔드 서버가 정상 실행됨
- [ ] `/api/health` 엔드포인트 응답 확인
- [ ] `/api/payments/verify` 엔드포인트 동작 확인
- [ ] Flutter 앱에서 서버 연결 확인
- [ ] 결제 플로우 테스트 완료
- [ ] 예약 저장 시 결제 정보 포함 확인
- [ ] 예약 목록에서 결제 정보 확인

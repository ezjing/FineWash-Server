# FineWash Server

출장세차 앱 백엔드 API 서버입니다.

---

## 📁 프로젝트 구조

```
FineWash-Server/
├── src/
│   ├── index.js              # 서버 진입점
│   ├── controllers/          # 컨트롤러 (비즈니스 로직)
│   ├── middleware/           # 미들웨어
│   │   └── auth.js           # JWT 인증 미들웨어
│   ├── models/               # MongoDB 모델
│   │   ├── Booking.js        # 예약
│   │   ├── Product.js        # 상품
│   │   ├── User.js           # 사용자
│   │   ├── Vehicle.js        # 차량
│   │   └── WashLocation.js   # 세차 위치
│   └── routes/               # API 라우트
│       ├── auth.js           # 인증 API
│       ├── bookings.js       # 예약 API
│       ├── locations.js      # 위치 API
│       ├── products.js       # 상품 API
│       ├── users.js          # 사용자 API
│       └── vehicles.js       # 차량 API
├── .env                      # 환경 설정 (현재 사용)
├── .env.development          # 개발 환경 설정
├── .env.production           # 운영 환경 설정
├── .gitignore                # Git 제외 파일
└── package.json              # 의존성 관리
```

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 설정

`.env.development` 또는 `.env.production` 파일을 복사하여 `.env` 파일 생성:

```bash
# 개발 환경
cp .env.development .env

# 또는 운영 환경
cp .env.production .env
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon - 파일 변경 시 자동 재시작)
npm run dev

# 개발 모드 + 환경변수 설정
npm run dev:watch

# 개발 환경으로 실행 (.env.development 복사 후 실행)
npm run start:dev

# 운영 환경으로 실행 (.env.production 복사 후 실행)
npm run start:prod

# 운영 모드
npm run prod

# 기본 실행
npm start
```

서버는 `http://localhost:3000`에서 실행됩니다.

---

## ⚙️ 환경 변수

### 개발 환경 (.env.development)

```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finewash_dev
JWT_SECRET=dev-secret-key-for-local-development-only
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug
CORS_ORIGIN=*
```

### 운영 환경 (.env.production)

```bash
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db/finewash_prod
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING  # ⚠️ 반드시 변경!
JWT_EXPIRES_IN=1d
LOG_LEVEL=error
CORS_ORIGIN=https://your-app-domain.com
```

---

## 📡 API 엔드포인트

### 인증 (Auth)

| 메소드 | 경로               | 설명             |
| ------ | ------------------ | ---------------- |
| POST   | `/api/auth/signup` | 회원가입         |
| POST   | `/api/auth/login`  | 로그인           |
| GET    | `/api/auth/me`     | 현재 사용자 정보 |

### 사용자 (Users)

| 메소드 | 경로                  | 설명          |
| ------ | --------------------- | ------------- |
| PUT    | `/api/users/profile`  | 프로필 수정   |
| PUT    | `/api/users/password` | 비밀번호 변경 |

### 차량 (Vehicles)

| 메소드 | 경로                | 설명           |
| ------ | ------------------- | -------------- |
| GET    | `/api/vehicles`     | 차량 목록 조회 |
| POST   | `/api/vehicles`     | 차량 등록      |
| PUT    | `/api/vehicles/:id` | 차량 수정      |
| DELETE | `/api/vehicles/:id` | 차량 삭제      |

### 예약 (Bookings)

| 메소드 | 경로                       | 설명           |
| ------ | -------------------------- | -------------- |
| GET    | `/api/bookings`            | 예약 목록 조회 |
| GET    | `/api/bookings/:id`        | 예약 상세 조회 |
| POST   | `/api/bookings`            | 예약 생성      |
| PUT    | `/api/bookings/:id/cancel` | 예약 취소      |

### 상품 (Products)

| 메소드 | 경로                | 설명      |
| ------ | ------------------- | --------- |
| GET    | `/api/products`     | 상품 목록 |
| GET    | `/api/products/:id` | 상품 상세 |

### 세차 위치 (Locations)

| 메소드 | 경로                 | 설명        |
| ------ | -------------------- | ----------- |
| GET    | `/api/locations`     | 위치 목록   |
| GET    | `/api/locations/:id` | 위치 상세   |

---

## 🛠 기술 스택

- **Express.js** - 웹 프레임워크
- **MongoDB + Mongoose** - 데이터베이스
- **JWT (jsonwebtoken)** - 인증
- **bcryptjs** - 비밀번호 암호화
- **express-validator** - 입력 검증
- **dotenv** - 환경 변수 관리
- **cors** - CORS 설정
- **nodemon** - 개발 시 자동 재시작

---

## ⚠️ 운영 배포 전 체크리스트

- [ ] `JWT_SECRET`: 최소 32자 이상 랜덤 문자열로 변경
- [ ] `MONGODB_URI`: 실제 운영 DB 주소로 변경
- [ ] `CORS_ORIGIN`: 실제 앱 도메인으로 변경

---

## 📄 라이선스

MIT License


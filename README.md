# FineWash Server

출장세차 앱 백엔드 API 서버입니다.

---

## 📁 프로젝트 구조

```
FineWash-Server/
├── src/
│   ├── app.js                # Express 앱 생성/라우팅 wiring
│   ├── server.js             # 서버 실행 + DB 연결
│   ├── config/              # DB/환경 설정 모듈
│   ├── controllers/         # 컨트롤러 (요청/응답 처리)
│   ├── services/            # 서비스(비즈니스 로직 + DB 호출)
│   ├── models/              # Sequelize 모델/association
│   ├── routes/              # API 라우트 (URL → Controller 연결)
│   ├── middlewares/         # 인증/에러 공통 미들웨어
│   └── utils/               # 공통 유틸
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

# 개발 환경으로 실행 (.env 에 자동 복사)
npm run start:dev

# 운영 환경으로 실행 (.env 에 자동 복사)
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
# 서버 설정
PORT=3000
NODE_ENV=development

# SQLite 데이터베이스 (선택, 미설정 시 프로젝트 루트에 database.sqlite 생성)
# DB_PATH=./database.sqlite

# JWT 설정
JWT_SECRET=dev-secret-key-for-local-development-only
JWT_EXPIRES_IN=7d

# 기타 설정
LOG_LEVEL=debug
CORS_ORIGIN=*
```

### 운영 환경 (.env.production)

```bash
# 서버 설정
PORT=3000
NODE_ENV=production

# SQLite 데이터베이스 (선택)
# DB_PATH=./database.sqlite

# JWT 설정
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING  # ⚠️ 반드시 변경!
JWT_EXPIRES_IN=1d

# 기타 설정
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

### 사용자 (Members)
| 메소드 | 경로                  | 설명          |
| ------ | --------------------- | ------------- |
| PUT    | `/api/members/profile`  | 프로필 수정   |
| PUT    | `/api/members/password` | 비밀번호 변경 |

### 차량 (Vehicles)
| 메소드 | 경로                | 설명           |
| ------ | ------------------- | -------------- |
| GET    | `/api/vehicles`     | 차량 목록 조회 |
| POST   | `/api/vehicles`     | 차량 등록      |
| PUT    | `/api/vehicles/:id` | 차량 수정      |
| DELETE | `/api/vehicles/:id` | 차량 삭제      |

### 예약 (Reservations)
| 메소드 | 경로                       | 설명           |
| ------ | -------------------------- | -------------- |
| GET    | `/api/reservations`       | 예약 목록 조회 |
| GET    | `/api/reservations/:id`  | 예약 상세 조회 |
| POST   | `/api/reservations`       | 예약 생성      |
| PUT    | `/api/reservations/:id/cancel` | 예약 취소 |

### 상품 (Products)
| 메소드 | 경로                       | 설명 |
| ------ | -------------------------- | ---- |
| GET    | `/api/products`           | 상품 목록 |
| GET    | `/api/products/:id`      | 상품 상세 |
| GET    | `/api/products/category/:category` | 카테고리별 상품 |

### 사업장/룸 (Businesses)
| 메소드 | 경로                         | 설명 |
| ------ | ---------------------------- | ---- |
| POST   | `/api/businesses`            | 사업장 등록(MST) |
| PUT    | `/api/businesses/:busMstIdx` | 사업장 수정(MST) |
| GET    | `/api/businesses`           | 사업장 목록(MST) |
| GET    | `/api/businesses/:id`       | 사업장 상세(MST + DTL) |
| GET    | `/api/businesses/rooms/:busDtlIdx` | 룸 상세(DTL + 예약) |
| POST   | `/api/businesses/rooms`    | 룸 추가(DTL) |
| PUT    | `/api/businesses/rooms/:busDtlIdx` | 룸 수정(DTL) |
| DELETE | `/api/businesses/rooms/:busDtlIdx` | 룸 삭제(DTL) |

### 결제 검증 (Payments)
| 메소드 | 경로                  | 설명 |
| ------ | --------------------- | ---- |
| POST   | `/api/payments/verify` | 포트원 결제 검증 |

### 세차 옵션 (Wash Options)
| 메소드 | 경로                               | 설명 |
| ------ | ---------------------------------- | ---- |
| GET    | `/api/wash-options/masters`      | MST 목록 조회 |
| POST   | `/api/wash-options/masters`      | MST 저장(신규) |
| PUT    | `/api/wash-options/masters/:woptMstIdx` | MST 저장(수정) |
| GET    | `/api/wash-options/details`      | DTL 목록 조회 |
| POST   | `/api/wash-options/details`      | DTL 저장(신규) |
| PUT    | `/api/wash-options/details/:woptDtlIdx` | DTL 저장(수정) |

---

## 🛠 기술 스택

- **Express.js** - 웹 프레임워크
- **SQLite + Sequelize** - 데이터베이스 (운영 시 MySQL 사용 가능, `src/models/index.js` 주석 참고)
- **JWT (jsonwebtoken)** - 인증
- **bcryptjs** - 비밀번호 암호화
- **express-validator** - 입력 검증
- **dotenv** - 환경 변수 관리
- **cors** - CORS 설정
- **nodemon** - 개발 시 자동 재시작

---

## ⚠️ 운영 배포 전 체크리스트

- [ ] `JWT_SECRET`: 최소 32자 이상 랜덤 문자열로 변경
- [ ] `DB_PATH`: 운영 환경에서 SQLite 파일 경로 설정 (SQLite 사용 시)
- [ ] MySQL 사용 시: `src/models/index.js`에서 MySQL 블록 주석 해제 후 `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` 등 설정
- [ ] `CORS_ORIGIN`: 실제 앱 도메인으로 변경

---

## 📄 라이선스

MIT License

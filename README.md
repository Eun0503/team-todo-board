# Team Todo Board

팀원들이 다 함께 목표를 공유하고 진행 상황을 파악할 수 있는 공용 투두 어플리케이션입니다. 

---

## 🛠️ 기술 스택

- **Frontend**: Next.js (App Router), TailwindCSS, Playwright (E2E Test)
- **Backend**: FastAPI, SQLite
- **DevOps**: Docker, Docker Compose, GitHub Actions (Self-Hosted), ngrok

---

## 💻 주요 기능

1. **실시간 상태 동기화**: 추가/수정/삭제/완료 상태 변경 시 다른 팀원들에게도 반영됩니다.
2. **주간 캘린더 네비게이션**: 이번 주의 날짜별 일정과 등록된 투두 개수를 직관적으로 조회할 수 있습니다.
3. **상태별 필터링**: 전체, 진행 중, 완료 탭을 통해 원하는 투두만 필터링하여 확인이 가능합니다.

---

## 🚀 배포 및 CI/CD 파이프라인

본 프로젝트는 GitHub Actions와 Docker를 활용한 3단계 자동화 파이프라인이 구축되어 있습니다.

### 1. CI (지속적 통합 및 테스트)
`main` 브랜치에 코드가 푸시되면 다음의 검증 과정을 거칩니다.
- **Build & Lint Check**: 백엔드 및 프론트엔드의 도커 이미지를 빌드하고 코드 컨벤션(ESLint)을 검증합니다.
- **E2E Test (Playwright)**: 테스트 전용 격리 환경(`docker-compose.test.yml`)을 띄워, 주요 CRUD 기능(추가, 완료, 수정, 날짜 이동, 삭제)이 정상 동작하는지 UI 자동화 테스트를 수행합니다. 

### 2. CD (지속적 배포)
- CI 단계의 모든 테스트를 통과한 코드에 한해 실제 운영 서버 컨테이너를 재시작하여 업데이트를 배포합니다.
- 테스트 환경과 운영 환경을 분리하여 서비스의 안정성을 보장합니다.
- Docker Named Volume을 사용하여 배포 중에도 데이터베이스가 초기화되지 않고 안전하게 보존됩니다.

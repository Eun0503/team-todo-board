# 카카오 테크 캠퍼스 3단계 3차 과제 - Weekly Todo Planner

Next.js (App Router)와 FastAPI, SQLite 데이터베이스를 연동하여 구현한 주간 투두 플래너(Weekly Todo Planner) 프로젝트입니다.

---

## 🚀 주요 구현 기능

### 1. 주간 캘린더 및 일별 투두 조회
- 주간 네비게이터를 통해 요일별 날짜 카드를 선택하여 해당 날짜의 할 일을 조회합니다.
- 각 요일별로 등록된 투두의 총 개수가 실시간 뱃지로 동기화됩니다.

### 2. 인라인 CRUD 및 유효성 검증
- **추가**: 입력창에 텍스트를 입력하여 할 일을 간편하게 등록합니다. 빈 값 등록 시 에러 메시지가 인풋 블록 하단에 노출됩니다.
- **수정**: 수정 버튼 클릭 시 인라인 에디팅 모드로 전환되며, 수정 빈 값 체크 및 Esc/Enter 키보드 동작을 완벽히 지원합니다.
- **토글 및 삭제**: 완료 토글(완료/해제) 및 삭제 동작을 비동기 API 연동으로 매끄럽게 처리합니다.

### 3. 필터링 및 로딩/에러 처리
- 전체, 진행 중, 완료 필터 탭을 눌러 원하는 상태의 투두만 조회할 수 있습니다.
- Next.js의 `error.tsx`와 `loading.tsx` 규격을 준수하여 예외 상황 핸들링 및 스켈레톤 UI 로딩 상태를 제공합니다.

---

## 🛠️ 실행 방법

### 1. 백엔드 실행 (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. 프론트엔드 실행 (Next.js)
```bash
cd frontend
npm install
npm run dev
```
프론트엔드 구동 후 [http://localhost:3000](http://localhost:3000)으로 접속하면 `/todos`로 자동 이동하며 실행됩니다.

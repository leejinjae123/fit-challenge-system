# Fit Challenge 고도화 기록 - 2026-06-25

중단 시각: 2026-06-25 18:52:31 KST

중단 사유: 주간 토큰 잔량 퍼센트는 도구에서 확인할 수 없지만, 현재 작업 목표의 토큰 사용량이 크게 증가해 30% 보호 조건에 맞춰 정지했다.

## 완료한 고도화

- Planfit 공개 화면을 참고해 프론트 전역 테마를 다크 차콜 + 민트 CTA 중심으로 재구성했다.
- 홈 화면을 오늘 루틴, 운동 수, 예상 시간, 완료 기록이 바로 보이는 운동 앱형 화면으로 정리했다.
- 운동 선택 모달을 바텀시트 스타일로 바꾸고, 검색/필터/세트/횟수 입력/선택 상태를 한 화면에서 다루도록 개선했다.
- 운동 카드에 레벨, 운동 유형, 자극 부위 라벨을 함께 표시하도록 개선했다.
- 검색/필터 변경 시 운동 목록 API가 중복 호출되던 흐름을 제거했다.
- 로그인, 온보딩, 통계, 내 정보, 히스토리 화면의 깨진 한글 UI 문구를 정리하고 같은 다크 테마로 맞췄다.
- 온보딩 완료 후 기존 로그인 API를 재사용해 `userId`가 로컬에 저장되도록 수정했다.
- 운동 예시 이미지를 로컬 SVG 8종으로 교체했다: 전신, 하체, 어깨, 등, 코어, 가슴, 팔, 유산소.
- SVG는 회색 3D 인체 느낌, 민트색 자극 부위 강조, 간단한 반복 애니메이션을 포함한다.
- 운동 DB seed가 기존 깨진 데이터를 계속 유지하지 않도록 `INSERT IGNORE`를 upsert 방식으로 바꿨다.
- 기존 로컬 DB의 운동명/설명/공통코드명이 다시 한글로 복구되도록 seed를 조정했다.

## 검증

- `docker compose -f docker-compose.yml -f docker-compose.local.yml config --quiet` 통과.
- `docker compose -f docker-compose.yml -f docker-compose.local.yml build frontend` 성공.
- `docker compose -f docker-compose.yml -f docker-compose.local.yml build challenge-service` 성공.
- 가입 -> 로그인 -> 내 정보 조회 API 흐름 검증 성공.
- 운동 목록 API에서 한글 운동명과 `/exercise-demos/*.svg` 경로가 정상 반환됨을 확인.
- MySQL 내부 운동 seed 데이터가 UTF-8 한글로 저장됨을 확인.
- Docker Desktop 기준 frontend, gateway, auth, challenge, ai, mysql, redis, kafka, zookeeper 컨테이너 실행 확인.

## 남은 고도화 후보

- 실제 브라우저 클릭 테스트로 온보딩부터 운동 추가까지 한 번에 확인.
- 운동 완료 카드에 운동 이미지 썸네일을 연결하려면 `WorkoutRecord`에 `exerciseId`를 저장하도록 스키마를 넓히기.
- Docker/운영용 민감정보는 `.env` 기반으로 더 분리하기.
- 깨진 주석이 남아 있는 백엔드 파일은 기능 변경 없이 별도 정리하기.
- 프론트 컴포넌트가 커졌으므로, 다음 작업 때만 필요한 만큼 작은 컴포넌트로 분리하기.

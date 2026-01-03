[제작 중] AI 기반 운동 루틴 추천 및 챌린지 시스템 (Fit Challenge System)

■ 프로젝트 접속 주소: http://fitchallenge.duckdns.org:13000
■ 개발 상태: 진행 중

1. 프로젝트 개요
본 프로젝트는 현대인의 올바른 홈 트레이닝을 돕기 위해 사용자 맞춤형 AI 운동 루틴 추천과 게이미피케이션(챌린지) 요소를 결합한 마이크로서비스 아키텍처(MSA) 기반 웹 서비스입니다.

2. 핵심 기술 역량 및 문제 해결 사례

[Infrastructure] 온프레미스 서버 인프라 직접 구축 및 운영
- 외부 클라우드 도움 없이 직접 리눅스 서버 환경을 구축하고, DuckDNS와 포트 포워딩을 통해 안정적인 외부 접속 환경을 마련했습니다. Nginx 리버스 프록시 설정을 통해 보안과 라우팅 효율성을 높였습니다.

[Architecture] MSA 기반의 확장성 있는 시스템 설계
- 서비스 간 결합도를 낮추기 위해 Microservices Architecture를 도입하고, Spring Cloud Gateway를 통해 통합 진입점을 구축했습니다. 이를 통해 서비스별 독립적인 배포 및 확장이 가능한 구조를 실현했습니다.

[Concurrency] Redis 분산 락을 이용한 데이터 정합성 보장
- 다수의 사용자가 동시에 참여하는 챌린지 인원 제한 및 포인트 적립 로직에서 발생할 수 있는 동시성 이슈(Race Condition)를 Redis(Redisson) 분산 락으로 해결하여 데이터 무결성을 보장했습니다.

[Event-Driven] Kafka를 통한 실시간 비동기 데이터 처리
- 사용자 운동 데이터 및 루틴 추천 정보를 Kafka 이벤트 스트림으로 처리하여 백엔드 서버의 부하를 분산시켰으며, 시스템 간 비동기 통신으로 대량의 데이터를 안정적으로 처리할 수 있는 환경을 구축했습니다.

[DevOps] CI/CD 자동화 및 효율적인 운영 환경 구축
- GitHub Actions, Docker Hub, Watchtower를 연동하여 코드 푸시부터 서버 배포까지 전 과정을 자동화했습니다. 이를 통해 개발 생산성을 높이고 중단 없는 서비스 업데이트 환경을 구축했습니다.

3. 주요 기능
- AI 기반 운동 루틴 추천: 사용자 신체 지표 및 기록 분석을 통한 맞춤형 루틴 추천 (개발 진행 중)
- 챌린지 시스템: 선착순 참여 및 실시간 보상 지급 (분산 락 적용)
- 운동 기록 및 통계: 체계적인 운동 기록 관리 및 개인별 맞춤형 대시보드
- 온보딩 시스템: 사용자별 운동 목표 설정 및 포인트 기반 동기부여

4. 사용 기술 스택
- Backend: Java 17, Spring Boot 3.2, JPA, Spring Security, Spring Cloud Gateway
- AI: Python 3.9, Flask (루틴 추천 엔진 개발 중)
- Frontend: React.js, Nginx
- Infra: Self-Hosted Linux Server, Docker, Kafka, Redis, MySQL 8.0, GitHub Actions

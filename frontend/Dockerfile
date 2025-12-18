# Stage 1: 프론트엔드 React 애플리케이션 빌드 스테이지
# Node.js 환경에서 리소스를 빌드하여 정적 파일을 생성합니다.
FROM node:18-alpine AS build
WORKDIR /app

# 의존성 설치 (package.json과 lock 파일을 먼저 복사하여 빌드 캐시 활용)
COPY package.json .
COPY package-lock.json* ./
RUN npm install

# 소스 코드 복사 및 프로덕션 빌드 수행
COPY . .
RUN npm run build

# Stage 2: 정적 파일 서빙 스테이지
# 빌드된 결과물을 Nginx를 통해 외부에 제공합니다.
FROM nginx:alpine

# 빌드 스테이지에서 생성된 정적 파일들을 Nginx 웹 루트로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 프로젝트 전용 Nginx 설정 파일 적용
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 80번 포트 개방 및 Nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

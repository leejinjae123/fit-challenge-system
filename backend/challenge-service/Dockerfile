# Stage 1: 애플리케이션 빌드 스테이지
# Maven과 JDK 17을 사용하여 소스 코드를 빌드하고 JAR 파일을 생성합니다.
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .

# Maven 빌드 시 메모리 부족(OOM) 방지를 위한 최대 힙 메모리 설정
ENV MAVEN_OPTS="-Xmx1024m"

# 테스트 코드를 제외하고 패키징 수행하여 빌드 속도 최적화
RUN mvn clean package -Dmaven.test.skip=true

# Stage 2: 실행 전용 스테이지
# 경량화된 JRE 환경(Alpine Linux)에서 빌드된 결과물만 실행합니다.
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 빌드 스테이지에서 생성된 JAR 파일만 복사하여 이미지 크기를 최소화
COPY --from=build /app/target/*.jar app.jar

# 애플리케이션 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]

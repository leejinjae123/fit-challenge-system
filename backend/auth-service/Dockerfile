FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
# 의존성 미리 다운로드 (레이어 캐싱 활용)
RUN mvn dependency:go-offline
COPY src ./src
# 테스트 컴파일 아예 건너뛰기 (속도 향상 및 오류 방지)
RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

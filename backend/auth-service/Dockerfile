FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
# 테스트 컴파일 아예 건너뛰기 (속도 향상 및 오류 방지)
RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

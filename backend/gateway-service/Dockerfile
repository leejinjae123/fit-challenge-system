FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
# 소스 전체 복사
COPY . .
# 테스트 없이 패키징 (가장 안전한 방식)
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
# Maven 메모리 제한 설정
ENV MAVEN_OPTS="-Xmx1024m"
RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

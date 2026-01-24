FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY Placement_Tracker-0.0.1-SNAPSHOT.jar app.jar
COPY uploads /app/uploads

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=local-prod

ENTRYPOINT ["java", "-jar", "app.jar"]

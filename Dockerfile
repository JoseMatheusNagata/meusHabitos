# 1. Etapa de Build: Usa o Maven com Java 21 para compilar o projeto
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
# Compila o projeto e ignora os testes para ser mais rápido
RUN mvn clean package -DskipTests

# 2. Etapa de Execução: Usa um Java 21 levezinho apenas para rodar a aplicação
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copia o ficheiro .jar gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Liberta a porta 8080
EXPOSE 8080
# Comando para iniciar o seu Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
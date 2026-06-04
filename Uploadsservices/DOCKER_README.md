# Docker Setup for Uploadsservices Spring Boot Application

## Overview
This document provides instructions for building and running the Uploadsservices application in Docker containers.

## Files Created
- **Dockerfile**: Multi-stage build for the Spring Boot application
- **docker-compose.yml**: Orchestration file for all services (MySQL, Kafka, Ollama, App)
- **.dockerignore**: Excludes unnecessary files from the build context

## Prerequisites
- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- At least 4GB of free disk space
- 2GB+ RAM available for containers

## Quick Start

### Option 1: Run with Docker Compose (Recommended)
This is the easiest way to run the entire stack with all dependencies.

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Remove volumes (warning: this deletes data)
docker-compose down -v
```

### Option 2: Build and Run Manually

#### 1. Build the Docker Image
```bash
docker build -t uploadsservices:latest .
```

#### 2. Run the Container
```bash
docker run -d \
  --name uploadsservices-app \
  -p 6002:6002 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/resume_db" \
  -e SPRING_DATASOURCE_USERNAME="root" \
  -e SPRING_DATASOURCE_PASSWORD="3564" \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS="localhost:9092" \
  -e SPRING_AI_OLLAMA_BASE_URL="http://host.docker.internal:11434" \
  uploadsservices:latest
```

## Environment Variables

You can customize the following environment variables:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/resume_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=3564

# Kafka Configuration
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:29092

# Ollama (LLM) Configuration
SPRING_AI_OLLAMA_BASE_URL=http://ollama:11434

# JVM Configuration
JAVA_OPTS=-Xmx512m -Xms256m
```

## Accessing the Application

- **Application URL**: http://localhost:6002
- **Health Check**: http://localhost:6002/actuator/health
- **MySQL**: localhost:3306 (from host machine)
- **Kafka**: localhost:9092 (from host machine)
- **Ollama**: http://localhost:11434

## Docker Compose Services

### mysql
- **Port**: 3306
- **Username**: root
- **Password**: 3564
- **Database**: resume_db
- **Data Volume**: mysql_data

### zookeeper
- **Port**: 2181
- **Required for**: Kafka coordination

### kafka
- **External Port**: 9092
- **Internal Port**: 29092
- **Topics**: Auto-created based on application needs

### ollama
- **Port**: 11434
- **Models**: qwen2.5:1.5b (pulled on first run)
- **Data Volume**: ollama_data

### app (Spring Boot Application)
- **Port**: 6002
- **Depends on**: MySQL, Kafka, Ollama
- **Health Check**: Enabled

## Common Commands

```bash
# View running containers
docker ps

# View container logs
docker logs uploadsservices-app

# Follow container logs in real-time
docker logs -f uploadsservices-app

# Execute command inside container
docker exec -it uploadsservices-app sh

# Stop a container
docker stop uploadsservices-app

# Remove a container
docker rm uploadsservices-app

# Rebuild image
docker build --no-cache -t uploadsservices:latest .
```

## Troubleshooting

### Application fails to start
1. Check logs: `docker logs uploadsservices-app`
2. Verify MySQL is running: `docker ps | grep mysql`
3. Check database connectivity: `docker exec uploadsservices-app curl http://localhost:6002/actuator/health`

### Database connection errors
```bash
# Verify MySQL container is healthy
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test connection
docker exec mysql mysql -uroot -p3564 -e "SELECT 1"
```

### Kafka connection issues
```bash
# Check Kafka logs
docker-compose logs kafka

# Test connection from app
docker exec uploadsservices-app kafka-console-consumer --bootstrap-servers kafka:29092 --list
```

### Memory issues
Increase memory in docker-compose.yml:
```yaml
services:
  app:
    environment:
      JAVA_OPTS: "-Xmx1024m -Xms512m"
```

## Production Recommendations

1. **Use health checks**: Already configured in Dockerfile
2. **Resource limits**: Add in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
       reservations:
         cpus: '0.5'
         memory: 512M
   ```

3. **Volume backups**: Regularly backup MySQL data volume
4. **Security**: Change default passwords in production
5. **Logging**: Configure centralized logging (ELK, Splunk, etc.)
6. **Monitoring**: Use Docker stats or Prometheus/Grafana

## Performance Tuning

### JVM Heap Size
Adjust in `docker-compose.yml`:
```yaml
environment:
  JAVA_OPTS: "-Xmx1024m -Xms512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### Database Connection Pool
Configure in `application.properties`:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything (careful!)
docker system prune -a
```

## Support

For issues or questions, check:
- Application logs: `docker-compose logs app`
- Dockerfile documentation
- Spring Boot documentation: https://spring.io/
- Docker documentation: https://docs.docker.com/

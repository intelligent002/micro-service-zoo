docker kill fastapi
docker rm fastapi
docker build -t fastapi .
docker run -p 8001:8001 fastapi

docker kill fastapi
docker rm fastapi
docker build -t fastapi .
docker run -e DB_USERNAME=root -e DB_PASSWORD=007 -e DB_HOSTNAME=mysql-master.intel.r7g.org -e DB_DATABASE=laravel_test -p 8001:8001 --name fastapi fastapi

docker network create \
  --driver overlay \
  --attachable \
  --subnet 172.30.1.0/24 \
  --gateway 172.30.1.1 \
  zoo
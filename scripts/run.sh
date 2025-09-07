cd ../docker
sudo systemctl start docker
docker compose up -d
concurrently "cd ../frontend && pnpm dev" "cd ../backend && pnpm start:dev"

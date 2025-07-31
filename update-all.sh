#!/bin/bash

echo "git pull"
git pull

echo "🚀 Starting update process..."

# Track job info
declare -A job_logs
declare -A job_status

# Helper to run a job in background
run_job() {
  local name="$1"
  local cmd="$2"
  local log_file="./update-${name}.log"
  job_logs["$name"]="$log_file"

  echo "▶️ $name started..."
  bash -c "$cmd" >"$log_file" 2>&1 \
    && {
      echo "✅ $name completed successfully"
      rm -f "$log_file"
    } || {
      echo "❌ $name failed. See log: $log_file"
      job_status["$name"]=1
    } &
}

# Start all jobs
run_job "zoo-php-laravel" "cd zoo-php-laravel && composer update"
run_job "zoo-python-fastapi" "cd zoo-python-fastapi && ./update-all.sh"
run_job "zoo-python-flask" "cd zoo-python-flask && ./update-all.sh"
run_job "zoo-typescript-angular" "cd zoo-typescript-angular && npm update"
run_job "zoo-typescript-react" "cd zoo-typescript-react && npm update"

# Wait for all background jobs
wait

# Final summary
if [ ${#job_status[@]} -eq 0 ]; then
  echo "🎉 All dependencies updated successfully!"
else
  echo "⚠️ Some updates failed:"
  for name in "${!job_status[@]}"; do
    echo "  - ❌ $name (log: ${job_logs[$name]})"
  done
  exit 1
fi

echo "git commit"
git add *
git commit -m "updates"
git push
#!/bin/bash
cd /share/CACHEDEV3_DATA/share/Container/acceptance-test-dashboard

echo "Enter your GitHub Personal Access Token:"
read -s TOKEN

# Use HTTPS with embedded token for one push
docker run --rm -v "$(pwd):/repo" -w /repo alpine/git remote set-url origin "https://panhandleav-hub:$TOKEN@github.com/panhandleav-hub/acceptance-dashboard.git"
docker run --rm -v "$(pwd):/repo" -w /repo alpine/git push -u origin main
docker run --rm -v "$(pwd):/repo" -w /repo alpine/git remote set-url origin "https://github.com/panhandleav-hub/acceptance-dashboard.git"

echo "Push complete, token removed from config"

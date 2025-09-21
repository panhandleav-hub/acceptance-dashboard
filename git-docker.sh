#!/bin/bash
PROJECT_DIR="/share/CACHEDEV3_DATA/share/Container/acceptance-test-dashboard"
cd "$PROJECT_DIR"
docker run --rm \
  -v "$PROJECT_DIR:/repo" \
  -v ~/.ssh:/root/.ssh:ro \
  -w /repo \
  alpine/git sh -c "git config --global --add safe.directory /repo && git $*"

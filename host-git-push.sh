#!/bin/bash
# Use host git with SSH - bypassing Docker entirely

# Add files and commit
git add .
git commit -m "QNAP production update: $(date)"

# Push using host SSH (which works)
git push -u origin main

echo "Push completed using host SSH"

#!/bin/bash
cd /share/CACHEDEV3_DATA/share/Container/acceptance-test-dashboard

# Create dated backup
tar --exclude='.git' --exclude='logs' --exclude='node_modules' -czf "../dashboard-backup-$(date +%Y%m%d-%H%M%S).tar.gz" .

echo "Backup created for GitHub upload"
echo "File location: /share/CACHEDEV3_DATA/share/Container/dashboard-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "Download via File Station and upload to GitHub"

# Restart container if needed
docker restart acceptance-dashboard

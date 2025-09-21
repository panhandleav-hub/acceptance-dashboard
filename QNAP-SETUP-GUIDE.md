# QNAP TS-835A Container Station Setup Guide
## Acceptance Test Dashboard Deployment

### 🎯 Overview
This guide will help you deploy the Vue.js Acceptance Test Dashboard on your QNAP TS-835A NAS using Container Station with Git synchronization.

---

## 📋 Prerequisites

### QNAP Requirements
- [ ] QNAP TS-835A with QTS 5.0+ 
- [ ] Container Station installed and running
- [ ] Git Server (optional, for synchronization)
- [ ] Sufficient storage space (minimum 2GB free)
- [ ] Port 8080 available

### Local Development (Optional)
- [ ] Node.js 18+ 
- [ ] npm or yarn
- [ ] Git client

---

## 🚀 Deployment Methods

### Method 1: Direct Upload (Recommended for first deployment)

#### Step 1: Prepare Project Files
1. **Upload to QNAP**:
   ```bash
   # Create project directory on QNAP shared folder
   mkdir -p /share/CACHEDEV1_DATA/Container/acceptance-dashboard
   
   # Upload all project files to this directory
   # Files should include:
   # - Dockerfile
   # - docker-compose.yml
   # - nginx.conf
   # - package.json
   # - src/ directory
   # - All other project files
   ```

#### Step 2: Deploy via Container Station
1. **Open Container Station** web interface
2. **Navigate to Applications** → **Create**
3. **Select "Create Application"**
4. **Choose "Upload docker-compose.yml file"**
5. **Upload** the `docker-compose.yml` from your project directory
6. **Configure Application**:
   - Application Name: `acceptance-dashboard`
   - Resource Limits: CPU 1 core, Memory 512MB (minimum)
   - Port Mapping: Host Port 8080 → Container Port 80
7. **Click Deploy**

#### Step 3: Verify Deployment
```bash
# Check application status
curl http://[QNAP_IP]:8080

# Or use the provided health check script
./health-check.sh [QNAP_IP] 8080
```

---

### Method 2: Git Synchronization (Recommended for ongoing development)

#### Step 1: Setup Git Server on QNAP
1. **Install Git Server** (if not already installed):
   - App Center → Search "Git Server" → Install
   - Enable Git Server in Control Panel → Applications

2. **Create Repository**:
   ```bash
   # SSH into QNAP
   ssh admin@[QNAP_IP]
   
   # Create git repository
   mkdir -p /share/CACHEDEV1_DATA/git/acceptance-dashboard.git
   cd /share/CACHEDEV1_DATA/git/acceptance-dashboard.git
   git init --bare
   ```

#### Step 2: Setup Local Repository
```bash
# Initialize local git repository
cd acceptance-test-dashboard
git init
git add .
git commit -m "Initial commit"

# Add QNAP remote
git remote add qnap ssh://admin@[QNAP_IP]/share/CACHEDEV1_DATA/git/acceptance-dashboard.git

# Push to QNAP
git push qnap main
```

#### Step 3: Setup Auto-Deploy Hook
Create a post-receive hook on QNAP:

```bash
# SSH into QNAP
ssh admin@[QNAP_IP]

# Create post-receive hook
cat > /share/CACHEDEV1_DATA/git/acceptance-dashboard.git/hooks/post-receive << 'EOF'
#!/bin/bash
PROJECT_DIR="/share/CACHEDEV1_DATA/Container/acceptance-dashboard"
GIT_DIR="/share/CACHEDEV1_DATA/git/acceptance-dashboard.git"

echo "Deploying acceptance-dashboard..."

# Create/update project directory
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Checkout latest code
git --git-dir=$GIT_DIR --work-tree=$PROJECT_DIR checkout -f main

# Rebuild and restart container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Deployment complete!"
EOF

# Make hook executable
chmod +x /share/CACHEDEV1_DATA/git/acceptance-dashboard.git/hooks/post-receive
```

#### Step 4: Test Git Deployment
```bash
# Make a change and push
echo "# Test update" >> README.md
git add README.md
git commit -m "Test auto-deploy"
git push qnap main

# Check deployment
curl http://[QNAP_IP]:8080
```

---

## 🔧 Configuration

### Docker Compose Configuration
The provided `docker-compose.yml` includes:
- **Port mapping**: 8080:80
- **Health checks**: Automatic container monitoring
- **Restart policy**: Automatic restart on failure
- **Network isolation**: Dedicated bridge network
- **Resource optimization**: Multi-stage build for smaller image

### Nginx Configuration
- **SPA routing**: Handles Vue.js client-side routing
- **Gzip compression**: Optimized content delivery
- **Security headers**: Basic security improvements
- **Static asset caching**: Improved performance

### Environment Variables (Optional)
Create `.env` file for custom configuration:
```env
# Port configuration
HOST_PORT=8080
CONTAINER_PORT=80

# Environment
NODE_ENV=production

# Custom domain (if using reverse proxy)
DOMAIN=dashboard.local
```

---

## 🎛️ Management Commands

### Container Management
```bash
# SSH into QNAP
ssh admin@[QNAP_IP]
cd /share/CACHEDEV1_DATA/Container/acceptance-dashboard

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Stop application
docker-compose down

# Start application
docker-compose up -d

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup and Restore
```bash
# Backup application data
tar -czf acceptance-dashboard-backup-$(date +%Y%m%d).tar.gz \
  /share/CACHEDEV1_DATA/Container/acceptance-dashboard

# Restore from backup
tar -xzf acceptance-dashboard-backup-YYYYMMDD.tar.gz -C /
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to create application" Error
**Cause**: Missing Docker files or invalid configuration
**Solution**: 
- Ensure all Docker files are present (Dockerfile, docker-compose.yml, nginx.conf)
- Verify docker-compose.yml syntax
- Check port availability

#### 2. "Version is obsolete" Error  
**Cause**: Using deprecated docker-compose version attribute
**Solution**: 
- Use the provided docker-compose.yml (version attribute removed)
- Ensure Container Station is updated

#### 3. Application Not Accessible
**Cause**: Port conflicts or firewall issues
**Solution**:
```bash
# Check if port is in use
netstat -ln | grep :8080

# Check firewall rules
iptables -L | grep 8080

# Test container directly
docker exec -it acceptance-dashboard wget -qO- http://localhost/
```

#### 4. Build Failures
**Cause**: Missing dependencies or insufficient resources
**Solution**:
```bash
# Check build logs
docker-compose logs acceptance-dashboard

# Increase resource limits in Container Station
# Clear Docker cache
docker system prune -a
```

#### 5. Git Sync Issues
**Cause**: SSH authentication or permission problems
**Solution**:
```bash
# Test SSH connection
ssh admin@[QNAP_IP]

# Check git repository permissions
ls -la /share/CACHEDEV1_DATA/git/

# Fix permissions if needed
chown -R admin:administrators /share/CACHEDEV1_DATA/git/
```

---

## 📊 Monitoring and Maintenance

### Health Monitoring
```bash
# Use provided health check script
./health-check.sh [QNAP_IP] 8080

# Manual health check
curl -f http://[QNAP_IP]:8080/health || echo "Application unhealthy"
```

### Log Management
```bash
# View application logs
docker-compose logs -f acceptance-dashboard

# View nginx access logs
tail -f logs/access.log

# View nginx error logs
tail -f logs/error.log
```

### Performance Monitoring
- Monitor CPU and memory usage in Container Station
- Check disk space regularly
- Monitor container restart frequency

---

## 🚀 Updating the Application

### Via Git (Recommended)
```bash
# Local development
git add .
git commit -m "Update description"
git push qnap main
# Auto-deployment happens via post-receive hook
```

### Manual Update
1. Upload new files to QNAP project directory
2. Rebuild container:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

---

## 🔒 Security Considerations

### Network Security
- Use VPN for external access
- Configure firewall rules appropriately
- Consider using reverse proxy (Traefik/nginx)

### Container Security
- Regular updates of base images
- Scan for vulnerabilities
- Limit container resources

### Data Security
- Regular backups
- Secure Git repository access
- Monitor application logs for suspicious activity

---

## 📞 Support and Resources

### Useful URLs
- **Application**: http://[QNAP_IP]:8080
- **Container Station**: http://[QNAP_IP]:8080 (QNAP Admin)
- **Git Server**: ssh://admin@[QNAP_IP]/share/CACHEDEV1_DATA/git/

### Log Locations
- **Container logs**: Docker container logs via Container Station
- **Nginx logs**: `./logs/` directory in project folder
- **System logs**: QNAP System Logs in QTS

### Quick Reference Commands
```bash
# Deployment status
docker-compose ps

# Resource usage
docker stats acceptance-dashboard

# Quick restart
docker-compose restart acceptance-dashboard

# Emergency stop
docker-compose down
```

---

**Note**: Replace `[QNAP_IP]` with your actual QNAP IP address throughout this guide.

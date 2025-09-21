#!/bin/bash

# QNAP Container Station Deployment Script
# Run this script from your project directory

set -e

echo "🚀 QNAP Container Station Deployment Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment checklist:${NC}"
echo "1. Ensure Docker is available on your QNAP NAS"
echo "2. Container Station is installed and running"
echo "3. Git Server is set up (optional for sync)"
echo "4. Port 8080 is available"
echo ""

# Build the application locally (optional test)
echo -e "${YELLOW}🔨 Building application for testing...${NC}"
if command -v npm &> /dev/null; then
    echo "Installing dependencies..."
    npm install
    echo "Building application..."
    npm run build
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${YELLOW}⚠️  npm not found. Skipping local build test.${NC}"
fi

# Create logs directory
mkdir -p logs

# Display docker-compose configuration
echo -e "${YELLOW}📄 Docker Compose Configuration:${NC}"
cat docker-compose.yml

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps for QNAP Container Station:${NC}"
echo "1. Upload this entire project folder to your QNAP shared folder"
echo "2. Open Container Station web interface"
echo "3. Go to 'Create' → 'Create Application'"
echo "4. Choose 'Upload docker-compose.yml file'"
echo "5. Upload the docker-compose.yml from this directory"
echo "6. Configure settings and deploy"
echo ""
echo -e "${YELLOW}🌐 Access URLs after deployment:${NC}"
echo "- Local access: http://[QNAP-IP]:8080"
echo "- If using Traefik: http://dashboard.local"
echo ""
echo -e "${YELLOW}🔄 For Git synchronization:${NC}"
echo "- Set up Git Server on QNAP (if not already done)"
echo "- Initialize git repository in project folder"
echo "- Configure automatic sync via QNAP Git Server"

# Create a simple health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
# Simple health check for the deployed application
QNAP_IP=${1:-"localhost"}
PORT=${2:-"8080"}

echo "Checking application health at http://${QNAP_IP}:${PORT}"
curl -f http://${QNAP_IP}:${PORT}/ > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Application is healthy!"
else
    echo "❌ Application appears to be down"
    exit 1
fi
EOF

chmod +x health-check.sh

echo -e "${GREEN}💡 Created health-check.sh script for monitoring${NC}"
echo "Usage: ./health-check.sh [QNAP_IP] [PORT]"

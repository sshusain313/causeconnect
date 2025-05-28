#!/bin/bash

# Script to set up environment variables for the CauseConnect frontend

# Set colors for better readability
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Function to print status messages
print_status() {
  echo -e "${GREEN}==>${NC} $1"
}

# Function to print warnings
print_warning() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

# Get the server's IP address
SERVER_IP=$(hostname -I | awk '{print $1}')
print_status "Detected server IP: ${SERVER_IP}"

# Create .env.local file
print_status "Creating .env.local file with server IP..."
cat > .env.local << EOL
# API URL pointing to this server's IP
VITE_API_URL=http://${SERVER_IP}:5000/api

# Environment
VITE_NODE_ENV=production

# Application Title
VITE_APP_TITLE=CauseConnect
EOL

print_status "Environment file created successfully!"
print_status "Now rebuild your frontend with: npm run build"
print_status "Then start the preview server with: npm run preview -- --host --port 8086"

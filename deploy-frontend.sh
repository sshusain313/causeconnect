#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Define colors for better readability
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

# Function to print errors
print_error() {
  echo -e "${RED}ERROR:${NC} $1"
}

print_status "Starting CauseConnect frontend deployment process..."

# Check for environment file
if [ ! -f ".env" ]; then
  print_warning "No .env file found. Creating a sample .env file..."
  cat > .env << EOL
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=production

# Application Title
VITE_APP_TITLE=CauseConnect
EOL
  print_status "Sample .env file created. Please update with your actual values."
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci || npm install

# Ensure required dependencies are installed
for pkg in "axios" "vite"; do
  if ! npm list --depth=0 | grep -q "$pkg@"; then
    print_warning "$pkg not found in package.json, installing..."
    npm install "$pkg" --save
  fi
done

# Run the script to copy uploads
print_status "Copying uploads directory..."
npm run copy-uploads

# Build the frontend
print_status "Building frontend application..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
  print_error "Build verification failed: dist directory not found."
  exit 1
fi

print_status "Frontend build completed successfully!"
print_status "The build artifacts are in the 'dist' directory."
print_status "To preview the build, run: npm run preview"

# Optional: Start the preview server
if [ "$1" = "--preview" ]; then
  print_status "Starting preview server..."
  npm run preview
fi

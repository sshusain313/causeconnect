#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Ensure vite is installed globally
echo "Installing vite globally..."
npm install -g vite

# Run the build
echo "Running build..."
npm run build

echo "Build completed!"

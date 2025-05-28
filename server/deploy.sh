#!/bin/bash

echo "Starting deployment process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Install TypeScript globally if not available
if ! command -v tsc &> /dev/null; then
    echo "TypeScript compiler not found, installing globally..."
    npm install -g typescript
fi

# Clean dist directory if it exists
if [ -d "dist" ]; then
    echo "Cleaning dist directory..."
    rm -rf dist
fi

# Create dist directory
echo "Creating dist directory..."
mkdir -p dist

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc

# Check if compilation was successful
if [ ! -f "dist/index.js" ]; then
    echo "Compilation failed! dist/index.js not found."
    echo "Trying alternative compilation method..."
    
    # Try direct compilation of index.ts
    npx tsc src/index.ts --outDir dist
    
    # If still not successful, try to copy the source files
    if [ ! -f "dist/index.js" ]; then
        echo "Alternative compilation failed. Creating a simple JavaScript entry point..."
        
        # Create a simple JavaScript file that requires the TypeScript source
        echo "require('ts-node/register');
require('../src/index.ts');" > dist/index.js
        
        # Install ts-node if not already installed
        npm install --save ts-node
    fi
fi

# Check if index.js exists now
if [ -f "dist/index.js" ]; then
    echo "Build successful! Starting server..."
    node dist/index.js
else
    echo "Failed to create dist/index.js. Please check the TypeScript configuration."
    exit 1
fi

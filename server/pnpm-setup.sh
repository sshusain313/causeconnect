#!/bin/bash

echo "Setting up server environment with pnpm..."

# Pull the latest changes
echo "Pulling latest changes from Git..."
git pull

# Install helmet directly
echo "Installing helmet package..."
pnpm add helmet

# Create dist directory if it doesn't exist
echo "Creating dist directory..."
mkdir -p dist

# Create a simple JavaScript entry point that uses ts-node
echo "Creating fallback entry point..."
cat > dist/index.js << 'EOL'
// This is a fallback entry point that uses ts-node to run the TypeScript source
try {
  console.log('Using ts-node to run TypeScript source directly...');
  // First try to require ts-node
  try {
    require('ts-node/register');
  } catch (e) {
    console.log('Installing ts-node...');
    require('child_process').execSync('pnpm add ts-node', { stdio: 'inherit' });
    require('ts-node/register');
  }
  
  // Now run the TypeScript source
  require('../src/index.ts');
} catch (error) {
  console.error('Failed to run with ts-node:', error);
  process.exit(1);
}
EOL

echo "Setup complete! You can now run 'node dist/index.js' to start the server."

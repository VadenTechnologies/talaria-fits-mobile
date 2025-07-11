const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define paths
const root = process.cwd();
const androidDir = path.join(root, 'android');
const iosDir = path.join(root, 'ios');

// Check if native directories exist
if (fs.existsSync(androidDir) || fs.existsSync(iosDir)) {
  console.log('🧹 Native directories detected. Cleaning up for managed workflow...');
  
  if (fs.existsSync(androidDir)) {
    console.log('Removing android directory...');
    fs.rmSync(androidDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(iosDir)) {
    console.log('Removing ios directory...');
    fs.rmSync(iosDir, { recursive: true, force: true });
  }
  
  console.log('✅ Native directories removed. Project is now in managed workflow mode.');
} else {
  console.log('✅ Project is already in managed workflow mode.');
}

// Ensure we're using the latest Expo CLI
console.log('📦 Updating Expo CLI...');
try {
  execSync('npm install -g eas-cli@latest expo-cli@latest', { stdio: 'inherit' });
  console.log('✅ Expo CLI updated successfully!');
} catch (error) {
  console.error('❌ Failed to update Expo CLI:', error.message);
}

console.log('\n✨ Project is now configured for managed workflow!');
console.log('\nNext steps:');
console.log('1. Run `npx expo start` to start the development server');
console.log('2. Run `eas build --platform android --profile preview` to create a preview build');
console.log('3. Run `eas build --platform android --profile production` to create a production build');
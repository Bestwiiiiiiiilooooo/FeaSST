#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read the firebaseAdmin.json file from the config directory
  const firebaseConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'config', 'firebaseAdmin.json'), 'utf8')
  );

  console.log('🔧 Firebase Admin Environment Variables for Render');
  console.log('==================================================');
  console.log('');
  console.log('Copy these environment variables to your Render deployment:');
  console.log('');

  // Extract and format the values
  const envVars = {
    'FIREBASE_PROJECT_ID': firebaseConfig.project_id,
    'FIREBASE_PRIVATE_KEY_ID': firebaseConfig.private_key_id,
    'FIREBASE_PRIVATE_KEY': `"${firebaseConfig.private_key}"`,
    'FIREBASE_CLIENT_EMAIL': firebaseConfig.client_email,
    'FIREBASE_CLIENT_ID': firebaseConfig.client_id,
    'FIREBASE_CLIENT_X509_CERT_URL': firebaseConfig.client_x509_cert_url
  };

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('');
  console.log('📋 Instructions:');
  console.log('1. Go to your Render dashboard');
  console.log('2. Select your service');
  console.log('3. Go to Environment tab');
  console.log('4. Add each variable above');
  console.log('5. Redeploy your service');
  console.log('');
  console.log('⚠️  Important: Keep your firebaseAdmin.json file secure and never commit it to Git!');

} catch (error) {
  console.error('❌ Error reading firebaseAdmin.json:', error.message);
  console.error('Make sure the file exists in the config/ directory.');
}

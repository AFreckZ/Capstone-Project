const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Settings
const ENV_PATH = path.join(__dirname, '.env');
const SECRET_KEY_NAME = 'JWT_SECRET'; // You can change this
const KEY_LENGTH_BYTES = 48;

// Generate a secure secret
const secret = crypto.randomBytes(KEY_LENGTH_BYTES).toString('base64url');

// Read or create the .env file
let envContent = '';
if (fs.existsSync(ENV_PATH)) {
  envContent = fs.readFileSync(ENV_PATH, 'utf-8');
}

// Replace or add the secret key line
const regex = new RegExp(`^${SECRET_KEY_NAME}=.*$`, 'm');
if (regex.test(envContent)) {
  envContent = envContent.replace(regex, `${SECRET_KEY_NAME}=${secret}`);
} else {
  envContent += `\n${SECRET_KEY_NAME}=${secret}\n`;
}

// Write it back to .env
fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
//console.log(`Secret key written to .env as ${SECRET_KEY_NAME}`);

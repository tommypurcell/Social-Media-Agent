/**
 * Test Meta API Connection and Get Instagram Business Account ID
 * Run with: node scripts/test-meta-connection.js YOUR_APP_ID YOUR_APP_SECRET
 */

import axios from 'axios';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        env[key.trim()] = value;
      }
    });

    return env;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const APP_ID = env.VITE_META_APP_ID;
const APP_SECRET = env.VITE_META_APP_SECRET;
const GRAPH_API_VERSION = env.VITE_META_GRAPH_API_VERSION || 'v21.0';
const GRAPH_API_BASE = env.VITE_META_GRAPH_API_BASE_URL || 'https://graph.facebook.com';

console.log('\n🔍 Testing Meta API Connection...\n');
console.log(`App ID: ${APP_ID}`);
console.log(`App Secret: ${APP_SECRET ? '***' + APP_SECRET.slice(-4) : 'Not set'}\n`);

async function testConnection() {
  if (!APP_ID || !APP_SECRET) {
    console.error('❌ Error: APP_ID or APP_SECRET not found in .env file');
    return false;
  }

  try {
    // Step 1: Get App Access Token
    console.log('1️⃣ Getting App Access Token...');
    const tokenResponse = await axios.get(
      `${GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          grant_type: 'client_credentials',
        },
      }
    );

    const appAccessToken = tokenResponse.data.access_token;
    console.log('✅ App Access Token obtained successfully\n');

    // Step 2: Verify App Info
    console.log('2️⃣ Verifying App Info...');
    const appInfoResponse = await axios.get(
      `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${APP_ID}`,
      {
        params: {
          fields: 'name,id',
          access_token: appAccessToken,
        },
      }
    );

    console.log(`✅ App Name: ${appInfoResponse.data.name}`);
    console.log(`✅ App ID: ${appInfoResponse.data.id}\n`);

    console.log('─'.repeat(60));
    console.log('\n✅ Basic connection test passed!\n');
    console.log('📝 Next Steps:');
    console.log('1. Go to http://localhost:5173/settings');
    console.log('2. Click "Connect" on Instagram or Threads');
    console.log('3. Authorize the app');
    console.log('4. The Instagram Business Account ID will be automatically fetched\n');
    console.log('💡 Note: You can leave VITE_INSTAGRAM_ACCOUNT_ID empty,');
    console.log('   it will be filled automatically after OAuth connection.\n');

    return true;
  } catch (error) {
    console.error('\n❌ Error testing connection:');

    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`);

      if (error.response.status === 400) {
        console.error('\n💡 Possible issues:');
        console.error('- Invalid App ID or App Secret');
        console.error('- Check your credentials in .env file');
      }
    } else {
      console.error(error.message);
    }

    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log('🎉 You\'re ready to connect your accounts!\n');
      process.exit(0);
    } else {
      console.log('\n❌ Connection test failed. Please check your credentials.\n');
      process.exit(1);
    }
  });

# Meta App Setup - Step by Step Guide

Follow these **exact** steps to configure your Meta app for Instagram and Threads integration.

## ✅ Current Status
- **App ID**: 1872089233443572
- **App Name**: connectivity
- **Credentials**: Already configured in `.env` ✅

---

## 🔧 Step 1: Configure Basic Settings

### 1.1 Go to Your App Dashboard
🔗 **URL**: https://developers.facebook.com/apps/1872089233443572/settings/basic/

### 1.2 Add App Domain
1. Scroll to **"App Domains"**
2. Click **"Add Domain"**
3. Enter: `localhost`
4. Click **"Save Changes"**

### 1.3 Add Website Platform
1. Scroll to bottom, click **"+ Add Platform"**
2. Select **"Website"**
3. Enter Site URL: `http://localhost:5173`
4. Click **"Save Changes"**

---

## 🔧 Step 2: Add Facebook Login Product

### 2.1 Add the Product
1. In left sidebar, click **"Add Product"**
2. Find **"Facebook Login"**
3. Click **"Set Up"**

### 2.2 Configure OAuth Redirect URIs
1. Go to **Facebook Login** > **Settings**
2. Under **"Valid OAuth Redirect URIs"**, add:
   ```
   http://localhost:5173/auth/callback
   ```
3. Click **"Save Changes"**

---

## 🔧 Step 3: Configure Instagram (Optional - for later)

**Note**: For now, we're using basic Facebook login. Once that works, you can add Instagram:

### 3.1 Check Your Instagram Account
1. Your Instagram must be a **Business** or **Creator** account
2. It must be connected to a **Facebook Page**
3. Go to Instagram Settings > Account > Switch to Professional Account

### 3.2 Add Instagram Product (Do this AFTER basic login works)
1. In app dashboard, click **"Add Product"**
2. Find **"Instagram Graph API"** (NOT Basic Display)
3. Click **"Set Up"**
4. Follow the prompts

---

## 🔧 Step 4: Test the Connection

### 4.1 Make Sure App is in Development Mode
- At the top of your app dashboard, you should see **"Development"** mode
- This is correct for testing

### 4.2 Test Basic Connection
1. Go to: http://localhost:5173/settings
2. Click **"Connect"** on Instagram or Threads
3. You should see Facebook's login dialog
4. Login with your Facebook account
5. You'll be redirected back with a success message

---

## 🎯 What Should Happen

### Success Flow:
1. Click "Connect" → Opens Facebook OAuth
2. Login with Facebook → See permission request for "public_profile" and "email"
3. Click "Continue" → Redirected to `/auth/callback`
4. See "Success!" message → Redirected to Settings
5. Account shows as "Connected"

### If You See Errors:

**Error**: "Invalid Scopes"
- ✅ FIXED: I've updated the code to use only basic permissions
- Try again at http://localhost:5173/settings

**Error**: "Redirect URI mismatch"
- Make sure you added `http://localhost:5173/auth/callback` exactly as shown above
- No trailing slash, no https for localhost

**Error**: "App not set up"
- Complete Steps 1 and 2 above
- Make sure you clicked "Save Changes"

---

## 📝 Quick Checklist

Before testing, make sure:
- [ ] App Domain: `localhost` is added
- [ ] Website Platform: `http://localhost:5173` is added
- [ ] Facebook Login product is added
- [ ] OAuth Redirect URI: `http://localhost:5173/auth/callback` is added
- [ ] App is in Development mode
- [ ] Dev server is running: http://localhost:5173

---

## 🚀 Next Steps (After Basic Login Works)

Once you successfully connect with basic permissions:

1. **Add Instagram Permissions**:
   - Go back to app settings
   - Add Instagram Graph API product
   - Request permissions: `pages_show_list`, `instagram_basic`, `instagram_content_publish`

2. **Add Threads Permissions**:
   - Add Threads product in app dashboard
   - Request permissions: `threads_basic`, `threads_content_publish`

3. **Update OAuth Scopes in Code**:
   - I'll help you update the scopes once the products are added

---

## 🆘 Need Help?

If you're stuck on any step, let me know which step number and what error you see!

# Instagram & Threads API Integration Setup Guide

This guide will walk you through setting up Instagram and Threads API integration with your Meta Business Suite account.

## Prerequisites

- Meta Business Suite account
- Instagram Business or Creator account
- Threads account (optional)
- Facebook Page connected to your Instagram account

## Step 1: Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Select **"Business"** as the app type
4. Fill in the app details:
   - **App Name**: Your app name (e.g., "Marathon Agent Social Media")
   - **App Contact Email**: Your email
   - Click **"Create App"**

## Step 2: Add Instagram and Threads Products

### For Instagram:

1. In your app dashboard, find **"Instagram Basic Display"** or **"Instagram Graph API"**
2. Click **"Set Up"**
3. Under **"User Token Generator"**, add your Instagram account
4. Note down your **App ID** and **App Secret**

### For Threads:

1. In your app dashboard, find **"Threads API"**
2. Click **"Set Up"**
3. Follow the prompts to enable Threads access
4. Threads uses the same App ID and Secret

## Step 3: Configure OAuth Redirect URI

1. In your app dashboard, go to **Settings** > **Basic**
2. Scroll to **"Add Platform"** and select **"Website"**
3. Add your redirect URI:
   - **Development**: `http://localhost:5173/auth/callback`
   - **Production**: `https://your-domain.com/auth/callback`
4. Click **"Save Changes"**

## Step 4: Get Your Instagram Business Account ID

### Method 1: Using Graph API Explorer

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Generate an access token with `instagram_basic` permissions
4. Make a GET request to: `/me/accounts`
5. Find your Facebook Page ID
6. Make a GET request to: `/{page-id}?fields=instagram_business_account`
7. Copy the Instagram Business Account ID

### Method 2: Using Instagram Professional Dashboard

1. Go to your Instagram profile
2. Go to **Settings** > **Account** > **Switch to Professional Account**
3. Your Instagram User ID can be found in your profile URL or using the Graph API

## Step 5: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
# Meta/Facebook App Credentials
VITE_META_APP_ID=your_app_id_here
VITE_META_APP_SECRET=your_app_secret_here
VITE_META_REDIRECT_URI=http://localhost:5173/auth/callback

# Instagram Business Account ID
VITE_INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id

# API Base URLs (keep as is)
VITE_META_GRAPH_API_VERSION=v21.0
VITE_META_GRAPH_API_BASE_URL=https://graph.facebook.com
```

## Step 6: Test Your Integration

1. Start your development server (if not already running):
   ```bash
   npm run dev
   ```

2. Navigate to **Settings** page in your app
3. Click **"Connect"** on Instagram or Threads
4. You'll be redirected to Meta's OAuth page
5. Grant the necessary permissions
6. You'll be redirected back to your app with a success message

## Step 7: Using the API

### Post to Instagram

```typescript
import { instagramApi } from './services/instagramApi';

// Post an image
const result = await instagramApi.createImagePost(
  'https://example.com/image.jpg',
  'Check out this amazing content! #marathon'
);

// Post a video
const videoResult = await instagramApi.createVideoPost(
  'https://example.com/video.mp4',
  'New video alert! 🎥 #content'
);

// Post a carousel
const carouselResult = await instagramApi.createCarouselPost(
  [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ],
  'Swipe to see more! 📸'
);
```

### Post to Threads

```typescript
import { threadsApi } from './services/threadsApi';

// Post text
const result = await threadsApi.createTextPost(
  'Just launched our new social media automation tool! 🚀'
);

// Post with image
const imageResult = await threadsApi.createImagePost(
  'https://example.com/image.jpg',
  'Check this out!'
);

// Reply to a thread
const replyResult = await threadsApi.replyToThread(
  'thread_id_here',
  'Great point! Thanks for sharing.'
);
```

### Get Media Feed

```typescript
import { instagramApi } from './services/instagramApi';

// Get recent posts
const posts = await instagramApi.getMedia(10); // Get 10 most recent posts

// Get post insights
const insights = await instagramApi.getMediaInsights('media_id_here');
console.log(insights);
// { impressions: 1234, reach: 987, engagement: 156, saved: 45, profile_visits: 67 }
```

## Important Notes

### Access Token Expiration

- **Short-lived tokens**: Expire in 1 hour
- **Long-lived tokens**: Expire in 60 days (automatically handled by the app)
- The app automatically requests long-lived tokens and stores them
- Use the "Refresh" button in Settings to manually refresh tokens before expiration

### Rate Limits

Instagram API rate limits:
- **Per App**: 200 requests per hour per user
- **Media Publishing**: 25 posts per day per user
- **Video Publishing**: Slower processing, can take 2-10 minutes

Threads API rate limits:
- **Per App**: Similar to Instagram
- **Text Posts**: Up to 250 per day
- **Replies**: Up to 1000 per day

### Media Requirements

**Instagram:**
- **Images**: JPG/PNG, max 8MB, 1:1 to 1.91:1 aspect ratio
- **Videos**: MP4/MOV, max 100MB, 3-60 seconds, 16:9 to 9:16 aspect ratio
- **Carousel**: 2-10 items

**Threads:**
- **Images**: JPG/PNG, max 8MB
- **Videos**: MP4/MOV, max 100MB, up to 5 minutes
- **Text**: Up to 500 characters
- **Carousel**: 2-20 items

### Required Permissions

**Instagram:**
- `instagram_basic` - Basic profile access
- `instagram_content_publish` - Create posts
- `pages_show_list` - Access Facebook Pages
- `pages_read_engagement` - Read engagement metrics
- `business_management` - Manage business assets

**Threads:**
- `threads_basic` - Basic profile access
- `threads_content_publish` - Create threads
- `threads_manage_insights` - View analytics
- `threads_manage_replies` - Manage replies
- `threads_read_replies` - Read replies

## Troubleshooting

### "Instagram not connected" error
- Make sure you've completed Step 6 (Test Your Integration)
- Check that your access token hasn't expired
- Verify your Instagram account is a Business or Creator account

### "Failed to create media container" error
- Ensure your media URLs are publicly accessible (HTTPS)
- Check that media files meet the size and format requirements
- Verify your Instagram account is not rate-limited

### "Invalid OAuth redirect URI" error
- Double-check the redirect URI in your Meta app settings matches exactly
- Make sure there are no trailing slashes
- For localhost, use `http://` (not `https://`)

### OAuth flow doesn't redirect back
- Check your browser's popup blocker
- Verify the redirect URI in `.env` matches your app settings
- Check browser console for any errors

## Security Best Practices

### Production Deployment

1. **Never expose App Secret in frontend code**
   - The current implementation includes app secret in frontend for development
   - For production, create a backend endpoint to handle token exchange

2. **Use HTTPS in production**
   - Update `VITE_META_REDIRECT_URI` to use `https://`

3. **Implement proper token encryption**
   - Currently using localStorage (basic)
   - Consider using encrypted storage or backend session management

4. **Set up webhook validations**
   - Verify webhook signatures from Meta
   - Use proper error handling and logging

### Backend Example

Create a backend endpoint for token exchange:

```javascript
// backend/routes/auth.js
app.post('/api/auth/instagram/callback', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for token on backend
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/oauth/access_token`,
      {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code,
      }
    );

    // Return token to frontend (or store in session)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Support & Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Threads API Documentation](https://developers.facebook.com/docs/threads/)
- [Meta for Developers Community](https://developers.facebook.com/community/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

## Next Steps

1. ✅ Set up Meta App and get credentials
2. ✅ Configure environment variables
3. ✅ Connect your accounts via Settings page
4. 🔄 Integrate posting into your workflow planner
5. 🔄 Set up analytics tracking
6. 🔄 Create a backend for production deployment

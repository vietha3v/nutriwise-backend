# OAuth Setup Guide

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Configure OAuth consent screen
6. Set authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copy Client ID and Client Secret

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth settings
5. Set Valid OAuth Redirect URIs: `http://localhost:3001/auth/facebook/callback`
6. Copy App ID and App Secret

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=nutriwise

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION_TIME=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Social Login Endpoints

- `POST /auth/google` - Login with Google OAuth data
- `POST /auth/facebook` - Login with Facebook OAuth data
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook/callback` - Facebook OAuth callback

### Traditional Auth Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with username/email and password
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get current user profile

## Frontend Integration

For frontend integration, you can use the following flow:

1. **Direct API calls**: Send OAuth data directly to `/auth/google` or `/auth/facebook`
2. **OAuth redirect flow**: Redirect users to `/auth/google/callback` or `/auth/facebook/callback`

Example frontend code for Google OAuth:

```javascript
// Using Google OAuth library
const googleUser = await google.oauth2.getUser();
const response = await fetch('/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    socialId: googleUser.id,
    email: googleUser.email,
    displayName: googleUser.name,
    profilePicture: googleUser.picture,
    locale: googleUser.locale
  })
});
```

## Database Schema Updates

The User entity now includes these additional fields:

- `googleId` (string, nullable, unique)
- `facebookId` (string, nullable, unique)
- `profilePicture` (string, nullable)
- `displayName` (string, nullable)
- `locale` (string, nullable)
- `timezone` (string, nullable)

## Security Notes

1. Always use HTTPS in production
2. Store sensitive credentials in environment variables
3. Implement proper session management
4. Add rate limiting for OAuth endpoints
5. Validate OAuth tokens on the server side 
# OAuth Setup Guide for NutriWise

## Environment Variables Setup

### 1. Copy Environment Template
```bash
cp env.example .env
```

### 2. Configure OAuth Credentials

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Configure OAuth consent screen
6. Set authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copy Client ID and Client Secret

Update your `.env` file:
```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth settings
5. Set Valid OAuth Redirect URIs: `http://localhost:3001/auth/facebook/callback`
6. Copy App ID and App Secret

Update your `.env` file:
```env
FACEBOOK_CLIENT_ID=your-actual-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-actual-facebook-client-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback
```

### 3. Email Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 4. Database Configuration
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=nutriwise
```

### 5. JWT Configuration
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION_TIME=24h
```

### 6. Server Configuration
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Social Login (Direct API)
- `POST /auth/google` - Login with Google OAuth data
- `POST /auth/facebook` - Login with Facebook OAuth data

### Traditional Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with username/email and password
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/profile` - Get current user profile

## Frontend Integration Example

### Google OAuth
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

### Facebook OAuth
```javascript
// Using Facebook SDK
FB.login((response) => {
  if (response.authResponse) {
    FB.api('/me', { fields: 'id,name,email,picture' }, (user) => {
      fetch('/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socialId: user.id,
          email: user.email,
          displayName: user.name,
          profilePicture: user.picture.data.url
        })
      });
    });
  }
});
```

## Database Schema Updates

The User entity includes these additional fields for social login:

```sql
-- Social login fields
googleId VARCHAR(255) UNIQUE,
facebookId VARCHAR(255) UNIQUE,
profilePicture TEXT,
displayName VARCHAR(255),
locale VARCHAR(10),
timezone VARCHAR(50),
```

## Security Notes

1. **Environment Variables**: Never commit `.env` file to version control
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting for OAuth endpoints
4. **Token Validation**: Validate OAuth tokens on server side
5. **Error Handling**: Handle OAuth errors gracefully

## Testing OAuth

1. Start the server: `npm run start:dev`
2. Open Swagger UI: `http://localhost:3001/api`
3. Test the OAuth endpoints with sample data
4. Check database for user creation with social IDs

## Troubleshooting

### Common Issues:
1. **"OAuth2Strategy requires a clientID option"**: Check if environment variables are loaded correctly
2. **"Invalid credentials"**: Verify OAuth credentials in `.env` file
3. **"Email already exists"**: User with same email exists, will link accounts
4. **"Database connection failed"**: Check PostgreSQL is running and credentials are correct 
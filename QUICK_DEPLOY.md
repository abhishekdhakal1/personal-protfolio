# Quick Reference: Deployment Steps

## Frontend (Vercel)

1. Root Directory in Vercel: `client`
2. Build Command: `npm run build`
3. Environment Variable: `VITE_API_URL` = your Render backend URL
4. Auto-deploys on git push

## Backend (Render)

1. Build Command: `cd server && npm install --legacy-peer-deps`
2. Start Command: `cd server && npm start`
3. Environment Variables:
   - MONGODB_URI (MongoDB Atlas)
   - JWT_SECRET (random secure string)
   - ADMIN_USERNAME (change from default)
   - ADMIN_PASSWORD (change from default)
   - NODE_ENV=production

## Database (MongoDB Atlas)

1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user
3. Get connection string
4. Update MONGODB_URI in Render

## Testing

1. Visit Vercel URL
2. Test contact form → should send to backend
3. Visit /admin-login with admin credentials
4. Check messages in admin dashboard

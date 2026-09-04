# Render Deployment Guide

Complete guide for deploying your portfolio backend to Render.com with MongoDB Atlas.

## Prerequisites

- ✅ MongoDB Atlas account (free tier available at mongodb.com/cloud/atlas)
- ✅ Render.com account (free tier available at render.com)
- ✅ GitHub account with repository pushed
- ✅ Node.js 18.x or 20.x
- ✅ Backend code fully working locally

## Step 1: Prepare Your Backend for Deployment

### 1a. Verify Local Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Test your app locally
npm start
# Should show: ✅ MongoDB connected (development mode)
```

### 1b. Configure Procfile

Ensure `Procfile` exists in the project root (not in server folder):

```bash
# Create if it doesn't exist
echo "web: cd server && npm start" > ../Procfile
```

### 1c. Configure render.yaml (Optional but Recommended)

Ensure `render.yaml` exists in project root:

```yaml
services:
  - type: web
    name: portfolio-backend
    env: node
    plan: free
    branch: main
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### 1d. Verify .env.example

Ensure all environment variables are documented in `server/.env.example`:

```bash
# Required variables for Render deployment:
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=your-secret-key
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
CLIENT_URL=https://your-vercel-url.vercel.app
```

### 1e. Push to GitHub

```bash
cd ..
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Create MongoDB Atlas Database

### 2a. Create MongoDB Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create"** → **"Build a cluster"**
4. Select:
   - **Provider**: AWS
   - **Region**: Choose closest to your users (e.g., N. Virginia for US)
   - **Cluster Type**: M0 (Free)
5. Click **"Create Cluster"** (takes ~2 minutes)

### 2b. Create Database User

1. Go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. **Username**: `portfolio_admin` (recommended)
5. **Password**: Generate a strong password or let MongoDB generate one
6. **Database User Privileges**: `Atlas Admin`
7. Click **"Add User"** and **save credentials**

### 2c. Get Connection String

1. Go to **"Deployment"** → **"Database"**
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://portfolio_admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Change the database name: replace `/?retryWrites` with `/portfolio?retryWrites`
   - Final URL: `mongodb+srv://portfolio_admin:PASSWORD@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### 2d. Allow Network Access

1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

⚠️ **Note**: For production, you can restrict to Render's IP ranges later

## Step 3: Create Render Web Service

### 3a. Connect GitHub Repository

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"**
4. Authorize GitHub if prompted
5. Select your portfolio repository: `personal-protfolio`
6. Click **"Connect"**

### 3b. Configure Service Settings

1. **Name**: `portfolio-backend` (or your choice)
2. **Environment**: `Node`
3. **Region**: Select closest to your users (recommended: Frankfurt or N. Virginia)
4. **Branch**: `main`
5. **Build Command**: `npm install` (leave as default if using Procfile)
6. **Start Command**: Leave empty if using Procfile, otherwise: `cd server && npm start`

### 3c. Select Plan

- Choose **"Free"** plan (0.5 CPU, 512 MB RAM)
- Free tier is suitable for portfolio projects
- Will auto-sleep after 15 min of inactivity (wakes on request)

### 3d. Create Service

Click **"Create Web Service"** and wait for deployment (typically 2-5 minutes)

## Step 4: Add Environment Variables to Render

### 4a. Navigate to Environment Settings

1. In Render dashboard, click your service: `portfolio-backend`
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**

### 4b. Add Each Variable

Add all these variables (copy the values you prepared earlier):

| Variable | Value | How to Generate |
|----------|-------|-----------------|
| `NODE_ENV` | `production` | Type as-is |
| `MONGO_URI` | `mongodb+srv://portfolio_admin:PASSWORD@cluster.mongodb.net/portfolio?retryWrites=true&w=majority` | From MongoDB Atlas |
| `JWT_SECRET` | [Long random string] | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL` | Your email | Use your actual email |
| `ADMIN_PASSWORD` | Strong password | Create a secure password |
| `CLIENT_URL` | `https://your-portfolio.vercel.app` | Your Vercel frontend URL |
| `PORT` | `3000` | Render's default |

⚠️ **Important**: After adding each variable, click **"Save"**. Render will auto-redeploy.

### 4c. Verify Environment Variables

After adding all variables:
1. Go to **"Settings"** tab
2. Scroll to **"Environment"**
3. Verify all 6 variables are listed
4. Check the build log for any errors

## Step 5: Monitor Deployment and Build Logs

### 5a. Check Deployment Status

1. After creating the service, Render automatically starts building
2. Go to **"Logs"** tab to see real-time build progress
3. Look for these success indicators:
   ```
   ✅ MongoDB connected (production mode)
   🚀 Server running on port 3000
   ```

### 5b. Common Build Issues

If build fails, check these common problems:

**Missing dependencies:**
```bash
npm install missing-package
git push origin main  # Redeploy
```

**Wrong Node version:**
- Render should auto-detect from `package.json`
- If issues, manually set in Render: **Settings** → **Engine Version**

**Build output too large:**
- Check `.gitignore` includes `node_modules/`

## Step 6: Test Your Deployed Backend

Once deployment succeeds, test the endpoints:

### 6a. Health Check
```bash
# Replace with your actual Render URL
curl https://portfolio-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-07-23T..."}
```

### 6b. Test Admin Login
```bash
curl -X POST https://portfolio-backend.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-email@example.com",
    "password": "your-password"
  }'

# Expected response:
# {"success":true,"token":"eyJhbGc...","user":{"id":"admin","role":"admin"}}
```

### 6c. Verify Database Connection

Check MongoDB Atlas:
1. Go to **"Deployment"** → **"Database"**
2. Click on your cluster
3. Go to **"Collections"** tab
4. Should be empty initially (or have sample data)
5. **Logs** tab shows connection activity

## Step 7: Connect Frontend to Backend

### 7a. Update Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/projects
2. Select your portfolio frontend
3. Go to **"Settings"** → **"Environment Variables"**
4. Add/Update:
   ```
   API_URL = https://portfolio-backend.onrender.com/api
   ```
5. Click **"Save"**

### 7b. Redeploy Frontend

Option 1: Automatic (if connected to GitHub):
- Go to **"Deployments"**
- Click **"Redeploy"** on the latest deployment

Option 2: Manual push:
```bash
# In your client directory
git add .
git commit -m "Update API URL for production"
git push origin main
```

### 7c. Test Full Connection

1. Open your deployed frontend: `https://your-portfolio.vercel.app`
2. Open browser DevTools → **"Network"** tab
3. Try any action that calls the API (e.g., submit contact form)
4. Should see requests to `https://portfolio-backend.onrender.com/api/...`

## Troubleshooting

### "Backend not responding" / "Cannot fetch data"

1. Check backend is running: `https://portfolio-backend.onrender.com/api/health`
2. Check MongoDB connection:
   ```bash
   # In Render logs, should show:
   ✅ MongoDB connected
   ```
3. Check `CLIENT_URL` env var in Render matches exact frontend URL
4. Check browser console for CORS errors

### "Service failed to start"

Check Render **Logs** tab:
- `MONGO_URI` is invalid: verify connection string format
- Missing environment variable: add to Render **Environment**
- Port already in use: shouldn't happen on Render, but check logs

### "Cannot connect to MongoDB"

1. MongoDB Atlas → **Security** → **Network Access**
2. Verify `0.0.0.0/0` is allowed (or add Render IPs)
3. Verify username/password in `MONGO_URI` are correct
4. Test connection string locally first:
   ```bash
   mongosh "mongodb+srv://portfolio_admin:PASSWORD@cluster.mongodb.net/portfolio"
   ```

### "CORS errors" when frontend calls backend

Solution:
```javascript
// server/server.js - verify CORS is configured
const allowedOrigins = [
  process.env.CLIENT_URL,  // Your Vercel URL
  "http://localhost:5173"  // Local dev
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

Update `CLIENT_URL` in Render to exactly match your Vercel URL.

### "Service keeps restarting" / "Crashed with exit code 1"

1. Check Render **Logs** for error messages
2. Common causes:
   - `NODE_ENV` not set to `production`
   - `JWT_SECRET` not set
   - `MONGO_URI` invalid
   - Database is down
3. Verify all 7 env variables are set correctly

### "Rate limiting errors"

Default: 100 requests per 15 minutes per IP. To increase:
```javascript
// server/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,  // Increase from 100
  standardHeaders: true,
  legacyHeaders: false,
});
```

## Deployment Checklist

✅ **Before Deployment:**
- [ ] Backend works locally with MongoDB
- [ ] `Procfile` exists in project root
- [ ] All env vars in `.env.example`
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created with password

✅ **During Deployment:**
- [ ] Render service created
- [ ] All 7 environment variables added
- [ ] Build completes successfully
- [ ] Health check endpoint responds
- [ ] Admin login works

✅ **After Deployment:**
- [ ] Frontend `API_URL` points to Render backend
- [ ] Frontend redeployed on Vercel
- [ ] API calls from frontend reach backend
- [ ] Data persists in MongoDB

## Performance Tips

1. **Cold start optimization**: Render free tier auto-sleeps, first request takes ~10s
2. **Database queries**: Add indexes for frequently queried fields
3. **API caching**: Consider Redis for caching (add later)
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)

## Free Tier Limits

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| **Compute** | 0.5 CPU, 512 MB RAM | Suitable for portfolio |
| **Auto-sleep** | 15 min inactivity | Wakes on request (~10s) |
| **Bandwidth** | 100 GB/month | Plenty for portfolio |
| **Uptime** | Good (99%+) | Reliable for hobby projects |
| **Builds** | Unlimited | Deploy as often as needed |

**When to upgrade:**
- Heavy traffic (>1000 req/min)
- Real-time features (WebSockets)
- Running multiple services
- Need persistent uptime (no sleep)

## Environment Variables Reference

Quick copy-paste template for Render:

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://portfolio_admin:YOUR_PASSWORD@your-cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
CLIENT_URL=https://your-portfolio.vercel.app
```

## Next Steps & Future Improvements

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ Database on MongoDB Atlas
4. 📧 (Optional) Add email notifications
5. 📊 (Optional) Add analytics
6. 🔐 (Optional) Add two-factor auth
7. 🚀 (Optional) Upgrade to paid tier

## Support & Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance
- **CORS Issues**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Last Updated**: July 2026  
**Questions?** Check the troubleshooting section above or refer to official docs

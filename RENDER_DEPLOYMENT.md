# Render Deployment Guide

This guide walks you through deploying the backend on Render.com.

## Prerequisites

- MongoDB Atlas cluster (free or paid)
- Render.com account (free tier available)
- Backend code pushed to GitHub

## Step 1: Prepare Your Backend

Ensure your backend is ready:
- ✅ `Procfile` is configured
- ✅ `render.yaml` is configured (optional)
- ✅ All environment variables documented in `server/.env.example`
- ✅ Code pushed to GitHub

## Step 2: Create Render Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository and branch (usually `main`)
5. Fill in the configuration:
   - **Name**: `portfolio-backend` (or your choice)
   - **Region**: Select closest to your users (e.g., Oregon for US)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (Render auto-detects if Procfile exists)
   - **Start Command**: `npm start` (or use Procfile)

## Step 3: Add Environment Variables

In Render dashboard, go to **Environment** and add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `3000` | Render assigns dynamically, but app respects this |
| `MONGO_URI` | Your MongoDB Atlas URL | See MongoDB setup below |
| `JWT_SECRET` | Strong random string | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL` | Your portfolio admin email | Keep safe |
| `ADMIN_PASSWORD` | Strong password | Keep safe |
| `CLIENT_URL` | Your Vercel frontend URL | e.g., `https://your-portfolio.vercel.app` |

## Step 4: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user (save credentials)
4. Get connection string:
   - Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the MongoDB URI: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`
   - Replace `<username>` and `<password>` with your database user credentials
5. Paste into Render's `MONGO_URI` environment variable

## Step 5: Deploy

1. Click **"Create Web Service"** in Render
2. Wait for deployment (typically 2-5 minutes)
3. Check deployment logs: **"Logs"** tab in Render dashboard
4. Once deployed, you'll get a URL like: `https://portfolio-backend.onrender.com`

## Step 6: Verify Deployment

Test your backend:

```bash
# Health check
curl https://portfolio-backend.onrender.com/api/health

# Admin login (should succeed with correct credentials)
curl -X POST https://portfolio-backend.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your-email@example.com","password":"your-password"}'
```

## Step 7: Update Frontend

In your Vercel deployment:
1. Go to Vercel project settings
2. Update `VITE_API_URL` to: `https://portfolio-backend.onrender.com/api`
3. Redeploy frontend

## Troubleshooting

### "Service failed to start"
- Check logs: **Logs** tab in Render
- Verify `MONGO_URI` is correct and database is accessible
- Ensure all required env vars are set

### "Cannot connect to MongoDB"
- Verify connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- Check MongoDB Atlas firewall: **Network Access** → allow all IPs (0.0.0.0/0) for testing
- Verify username/password don't contain special characters (or they're URL-encoded)

### "CORS errors from frontend"
- Ensure `CLIENT_URL` env var matches your exact Vercel URL
- Check browser console for exact error message
- Verify Vercel URL is set exactly (including https://)

### "Rate limiting"
- Default: 100 requests per 15 minutes per IP
- Configure in `server/server.js` if needed

### Service keeps restarting
- Check logs for errors (MONGO_URI missing, JWT_SECRET empty, etc.)
- Ensure all environment variables are set
- Verify Node.js version compatibility: 18.x or 20.x

## Free Tier Limits

- **Compute**: 0.5 CPU, 512 MB RAM
- **Auto-sleep**: After 15 minutes of inactivity (will wake on request, takes ~10 seconds)
- **Bandwidth**: 100 GB/month
- **Duration**: Services can run for months on free tier

For production use, consider upgrading to Starter plan ($7/month).

## Environment Variables Quick Reference

```bash
# Generate secure JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Verify connection to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net/portfolio"
```

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ Database hosted on MongoDB Atlas
4. 🎉 Portfolio ready for production!

---

**Support**: Check Render documentation: https://render.com/docs

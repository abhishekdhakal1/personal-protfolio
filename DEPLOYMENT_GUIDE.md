# 🚀 Deployment Guide - Vercel & Render

Complete guide to deploy your portfolio frontend on Vercel and backend on Render.

---

## 📋 Prerequisites

- [ ] GitHub account with code pushed
- [ ] Vercel account (free tier available)
- [ ] Render account (free tier available)
- [ ] MongoDB Atlas account (cloud database) or local MongoDB

---

## 🔄 Phase 1: Prepare MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up and create a free account
3. Create a new cluster (Free tier: M0)
4. Wait for cluster to be created (~5 minutes)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select Node.js driver
4. Copy the connection string
5. Replace `<password>` with your database password
6. Should look like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### Step 3: Update Server .env

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

---

## 🖥️ Phase 2: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
cd /home/abhishek-dhakal/Projects/web-dev/personal-protfolio
git add .
git commit -m "Final deployment preparation"
git push origin main
```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 3: Deploy Backend Service

1. Click **New +** → **Web Service**
2. Select your repository
3. Configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install --legacy-peer-deps`
   - **Start Command**: `cd server && npm start`

### Step 4: Add Environment Variables

In Render dashboard, add to "Environment":

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-min-32-characters-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_to_secure_password
```

### Step 5: Deploy

1. Click **Create Web Service**
2. Wait for deployment (usually 2-3 minutes)
3. Copy the service URL (e.g., `https://portfolio-backend-xyz.onrender.com`)
4. **Save this URL** - you'll need it for frontend

---

## 🎨 Phase 3: Deploy Frontend to Vercel

### Step 1: Prepare Client Environment Variables

Update `client/.env.production`:

```env
VITE_API_URL=https://portfolio-backend-xyz.onrender.com/api
```

Replace `portfolio-backend-xyz.onrender.com` with your actual Render backend URL.

### Step 2: Update Vercel Build Settings

Update `client/vite.config.ts` if needed:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

### Step 3: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access repositories

### Step 4: Import Project

1. Click **Add New...** → **Project**
2. Select your repository
3. Choose **Import Git Repository**

### Step 5: Configure Build Settings

1. **Root Directory**: `client` (important!)
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install --legacy-peer-deps`

### Step 6: Add Environment Variables

In Vercel dashboard, add to "Environment Variables":

```
VITE_API_URL=https://portfolio-backend-xyz.onrender.com/api
```

### Step 7: Deploy

1. Click **Deploy**
2. Wait for build and deployment (usually 1-2 minutes)
3. Get your Vercel URL (e.g., `https://portfolio-xyz.vercel.app`)

---

## ✅ Phase 4: Test Everything

### Test Backend

```bash
# Test if backend is running
curl https://portfolio-backend-xyz.onrender.com/api/messages
# Should return: {"error":"Access denied. No token provided."}
# (This means API is working!)
```

### Test Frontend

1. Visit your Vercel URL: `https://portfolio-xyz.vercel.app`
2. Check console (Dev Tools → Console) for any errors
3. Should see no red errors

### Test Contact Form

1. Scroll to "Get In Touch" section
2. Fill and submit the form
3. Should see "More from you soon!" message
4. Visit admin dashboard: `https://portfolio-xyz.vercel.app/admin-login`
5. Login with `admin` / `your-password`
6. Should see the message you just submitted!

---

## 🔧 Configure CORS on Backend

Your backend needs to allow requests from Vercel domain.

Update `server/server.js`:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://portfolio-xyz.vercel.app", // Your Vercel URL
            "https://www.portfolio-xyz.vercel.app",
          ]
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
```

Then push to GitHub and Render will auto-redeploy.

---

## 🔐 Update Environment Variables

### Server (Render Dashboard)

Update these for security:

```
JWT_SECRET=generate-a-random-32-char-string-at-https://randomkeygen.com
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_very_secure_password
```

### Client (Vercel Dashboard)

```
VITE_API_URL=https://your-actual-backend-url.onrender.com/api
```

---

## 🔄 How They Work Together

```
User's Browser
    ↓
Vercel (Frontend)
    ↓
API Request to Render
    ↓
Render (Backend)
    ↓
MongoDB Atlas (Database)
    ↓
Response back to Vercel
    ↓
User's Browser
```

1. User visits `portfolio-xyz.vercel.app`
2. Frontend loads from Vercel's global CDN
3. Frontend makes API calls to `portfolio-backend-xyz.onrender.com/api`
4. Backend processes requests and queries MongoDB Atlas
5. Response sent back to frontend
6. User sees results

---

## 🚨 Troubleshooting

### "Cannot reach API" or CORS errors

**Solution**: Check CORS setup in `server/server.js`

- Make sure your Vercel URL is in the `origin` array
- Redeploy backend after changes
- Check browser console for exact error

### "Unread messages not showing"

**Solution**:

- Verify `VITE_API_URL` is correct in Vercel environment
- Check MongoDB connection string in Render
- Test API directly: `curl https://your-backend.onrender.com/api/messages`

### Admin login not working

**Solution**:

- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Render
- Verify JWT_SECRET is set
- Check browser console for error details

### Database connection error

**Solution**:

- Verify MongoDB Atlas connection string is correct
- Check IP whitelist in MongoDB Atlas (should allow all: `0.0.0.0/0`)
- Restart Render service

### Build fails on Vercel

**Solution**:

- Check build logs in Vercel dashboard
- Ensure `client` is set as root directory
- Verify all dependencies are listed in `client/package.json`

---

## 📊 Environment Variable Summary

### Server (.env on Render)

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=random-32-char-string
ADMIN_USERNAME=secure-username
ADMIN_PASSWORD=secure-password
```

### Frontend (.env on Vercel)

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 Update Flow (After Initial Deployment)

### To update backend:

1. Make changes locally
2. Commit and push to GitHub
3. Render automatically detects and deploys
4. Check Render logs for deployment status

### To update frontend:

1. Make changes locally
2. Commit and push to GitHub
3. Vercel automatically detects and deploys
4. Check Vercel logs for deployment status

---

## 📱 Domain Setup (Optional)

### Connect Custom Domain to Vercel

1. In Vercel: Settings → Domains
2. Add your domain
3. Update DNS records (Vercel will show instructions)
4. Usually takes 24-48 hours

### Connect Custom Domain to Render

1. In Render: Environment → Custom Domain
2. Update DNS records
3. Render provides CNAME record details

---

## 💰 Cost Estimation

- **Vercel**: Free tier (unlimited builds, 100GB bandwidth)
- **Render**: Free tier (sleeping after 15 minutes inactivity, $7+/month for always-on)
- **MongoDB Atlas**: Free tier (512MB storage, perfect for portfolio)

**Total**: ~$0-7/month

---

## ✨ Next Steps

1. [ ] Create MongoDB Atlas cluster and get connection string
2. [ ] Push code to GitHub
3. [ ] Create Render account and deploy backend
4. [ ] Create Vercel account and deploy frontend
5. [ ] Update environment variables on both platforms
6. [ ] Test all functionality
7. [ ] Monitor logs for any issues
8. [ ] Keep backend awake (add wake-up service or upgrade tier)

---

## 🔗 Useful Links

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Environment Variables Best Practices](https://12factor.net/config)

---

**Created**: March 29, 2026
**Last Updated**: Just Now
**Status**: Ready for Deployment 🚀

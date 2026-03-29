# 🚀 DEPLOYMENT - Step by Step (5 Easy Steps)

Complete walkthrough to deploy frontend on Vercel and backend on Render.

---

## 📋 Prerequisites Checklist

- [ ] Code pushed to GitHub
- [ ] Node.js installed locally
- [ ] At least one git commit

---

## ✅ STEP 1: Set Up MongoDB Atlas (5 minutes)

### 1.1 Create Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start free"
3. Sign up (can use Google account)
4. Accept terms

### 1.2 Create Cluster

1. Click "Create Deployment"
2. Choose **Cluster Tier: M0 Free**
3. Region: Pick closest to you (e.g., ap-south-1 for India)
4. Wait 3-5 minutes for cluster creation
5. Click "Connect"

### 1.3 Create Database User

1. In "Connect" dialog, click "Create Database User"
2. **Username**: `dbuser` (or your choice)
3. **Password**: generate strong password (copy this!)
4. Click "Create User"

### 1.4 Get Connection String

1. Click "Choose a connection method"
2. Select "Connect your application"
3. Select **Node.js** driver
4. Copy connection string (looks like):
   ```
   mongodb+srv://dbuser:password@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `password` with your actual password
6. Change `/?` to `/portfolio?` (add database name)
7. **Save this connection string** - you'll need it!

---

## ✅ STEP 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub (authorize Render)

### 2.2 Create Web Service

1. Click **New +** → **Web Service**
2. Select your repository (the portfolio one)
3. Fill in:
   - **Name**: `portfolio-backend`
   - **Root Directory**: `server` (leave blank - auto-detects)
   - **Runtime**: Node.js
   - **Build Command**:
     ```
     cd server && npm install --legacy-peer-deps
     ```
   - **Start Command**:
     ```
     cd server && npm start
     ```

### 2.3 Add Environment Variables

Click "Add Environment Variable" and add:

| Key              | Value                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| `PORT`           | `5000`                                                                          |
| `NODE_ENV`       | `production`                                                                    |
| `MONGODB_URI`    | Your MongoDB connection string from Step 1                                      |
| `JWT_SECRET`     | Generate at [randomkeygen.com](https://randomkeygen.com) - copy the long string |
| `ADMIN_USERNAME` | Change to something secure (e.g. `portfolio_admin`)                             |
| `ADMIN_PASSWORD` | Change to something secure (e.g. `SecurePass123!@#`)                            |

### 2.4 Deploy

1. Click **Create Web Service**
2. Wait for build (2-3 minutes)
3. Watch logs - should see "✅ Server is running"
4. Copy your Render URL from the top (e.g., `https://portfolio-backend-abc123.onrender.com`)
5. **Save this URL** - you need it for Step 3!

### 2.5 Test Backend

```bash
# Test API is running (should get error, that's OK)
curl https://portfolio-backend-abc123.onrender.com/api/messages
# Should show: {"error":"Access denied. No token provided."}
```

---

## ✅ STEP 3: Configure Frontend for Deployment

### 3.1 Update Environment File

1. Edit `client/.env.production`
2. Replace with your Render URL:
   ```
   VITE_API_URL=https://portfolio-backend-abc123.onrender.com/api
   ```
   (Use your actual Render URL from Step 2.4)

### 3.2 Update CORS on Backend

1. Edit `server/server.js` (line ~20-25)
2. Find the CORS section
3. Update to add your Vercel URL (we'll get it in Step 4):
   ```javascript
   cors({
     origin:
       process.env.NODE_ENV === "production"
         ? [
             "https://portfolio-YOURNAME.vercel.app",
             "https://www.portfolio-YOURNAME.vercel.app",
           ]
         : ["http://localhost:5173", "http://localhost:5174"],
     credentials: true,
   });
   ```
4. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Configure for Vercel and Render deployment"
   git push
   ```

---

## ✅ STEP 4: Deploy Frontend to Vercel (10 minutes)

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### 4.2 Import Project

1. Click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Select your portfolio repository
4. Click Import

### 4.3 Configure Build Settings

1. **Root Directory**: `client` ⚠️ IMPORTANT!
2. **Framework**: Auto-detects React
3. Leave other settings default
4. DO NOT add environment variables yet

### 4.4 Add Environment Variables

Scroll down to "Environment Variables"

- Click **Add**
- **Name**: `VITE_API_URL`
- **Value**: Your Render URL from Step 2.4
  ```
  https://portfolio-backend-abc123.onrender.com/api
  ```
- Click Add

### 4.5 Deploy

1. Click **Deploy**
2. Wait for build (1-2 minutes)
3. When done, you'll get your Vercel URL (e.g., `https://portfolio-yourname.vercel.app`)
4. **Save this URL**
5. Click "Visit" to test it!

---

## ✅ STEP 5: Update Render CORS with Vercel URL

### 5.1 Get Your Vercel URL

- From Step 4.5, copy your Vercel URL (e.g., `https://portfolio-abc123.vercel.app`)

### 5.2 Update CORS on Render

1. Edit `server/server.js` line ~20-25
2. Replace your Vercel URL placeholder:
   ```javascript
   ? [
       "https://portfolio-abc123.vercel.app",
       "https://www.portfolio-abc123.vercel.app"
     ]
   ```
3. Commit and push:
   ```bash
   git add server/server.js
   git commit -m "Update CORS with Vercel URL"
   git push
   ```
4. Render auto-redeploys (watch Render dashboard)

---

## ✅ FINAL TEST

### Test Frontend

1. Visit your Vercel URL: `https://portfolio-abc123.vercel.app`
2. No errors in browser console (F12 → Console)
3. Page loads with 3D animations

### Test Contact Form

1. Scroll to "Get In Touch" section
2. Fill all fields:
   - Name: Test Name
   - Email: test@example.com
   - Subject: Test Subject
   - Message: This is a test message
3. Click "Send Message"
4. Should see success message
5. **Check your email** - you might get a confirmation email

### Test Admin Dashboard

1. Find the admin link somewhere on your site OR go to:
   ```
   https://portfolio-abc123.vercel.app/admin-login
   ```
2. Login with credentials from Step 2.3:
   - Username: Your `ADMIN_USERNAME`
   - Password: Your `ADMIN_PASSWORD`
3. Should see admin dashboard
4. Check if your test message appears!

---

## 🐛 Troubleshooting

### "Cannot reach API" or CORS errors

1. Verify Render URL in `VITE_API_URL` is correct
2. Check CORS origin includes your Vercel URL
3. Redeploy Render after CORS changes
4. Check browser console (F12) for exact error

### "Unread messages not showing"

1. Check MongoDB connection string is correct in Render
2. Test connection: `curl https://your-backend.onrender.com/api/messages` in terminal
3. Should get: `{"error":"Access denied. No token provided."}`

### "Admin login not working"

1. Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Render dashboard
2. Check `JWT_SECRET` is set in Render
3. Try clearing browser cache (Ctrl+Shift+Del)

### "Build fails on Vercel"

1. Click "Logs" in Vercel dashboard
2. Scroll to find the error
3. Usually missing dependency or wrong root directory
4. Check `client` is set as root directory
5. Common fix: `npm install --legacy-peer-deps` in client

### "Backend service keeps sleeping"

- This is normal on free Render tier
- Backend goes to sleep after 15 minutes of inactivity
- First request takes 30 seconds to wake up
- To fix: upgrade to paid tier ($7+/month) for always-on

---

## 📊 Cost Breakdown

| Service     | Free Tier       | Cost                    |
| ----------- | --------------- | ----------------------- |
| **Vercel**  | ✅ Yes          | $0/month                |
| **Render**  | ✅ Yes (sleeps) | $7+/month for always-on |
| **MongoDB** | ✅ Yes (512MB)  | $0/month                |
| **Domain**  | Optional        | $5-15/year              |
| **TOTAL**   |                 | $0-7/month              |

---

## 🔒 Security Tips

1. ✅ Keep `JWT_SECRET` secure (never commit to GitHub)
2. ✅ Change admin username and password from defaults
3. ✅ Use strong passwords (mix of letters, numbers, symbols)
4. ✅ Keep MongoDB Atlas IP whitelist to allow all `0.0.0.0/0` (or your IP only)
5. ✅ Enable 2FA on Vercel and Render accounts

---

## 🔄 Future Updates

### To update frontend:

1. Make changes locally
2. `git add . && git commit -m "message" && git push`
3. Vercel auto-deploys (watch dashboard)

### To update backend:

1. Make changes locally
2. Update `.env` if adding new variables
3. `git add . && git commit -m "message" && git push`
4. Render auto-deploys (watch dashboard)

---

## ✨ You're Done! 🎉

Your portfolio is now live on the internet!

- **Frontend**: `https://portfolio-yourname.vercel.app`
- **Backend**: `https://portfolio-backend-xxx.onrender.com`
- **Admin**: `https://portfolio-yourname.vercel.app/admin-login`

---

**Status**: Ready to Deploy ✅
**Last Updated**: March 29, 2026

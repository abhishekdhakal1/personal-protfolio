# 📝 Copy-Paste Commands for Deployment

Quick reference for all terminal commands needed.

---

## Step 1: Prepare Code (Local)

```bash
# Make sure you're in project root
cd ~/Projects/web-dev/personal-protfolio

# Stage and commit changes
git add .
git commit -m "Prepare for Vercel and Render deployment"

# Push to GitHub
git push origin main
```

---

## Step 2: Test Render Backend URL (Before Vercel)

After deploying to Render, test it works:

```bash
# Replace with your actual Render URL
curl https://portfolio-backend-abc123.onrender.com/api/messages

# Should return: {"error":"Access denied. No token provided."}
# (Error is OK - means API is running!)
```

---

## Step 3: Update Environment Files (Local)

```bash
# Update frontend production environment
cat > client/.env.production << 'EOF'
VITE_API_URL=https://portfolio-backend-abc123.onrender.com/api
EOF

# Update server CORS (edit with your editor)
# nano server/server.js
# or
# code server/server.js

# Push updated CORS to GitHub (after manually editing server.js)
git add server/server.js
git commit -m "Update CORS with Vercel URL"
git push origin main
```

---

## Step 4: Final Verification (After all deployments)

### Test API connection from Vercel frontend:

```bash
# Visit your Vercel URL in browser
https://portfolio-yourname.vercel.app

# Open browser console (F12)
# Should see no errors in console
# Navigate to contact form, try submitting
```

### Check Render logs:

```bash
# Visit Render dashboard
# Click your service
# Watch "Logs" tab for incoming requests when you submit forms
```

### Check MongoDB (via Render):

```bash
# SSH into Render and test MongoDB connection
# Or just check messages appear in admin dashboard
```

---

## Git Push Checklist

Before each `git push`:

```bash
# Check status
git status

# View what you're about to push
git diff HEAD

# Stage changes
git add .

# Preview commit
git diff --cached

# Commit with message
git commit -m "Your message here"

# Push
git push origin main
```

---

## Render Deployment from Terminal (Optional)

If you prefer CLI instead of Render dashboard:

```bash
# Install Render CLI
npm install -g render

# Login
render login

# Deploy
render deploy --service portfolio-backend
```

---

## Vercel Deployment from Terminal (Optional)

If you prefer CLI instead of Vercel dashboard:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from client folder)
cd client
vercel --prod

# Or deploy from root
vercel --prod --cwd=client
```

---

## Useful URLs

```
# MongoDB Atlas
https://account.mongodb.com/account/login

# Render Dashboard
https://dashboard.render.com

# Vercel Dashboard
https://vercel.com/dashboard

# Your GitHub Repo
https://github.com/your-username/repository-name
```

---

## Emergency Commands

### If you need to revert last commit:

```bash
git reset --soft HEAD~1
# or
git revert HEAD
```

### If you accidentally pushed wrong code:

```bash
# Fix locally first, then:
git push origin main --force
# (use with caution!)
```

### Check if Render is still building:

```bash
# Just visit Render dashboard and watch logs
# Or check status at:
https://dashboard.render.com
```

### Force redeploy on Render without code changes:

```bash
# In Render dashboard: click service → Manual Deploy → Deploy latest commit
```

---

## Environment Variables Quick Copy

### For Render .env (use these in dashboard):

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=YourRandomSecureString
ADMIN_USERNAME=portfolio_admin
ADMIN_PASSWORD=SecurePassword123!
```

### For Vercel .env (use these in dashboard):

```
VITE_API_URL=https://portfolio-backend-abc123.onrender.com/api
```

---

## Verification Checklist

Run this after deployment:

```bash
# 1. Check frontend loads
curl -I https://portfolio-yourname.vercel.app
# Should return: HTTP/2 200

# 2. Check backend responds
curl -I https://portfolio-backend-abc123.onrender.com/api/messages
# Should return: HTTP/2 401 or 403 (auth required - this is OK!)

# 3. Check GitHub sync
git log --oneline -5
# Should show your recent commits

# 4. Check Vercel sees your code
# Visit Vercel dashboard → click your project → look at recent deployments
```

---

## Support Resources

If something breaks:

1. **Vercel Errors**: Click "Logs" in Vercel dashboard
2. **Render Errors**: Click "Logs" in Render dashboard
3. **MongoDB Errors**: Check connection string format
4. **CORS Errors**: Check browser console (F12) → Network tab
5. **Build Failures**: Read full build log in dashboard

---

**Status**: Ready to Deploy ✅

# 🔐 Admin Dashboard & Message Management Setup

## Overview

Complete admin panel implementation for managing messages from the "Get in Touch" contact form.

---

## 🎯 Admin Features

### Admin Login (`/admin-login`)

- Username: `admin` (from server .env)
- Password: `admin123` (from server .env)
- Secure JWT token generation
- Auto-redirect on token expiry

### Admin Dashboard (`/admin`)

- **View all messages** from contact form
- **Search & filter** messages by:
  - All messages
  - Unread only
  - Important only
  - Search by name, email, subject, or message content
- **Message management**:
  - Mark messages as read
  - Delete messages
  - View complete message details
  - See sender contact info
- **Statistics**:
  - Total messages count
  - Unread messages count
  - Important messages count

---

## 📁 New Files Created

### Frontend Pages

1. **`client/src/app/pages/AdminLoginPage.tsx`**
   - Login form with username/password
   - Error handling
   - Secure token storage
   - Credentials: `admin` / `admin123`

2. **`client/src/app/pages/AdminPage.tsx`**
   - Dashboard with message list
   - Message detail viewer
   - Search and filter functionality
   - Pagination support
   - Delete and mark as read features

### Backend Routes

3. **Server: `routes/auth.js`**
   - New endpoint: `POST /auth/admin/login`
   - Static credential verification from `.env`
   - JWT token generation for admin

---

## 🔄 Updated Files

### Client

1. **`client/src/app/App.tsx`**
   - Added routes for `/admin-login` and `/admin`
   - Restructured routing to handle admin pages separately

2. **`client/src/utils/api.ts`**
   - Added `adminLogin` endpoint
   - Updated interceptors to handle both user and admin tokens
   - Support for `admin_token` and `admin_user` localStorage

3. **`client/src/app/components/contact-section.tsx`**
   - Updated to use `apiClient` from utils
   - Added `subject` field to contact form
   - Replaced `lucide-react` with `react-icons/md`

### Server

4. **`server/routes/auth.js`**
   - Added `/auth/admin/login` endpoint
   - Validates against `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`

---

## 🔑 Server Configuration

### `.env` file (already configured)

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio
```

⚠️ **IMPORTANT**: Change these credentials in production!

---

## 📝 Contact Form Flow

1. **User submits** form at `#contact` section
2. **Message sent** to `POST /api/messages`
3. **Stored in MongoDB** with:
   - Name, email, subject
   - Message content
   - Timestamp
   - IP address & user agent
   - Read status (default: false)
   - Important flag (default: false)

---

## 🛡️ Security Features

- ✅ JWT authentication for admin endpoints
- ✅ Token-based access control
- ✅ Credentials stored in `.env` (not in code)
- ✅ Automatic logout on token expiry
- ✅ Protected database queries

---

## 🚀 How to Use

### Step 1: Start Servers

```bash
# Terminal 1 - Frontend
cd client && npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

### Step 2: Visit Admin Login

- Navigate to `http://localhost:5173/admin-login`
- Username: `admin`
- Password: `admin123`

### Step 3: View Dashboard

- After login, redirected to `/admin`
- View all messages from contact form
- Search, filter, and manage messages

### Step 4: Test Contact Form

- Scroll to "Get in Touch" section on homepage
- Submit a test message
- Check admin dashboard to see it appear

---

## 📊 API Endpoints

### Admin Authentication

```
POST /api/auth/admin/login
Body: { username: "admin", password: "admin123" }
Response: { token, user }
```

### Messages (Protected - requires admin token)

```
GET    /api/messages                    # List all messages
GET    /api/messages/:id                # Get single message
POST   /api/messages                    # Create message (public)
DELETE /api/messages/:id                # Delete message (admin)
PATCH  /api/messages/:id/read           # Mark as read (admin)
PATCH  /api/messages/:id/important      # Toggle important (admin)
```

---

## 🔍 Admin Token Storage

**localStorage keys:**

- `admin_token` - JWT token for authentication
- `admin_user` - JSON stringified user object

**Auto-removed on:**

- Token expiry (401 response)
- Manual logout
- Session timeout

---

## 🎨 UI Components

The admin dashboard uses:

- Shadcn/ui components (Button, Card, Input)
- React Icons (`react-icons/md`)
- Tailwind CSS for styling
- Responsive grid layout

---

## ✅ Testing Checklist

- [ ] Can login with `admin/admin123`
- [ ] Admin token stored in localStorage
- [ ] Can view list of messages
- [ ] Can search messages
- [ ] Can filter by unread/important
- [ ] Can view message details
- [ ] Can mark message as read
- [ ] Can delete messages
- [ ] Pagination works
- [ ] Contact form submits successfully
- [ ] New messages appear in admin dashboard

---

## 🐛 Troubleshooting

### "Invalid admin credentials"

- Check server `.env` has `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Restart server after changing credentials
- Default: `admin` / `admin123`

### "Cannot read messages"

- Verify admin token is in localStorage
- Check token hasn't expired
- Ensure MongoDB is running

### Messages not appearing

- Check contact form is using correct API endpoint
- Verify MongoDB connection in server logs
- Check CORS settings allow requests

---

## 📱 Responsive Design

The admin dashboard is responsive:

- **Desktop**: 3-column layout (list, detail, navigation)
- **Tablet**: 2-column layout
- **Mobile**: Stacked layout with collapsible sections

---

## 🔐 Change Credentials

### In Production:

1. Edit `server/.env`
2. Change `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Restart server
4. Users must login with new credentials

### Example:

```env
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_very_secure_password_123
JWT_SECRET=your_random_secret_key_min_32_chars
```

---

**Status**: ✅ Complete and Ready to Use
**Last Updated**: March 29, 2026

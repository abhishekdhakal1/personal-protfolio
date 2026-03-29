# 🔄 Migration Guide - Project Restructure

This guide explains the changes made to reorganize the portfolio project with a cleaner monorepo structure.

---

## 📋 What Changed?

### Folder Structure

**Before:**

```
personal-protfolio/
├── src/                    # Frontend code mixed with config
├── server/                 # Backend code (separate)
├── package.json           # Frontend dependencies
├── vite.config.ts
├── tsconfig.json
└── ...config files
```

**After:**

```
personal-portfolio/
├── client/                # All frontend code
│   ├── src/
│   ├── package.json      # Client dependencies only
│   ├── vite.config.ts
│   └── ...config files
├── server/               # All backend code
│   ├── package.json      # Server dependencies only
│   └── ...server files
└── package.json         # Workspace management only
```

---

## 🚀 Dependencies Changes

### Removed (Simplified Codebase)

- ❌ `framer-motion` - Removed for lighter bundle
- ❌ `motion` - Removed
- ❌ `lucide-react` - Replaced with `react-icons`
- ❌ `@emotion/react` & `@emotion/styled` - Removed
- ❌ `@mui/material` & `@mui/icons-material` - Removed

### Added (New Features)

- ✅ `axios` - HTTP client for API calls
- ✅ Auth context for authentication management
- ✅ Protected routes with `ProtectedRoute` component

### Libraries Changed in Client

```json
{
  "OLD": {
    "framer-motion": "^12.38.0",
    "motion": "12.23.24",
    "lucide-react": "0.487.0"
  },
  "NEW": {
    "react-icons": "^5.6.0",
    "axios": "^1.6.0"
  }
}
```

---

## 🔐 New Authentication System

### Files Added

**`client/src/app/contexts/auth-context.tsx`**

- Global authentication state management
- Login/logout functionality
- Token management

**`client/src/app/contexts/protected-route.tsx`**

- Route protection component
- Auto-redirect to login for unauthorized users

**`client/src/utils/api.ts`**

- Axios client configuration
- API endpoints mapping
- Request/response interceptors

### How to Use

```tsx
import { useAuth } from "@/contexts/auth-context";

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login("user", "pass")}>Login</button>
      )}
    </>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from "@/contexts/protected-route";

<Routes>
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    }
  />
</Routes>;
```

---

## 🎨 Icon Migration

### Before (Lucide React)

```tsx
import { Mail, Github } from "lucide-react";

function Component() {
  return (
    <>
      <Mail size={24} />
      <Github size={24} />
    </>
  );
}
```

### After (React Icons)

```tsx
import { MdMail, FaGithub } from "react-icons/all";

function Component() {
  return (
    <>
      <MdMail size={24} />
      <FaGithub size={24} />
    </>
  );
}
```

#### React Icons Icon Sets

- **FaXxx** - Font Awesome
- **MdXxx** - Material Design
- **AiXxx** - Ant Design
- **BiXxx** - Boxicons
- **GiXxx** - Game Icons
- **HiXxx** - Heroicons
- **SiXxx** - Simple Icons
- And many more...

---

## 🎬 Animation Migration

### Before (Framer Motion)

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>;
```

### After (CSS + Tailwind)

```tsx
<div className="animate-fade-in">Content</div>
```

**Add custom animations to `tailwind.config.js`:**

```js
module.exports = {
  theme: {
    animation: {
      "fade-in": "fadeIn 0.5s ease-in",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
  },
};
```

---

## 🔧 Installation for New Environment

### First Time Setup

```bash
# 1. Clone and navigate
git clone <repo>
cd personal-portfolio

# 2. Install root dependencies
npm install

# 3. Create environment files
cp client/.env.example client/.env
cp server/.env.example server/.env

# 4. Update environment variables
nano client/.env
nano server/.env

# 5. Start development
npm run dev
```

### Or Run Separately

```bash
# Terminal 1 - Frontend
cd client && npm install && npm run dev

# Terminal 2 - Backend
cd server && npm install && npm run dev
```

---

## 📝 Workspace Scripts

The root `package.json` now contains workspace management:

```json
{
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "npm run dev --workspace=client & npm run dev --workspace=server",
    "build": "npm run build --workspace=client && npm run build --workspace=server",
    "client:dev": "npm run dev --workspace=client",
    "server:dev": "npm run dev --workspace=server"
  }
}
```

---

## 🔄 Migrating Existing Code

### Component Updates

1. **Remove Framer Motion Imports**

   ```tsx
   // Remove this
   import { motion } from "framer-motion";
   ```

2. **Replace with React Icons**

   ```tsx
   // Replace
   import { Mail } from "lucide-react";
   // With
   import { MdMail } from "react-icons/md";
   ```

3. **Update Animations**

   ```tsx
   // Replace motion.div with div
   // Use Tailwind animation classes
   <div className="animate-pulse">...</div>
   ```

4. **Add Auth Wrapper (if needed)**

   ```tsx
   import { AuthProvider } from "@/contexts/auth-context";

   <AuthProvider>
     <YourApp />
   </AuthProvider>;
   ```

---

## 🔍 File Mapping

### Where Things Moved

| Old Location              | New Location                |
| ------------------------- | --------------------------- |
| `src/`                    | `client/src/`               |
| `vite.config.ts`          | `client/vite.config.ts`     |
| `tsconfig.json`           | `client/tsconfig.json`      |
| `tailwind.config.js`      | `client/tailwind.config.js` |
| `package.json` (frontend) | `client/package.json`       |
| `server/`                 | `server/` (unchanged)       |

---

## ✅ Verification Checklist

After migration:

- [ ] Root `package.json` has workspaces config
- [ ] Client package.json has updated dependencies
- [ ] Server package.json unchanged
- [ ] `client/.env` created with `VITE_API_URL`
- [ ] `server/.env` created with MongoDB URI
- [ ] Auth context imported in App.tsx
- [ ] No framer-motion imports remain
- [ ] All lucide-react imports replaced with react-icons
- [ ] Client builds successfully: `cd client && npm run build`
- [ ] Server starts successfully: `cd server && npm run dev`

---

## 🆘 Troubleshooting Migration

### "Cannot find module 'framer-motion'"

```bash
# Remove framer-motion imports and replace with CSS animations
grep -r "framer-motion" client/src/
```

### "Module not found: lucide-react"

```bash
# Replace all lucide-react with react-icons
find client/src -name "*.tsx" -type f -exec sed -i 's/from "lucide-react"/from "react-icons\/all"/g' {} +
```

### "AuthProvider not found"

```bash
# Make sure auth-context.tsx exists in client/src/app/contexts/
# Update imports if needed
```

### "API calls failing"

```bash
# Check client/.env has correct VITE_API_URL
# Verify server is running on port 5000
# Check CORS settings in server.js
```

---

## 📚 Next Steps

1. **Update Components** - Migrate remaining framer-motion usages
2. **Replace Icons** - Convert all lucide-react to react-icons
3. **Test Auth** - Verify authentication flows work
4. **Update Animations** - Recreate motion animations with CSS
5. **Clean Dependencies** - Remove unused packages

---

## 📞 Need Help?

Check the main README.md for:

- Detailed API documentation
- Component structure guide
- Deployment instructions
- Troubleshooting section

---

Happy migrating! 🎉

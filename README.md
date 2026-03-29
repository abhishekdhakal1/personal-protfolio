# 🚀 Personal Portfolio - Full Stack

A modern, full-stack personal portfolio application with separated client and server architectures. Built with React, Express.js, MongoDB, and featuring 3D graphics with Three.js.

---

## 📁 Project Structure

```
personal-portfolio/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Reusable React components
│   │   │   │   ├── 3d-hero.tsx
│   │   │   │   ├── about-section.tsx
│   │   │   │   ├── contact-section.tsx
│   │   │   │   ├── navbar.tsx
│   │   │   │   └── ... (other components)
│   │   │   ├── contexts/           # React contexts
│   │   │   │   ├── auth-context.tsx
│   │   │   │   ├── protected-route.tsx
│   │   │   │   └── theme-context.tsx
│   │   │   ├── pages/             # Page components
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── AboutPage.tsx
│   │   │   │   └── ... (other pages)
│   │   │   └── App.tsx            # Main app component
│   │   ├── styles/                # CSS and styling
│   │   ├── utils/                 # Utility functions
│   │   │   └── api.ts             # API client and endpoints
│   │   └── main.tsx               # Entry point
│   ├── index.html                 # HTML template
│   ├── package.json               # Client dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── .env.example               # Environment template
│
├── server/                         # Express Backend
│   ├── routes/                    # API routes
│   │   ├── auth.js
│   │   ├── messages.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── profile.js
│   ├── models/                    # MongoDB models
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── Project.js
│   │   └── Skill.js
│   ├── middleware/                # Express middleware
│   │   └── auth.js
│   ├── public/                    # Static files
│   │   └── admin.html             # Admin panel
│   ├── server.js                  # Main server file
│   ├── package.json               # Server dependencies
│   └── .env.example               # Environment template
│
├── package.json                   # Root workspace config
└── README.md                      # This file
```

---

## 🛠 Tech Stack

### Frontend

- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **React Icons** - Icon library
- **Three.js** - 3D graphics
- **Axios** - HTTP client
- **React Hook Form** - Form management

### Backend

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers

---

## ✨ Key Features

✅ **Monorepo Structure** - Organized client/server separation  
✅ **JWT Authentication** - Secure user authentication system  
✅ **Protected Routes** - Client-side route protection  
✅ **3D Graphics** - Interactive Three.js hero section  
✅ **Admin Panel** - Manage projects, skills, and messages  
✅ **Contact Form** - Backend message storage  
✅ **React Icons** - Comprehensive icon library  
✅ **Responsive Design** - Mobile-first approach  
✅ **Dark Theme** - Built-in theme support

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/abhishekdhakal1/personal-portfolio.git
cd personal-portfolio
```

#### 2. Install Dependencies

**Full Installation (Root):**

```bash
npm install
```

**Or Separately:**

Client:

```bash
cd client && npm install && cd ..
```

Server:

```bash
cd server && npm install && cd ..
```

#### 3. Environment Setup

**Server (`server/.env`):**

```bash
cp server/.env.example server/.env
```

Update values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Client (`client/.env`):**

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Start MongoDB

```bash
mongod
```

#### 5. Start Development Servers

**Option A - Root Level:**

```bash
npm run dev
```

**Option B - Separately:**

Terminal 1:

```bash
npm run client:dev
```

Terminal 2:

```bash
npm run server:dev
```

#### 6. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:5000/admin

**Admin Credentials:**

- Username: `admin`
- Password: `admin123`

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info

### Messages

- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message
- `PATCH /api/messages/:id/read` - Mark as read

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Skills

- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

---

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. **User logs in** → `/api/auth/login`
2. **Server returns JWT token** → Stored in localStorage
3. **Token added to API headers** → Axios interceptor
4. **Protected routes** → `<ProtectedRoute>` component
5. **Logout** → Token cleared from storage

---

## 📦 Available Scripts

### Root Level

```bash
npm run dev              # Start both client & server
npm run build            # Build both
npm run client:dev       # Client only
npm run client:build     # Build client only
npm run server:dev       # Server only
npm run server:start     # Start server (prod)
```

### Client

```bash
npm run dev              # Dev server
npm run build            # Production build
npm run preview          # Preview build
```

### Server

```bash
npm run dev              # Dev with nodemon
npm run start            # Production
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)

```bash
# Set environment variables in platform
# Deploy using git or CLI
npm run start
```

### Production Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
JWT_SECRET=your-secure-secret-key
ADMIN_USERNAME=secure-admin-username
ADMIN_PASSWORD=secure-admin-password
```

---

## 🎨 Key Components

### 3D Hero Section

- Three.js scene with particle effects
- Interactive 3D models
- Responsive camera positioning

### Authentication Context

- Global auth state management
- Automatic token refresh
- Protected route wrapper

### Admin Panel

- Message management
- Project CRUD
- Skills editor
- Profile settings

---

## 🔧 Customization

### Change Logo/Branding

```
client/src/app/components/navbar.tsx
```

### Update Colors

```
client/tailwind.config.js
client/src/styles/theme.css
```

### Add New Pages

```bash
# Create page component
touch client/src/app/pages/NewPage.tsx

# Add route in App.tsx
<Route path="/new" element={<NewPage />} />
```

### Add New API Endpoints

```bash
# Create route file
touch server/routes/newroute.js

# Add to server.js
app.use('/api/newroute', newRouteRoutes);
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
mongod

# Check .env MONGODB_URI
MONGODB_URI=mongodb://localhost:27017/portfolio
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Dependencies Issue

```bash
# Clear and reinstall
rm -rf client/node_modules server/node_modules
npm install
```

---

## 📚 Dependencies Removed

For a cleaner codebase, we've removed:

- ❌ `framer-motion` - Replaced with CSS animations
- ❌ `motion` - Simplified animations
- ❌ `lucide-react` - Replaced with `react-icons`
- ❌ `@emotion/*` - Removed styling library
- ❌ `@mui/*` - Material UI (using shadcn/ui instead)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Commit with descriptive messages
5. Push and create PR

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Contact

**Abhishek Dhakal**

- 📧 Email: abhishekdhakal1826@gmail.com
- 🐙 GitHub: [@abhishekdhakal1](https://github.com/abhishekdhakal1)
- 💼 LinkedIn: [@abhishekdhakal](https://linkedin.com/in/abhishekdhakal)

---

**Happy Coding! 🎉**

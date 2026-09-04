# Abhishek Dhakal — Personal Portfolio

A production-ready, full-stack personal portfolio built with React (Vite) and Node.js (Express), backed by MongoDB. The frontend and backend are deployed independently.

---

## Features

- **Dynamic portfolio** — all content (profile, projects, skills, experience) managed via admin dashboard
- **Admin dashboard** — protected React UI at `/admin` to CRUD every section
- **Contact form** — submissions saved in MongoDB, viewable from admin
- **Light / Dark mode** — persisted in `localStorage`
- **Fully responsive** — mobile, tablet, and desktop
- **Image uploads** — profile photo and project images via Multer
- **JWT authentication** — stateless, secure admin login
- **Rate limiting & Helmet** — production-grade security headers

---

## Folder Structure

```
personal-portfolio/
├── client/                 # React + Vite frontend (deploy to Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Navbar, Hero, About, Skills, Projects, Experience, Contact, Footer
│   │   │   ├── contexts/   # theme-context.tsx
│   │   │   ├── pages/      # HomePage, AdminLoginPage, AdminPage
│   │   │   └── App.tsx
│   │   ├── styles/         # theme.css, index.css, tailwind.css, fonts.css
│   │   ├── utils/
│   │   │   └── api.ts      # Axios instance + endpoint map
│   │   └── main.tsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── server/                 # Express + MongoDB backend (deploy to Render / Railway)
│   ├── config/
│   │   └── db.js           # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Experience.js
│   │   ├── Message.js
│   │   ├── Profile.js
│   │   ├── Project.js
│   │   └── Skill.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── experience.js
│   │   ├── messages.js
│   │   ├── profile.js
│   │   ├── projects.js
│   │   └── skills.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/personal-portfolio.git
cd personal-portfolio
```

### 2. Install all dependencies

```bash
npm run install-all
```

### 3. Configure environment variables

**Client** — copy and edit:

```bash
cp client/.env.example client/.env
```

```env
API_URL=http://localhost:5000/api
```

**Server** — copy and edit:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=your-random-secret-min-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
CLIENT_URL=http://localhost:5173
```

---

## Running Locally

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run client` | Start frontend only (port 5173) |
| `npm run server` | Start backend only (port 5000) |
| `npm run build` | Build frontend for production |

---

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write permissions
3. Whitelist IP `0.0.0.0/0` for cloud deployments
4. Copy the connection string into `MONGO_URI` in `server/.env`

---

## Admin Login

Navigate to `/admin-login` and sign in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

From the dashboard you can manage: **Profile · Projects · Skills · Experience · Messages**

---

## Environment Variables Reference

### `client/.env`

| Variable | Description |
|----------|-------------|
| `API_URL` | Backend API URL including `/api` |

### `server/.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `ADMIN_EMAIL` | Admin login identifier |
| `ADMIN_PASSWORD` | Admin login password |
| `CLIENT_URL` | Frontend URL for CORS |

---

## Deployment

### Frontend — Vercel

1. Import repository on [vercel.com](https://vercel.com)
2. Set **Root Directory**: `client`
3. Build Command: `npm run build` | Output Directory: `dist`
4. Add `API_URL=https://your-backend.onrender.com/api`
5. Deploy — SPA routing handled automatically by `vercel.json`

### Backend — Render

1. New Web Service on [render.com](https://render.com)
2. Set **Root Directory**: `server`
3. Build: `npm install` | Start: `node server.js`
4. Add all variables from `server/.env.example`
5. Set `CLIENT_URL` to your Vercel frontend URL

> After both deployments, cross-update `API_URL` (Vercel) and `CLIENT_URL` (Render), then redeploy both.

---

## Troubleshooting

**CORS error** — Ensure `CLIENT_URL` exactly matches the frontend URL (no trailing slash).

**MongoDB connection failed** — Verify `MONGO_URI` format and whitelist server IP in Atlas.

**Admin login fails** — Check `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` are all set.

**Images not loading** — Image URLs reference the backend domain. Ensure backend is live.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Uploads | Multer |
| Hosting | Vercel + Render/Railway + MongoDB Atlas |

---

## License

MIT © Abhishek Dhakal

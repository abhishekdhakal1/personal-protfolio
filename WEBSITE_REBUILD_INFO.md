# Website Rebuild Info - Abhishek Dhakal

This file is a single source of truth extracted from your current portfolio codebase.
Use it to rebuild your website quickly in any stack.

## 1) Personal Identity

- Full Name: Abhishek Dhakal
- Short Name: Abhishek
- Title (default): Electronics, Communication and Information Engineering
- Alternate Hero Titles (animated):
  - Full Stack Developer
  - Electronics Engineer
  - IoT Enthusiast
  - Open Source Contributor
- Bio (backend default): Passionate Electronics and Communication Engineering student focused on bridging hardware and software systems.
- Bio (hero fallback): Passionate developer building modern web applications and embedded systems at the intersection of software and hardware.
- Email: abhishekdhakal1826@gmail.com
- Phone: +977 9824230483
- Location: Kathmandu, Nepal

## 2) Social Links

Current status in code:
- GitHub URL: placeholder only (https://github.com)
- LinkedIn URL: placeholder only (https://linkedin.com)
- Twitter URL: placeholder only (https://twitter.com)
- Email link: mailto:abhishekdhakal1826@gmail.com

Action needed for rebuild:
- Replace placeholder GitHub/LinkedIn/Twitter links with your real profile URLs.

## 3) About/Education Content

- Education:
  - Institute: Tribhuvan University, IOE
  - Degree: B.E. Electronics, Communication & Information Engineering
  - Duration: 2021 - 2025

- "What I do" cards:
  - Web Development: Full-stack web apps with React, Node.js, and MongoDB
  - Embedded Systems: Microcontroller programming, RTOS, PCB design
  - IoT Solutions: Connected devices with MQTT, REST APIs, cloud platforms

## 4) Stats Defaults

- Projects Completed: 25
- Technical Skills: 15
- Years Experience: 3
- Hours of Code: 1000

## 5) Contact Section Data

- Public contact cards:
  - Email: abhishekdhakal1826@gmail.com
  - Phone: +977 9824230483
  - Location: Kathmandu, Nepal
- Contact form fields:
  - name (required)
  - email (required)
  - subject (optional)
  - message (required)

## 6) Website Sections and Order

- Home (Hero)
- About
- Skills
- Projects
- Experience
- Contact
- Footer

## 7) Data Models (for CMS/Admin or DB)

### Profile
- name (string, required)
- bio (string, required)
- title (string)
- email (string, required)
- phone (string)
- location (string)
- profileImage (string URL/path)
- socialLinks:
  - github (string)
  - linkedin (string)
  - twitter (string)
  - email (string)
- stats:
  - projectsCompleted (number)
  - technicalSkills (number)
  - yearsExperience (number)
  - hoursOfCode (number)

### Project
- title (string, required)
- description (string, required)
- category (enum): Web | Embedded | IoT | VLSI | AI | Other
- tags (string[])
- githubUrl (string)
- demoUrl (string)
- imageUrl (string)
- featured (boolean)
- technologies ({ name, level }[])
- status (enum): Completed | In Progress | Planning
- startDate (date)
- endDate (date)
- order (number)

### Skill
- name (string, required)
- category (enum):
  - Web Development
  - Embedded Systems
  - VLSI & FPGA
  - AI & ML
  - IoT & Networks
  - Cloud & DevOps
- level (1-100, required)
- icon (string)
- color (string)
- description (string)
- order (number)
- visible (boolean)

### Experience
- role (string, required)
- company (string, required)
- location (string)
- type (enum): Full-time | Part-time | Internship | Freelance | Contract
- startDate (date, required)
- endDate (date)
- current (boolean)
- description (string)
- skills (string[])
- order (number)

### Message (from contact form)
- name (string, required)
- email (string, required)
- subject (string)
- message (string, required)

## 8) API Endpoints

Base URL:
- Development default: http://localhost:5000/api
- Production: set via API_URL

Endpoints:
- Auth:
  - POST /auth/admin/login
  - GET /auth/me
  - POST /auth/logout
- Profile:
  - GET /profile
  - PUT /profile (auth, supports profileImage upload)
  - DELETE /profile/image (auth)
- Projects:
  - GET /projects
  - POST /projects (auth)
  - GET /projects/:id
  - PUT /projects/:id (auth)
  - DELETE /projects/:id (auth)
- Skills:
  - GET /skills
  - POST /skills (auth)
  - GET /skills/:id
  - PUT /skills/:id (auth)
  - DELETE /skills/:id (auth)
- Experience:
  - GET /experience
  - POST /experience (auth)
  - GET /experience/:id
  - PUT /experience/:id (auth)
  - DELETE /experience/:id (auth)
- Messages:
  - GET /messages (auth/admin)
  - POST /messages (public contact form)
  - GET /messages/:id (auth/admin)
  - PUT /messages/:id (auth/admin, mark read/update)
  - DELETE /messages/:id (auth/admin)
- Health:
  - GET /health

## 9) Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT
- Security: Helmet, CORS, express-rate-limit
- File Uploads: Multer
- Hosting: Vercel (frontend) + Render/Railway (backend) + MongoDB Atlas

## 10) Environment Variables

### Client (.env)
- API_URL=http://localhost:5000/api

### Server (.env)
- PORT=5000
- MONGO_URI=<your_mongodb_uri>
- JWT_SECRET=<secure_secret>
- ADMIN_EMAIL=<admin_login_email>
- ADMIN_PASSWORD=<admin_password>
- CLIENT_URL=<frontend_origin>
- NODE_ENV=development|production
- UPLOAD_PATH=./uploads (optional)
- MAX_FILE_SIZE=5242880 (optional)

## 11) Rebuild Checklist

- Create profile section with the identity and contact values above.
- Replace social placeholders with real GitHub/LinkedIn/Twitter URLs.
- Build admin/CMS forms matching the schemas in section 7.
- Implement APIs listed in section 8 (or map to your new backend/CMS).
- Keep same section order for UX continuity.
- Add image upload support for profile and project images.
- Configure env vars for local/dev/prod.
- Deploy frontend and backend, then verify CORS and API URL wiring.

## 12) Source of Truth in Current Repo

The details above were extracted from:
- server/routes/profile.js
- server/models/Profile.js
- server/models/Project.js
- server/models/Skill.js
- server/models/Experience.js
- client/src/app/components/hero-section.tsx
- client/src/app/components/about-section.tsx
- client/src/app/components/contact-section.tsx
- client/src/app/components/footer.tsx
- client/src/utils/api.ts
- README.md

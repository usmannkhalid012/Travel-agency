# Bus Ticket Management System

A modern MERN stack bus ticket management system with a premium Tailwind UI, role-based authentication, seat booking, admin analytics, and deployment-ready structure.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, Redux Toolkit, Framer Motion, React Icons
-- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, multer

## Project Structure

- `frontend/` - React app with public, customer, and admin screens
- `backend/` - Express API with MVC architecture
- `.env.example` - root environment variables template
- `backend/utils/dummyData.js` - sample seed data

## Setup

1. Install dependencies:

```bash
npm install
npm install --workspace backend
npm install --workspace frontend
```

2. Copy environment files:

- Root: `.env.example` to `.env`
- Backend: use `backend/.env.example`
- Frontend: use `frontend/.env.example`

3. Seed the database:

```bash
npm run seed --workspace backend
```

4. Run locally:

```bash
npm run dev
```

## Environment Variables

### Backend

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_RESET_SECRET`
- `CLIENT_URL`
 (Cloudinary vars removed; app uses local filesystem for image uploads)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### Frontend

- `VITE_API_URL=http://localhost:5000/api`

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Notes

- Login and booking flows use JWT auth and protected routes.
 - Image uploads are saved to the local `backend/uploads` folder by default.
 - If SMTP env vars are missing, certain email features will be disabled.

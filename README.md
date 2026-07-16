# Tesfa Worku Meshesha — Portfolio

A premium, full-stack portfolio website for **Tesfa Worku Meshesha, Ph.D.**, Assistant Research Scientist at NASA Goddard Space Flight Center. Built as a React (Vite) frontend with an Express/Node.js backend, styled with CSS Modules and animated with Framer Motion.

**Design language:** "Signal & Contour" — a navy/blue palette with a teal water accent, contour-line ambient backgrounds, and monospace "telemetry" typographic details, drawn from hydrology and satellite remote sensing.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Scripts](#scripts)
6. [Running Locally](#running-locally)
7. [How to Customize](#how-to-customize)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)
10. [Accessibility & Performance](#accessibility--performance)

---

## Tech Stack

**Frontend**
- React 18 (Vite)
- React Router v6
- CSS Modules (no Tailwind, no CSS-in-JS)
- Framer Motion (animation)
- React Icons
- Axios

**Backend**
- Node.js + Express
- Nodemailer (contact form email delivery)
- express-validator (input validation)
- helmet, cors, express-rate-limit (security & hardening)
- JSON-file persistence for the guestbook (easily swappable for MongoDB/PostgreSQL)

---

## Folder Structure

```
portfolio/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Button, Badge, GlassCard, SectionHeading
│   │   │   ├── Navbar/
│   │   │   ├── Hero/
│   │   │   ├── About/
│   │   │   ├── Experience/
│   │   │   ├── Research/
│   │   │   ├── Projects/
│   │   │   ├── Publications/
│   │   │   ├── Skills/
│   │   │   ├── Testimonials/
│   │   │   ├── Comments/
│   │   │   ├── Contact/
│   │   │   ├── Footer/
│   │   │   ├── LoadingScreen/
│   │   │   ├── ScrollProgressBar/
│   │   │   ├── BackToTop/
│   │   │   ├── CustomCursor/
│   │   │   ├── ParticleBackground/
│   │   │   └── ContourBackground/
│   │   ├── context/ThemeContext.jsx    # Dark mode (Context API + localStorage)
│   │   ├── data/                       # Edit these files to change site content
│   │   ├── hooks/                      # useCountUp, useTypingEffect, useActiveSection…
│   │   ├── pages/                      # Home.jsx, NotFound.jsx
│   │   ├── styles/                     # variables.css (design tokens), global.css
│   │   ├── utils/                      # api.js (Axios client), iconMap.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/          # config.js, mailer.js
│   ├── controllers/     # contact, comments, projects, publications
│   ├── routes/          # REST route definitions
│   ├── services/        # business logic (mailService, commentService, contentService)
│   ├── middleware/      # validators, errorHandler, notFound, rateLimiter
│   ├── utils/            # asyncHandler, ApiError, JsonStore
│   ├── data/             # comments.json, projects.json, publications.json
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

Requires **Node.js 18+** and npm.

```bash
git clone <your-repo-url> portfolio
cd portfolio

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## Environment Variables

### `frontend/.env` (copy from `frontend/.env.example`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend (e.g. `https://api.yourdomain.com`). Leave empty for local dev — Vite proxies `/api` to `http://localhost:5000`. |

### `backend/.env` (copy from `backend/.env.example`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default `5000`). |
| `NODE_ENV` | `development` or `production`. |
| `CLIENT_ORIGINS` | Comma-separated list of allowed CORS origins. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP server details for Nodemailer. |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials (use an app password for Gmail). |
| `CONTACT_RECEIVER` | Inbox that receives contact-form submissions. |
| `RATE_LIMIT_WINDOW_MINUTES` / `RATE_LIMIT_MAX_REQUESTS` | API rate limiting. |

> If SMTP credentials are not set, the backend logs contact submissions to the console instead of sending email — useful for local development without a mail account.

---

## Scripts

### Frontend (`frontend/package.json`)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server (http://localhost:5173) |
| `npm run build` | Production build to `frontend/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Backend (`backend/package.json`)

| Command | Description |
|---|---|
| `npm start` | Start the server with Node |
| `npm run dev` | Start the server with nodemon (auto-restart) |
| `npm run lint` | Run ESLint |

---

## Running Locally

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # then edit values
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`. API requests to `/api/*` are proxied to the backend on port 5000 (see `vite.config.js`).

---

## How to Customize

All personal content lives in `frontend/src/data/`:

| File | Controls |
|---|---|
| `profile.js` | Name, role, bio, stats, education, social links, CV URL |
| `experience.js` | Work history timeline |
| `research.js` | Research area cards |
| `projects.js` | Project cards (screenshots, tags, links) |
| `publications.js` | Publications list |
| `skills.js` | Skill groups and proficiency levels |
| `testimonials.js` | Testimonial carousel content |
| `nav.js` | Navbar links |

**Design tokens** (colors, fonts, spacing, motion) live in `frontend/src/styles/variables.css` — change the CSS custom properties there to re-theme the entire site.

**Profile photo & project screenshots:** drop images into `frontend/public/` and reference them from the data files (e.g. `/projects/my-project.jpg`). If an image fails to load, project cards automatically fall back to a styled placeholder.

**CV/Resume:** place your PDF at `frontend/public/Tesfa_Worku_Meshesha_CV.pdf` (or update `profile.cvUrl`).

---

## API Reference

Base URL: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/contact` | Send a contact-form message (rate-limited, validated) |
| `GET` | `/comments` | List all guestbook comments |
| `POST` | `/comments` | Create a comment or reply |
| `PUT` | `/comments/:id/like` | Increment a comment's like count |
| `DELETE` | `/comments/:id` | Delete a comment (and its direct replies) |
| `GET` | `/projects?category=&search=` | List projects, optionally filtered |
| `GET` | `/publications?search=&sort=` | List publications, optionally filtered/sorted |

All responses follow the shape `{ success: boolean, ...data }`. Errors return `{ success: false, message, details? }`.

---

## Deployment

### Frontend
Build with `npm run build` inside `frontend/`, then deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, GitHub Pages). Set `VITE_API_URL` to your deployed backend URL before building.

### Backend
Deploy `backend/` to any Node host (Render, Railway, Fly.io, an EC2/VM, or a container platform). Set the environment variables from `.env.example` in your host's dashboard. The JSON-file comment store works for light traffic; for production scale, swap `services/commentService.js` to use MongoDB or PostgreSQL.

### CORS
Update `CLIENT_ORIGINS` in the backend `.env` to include your deployed frontend's origin.

---

## Accessibility & Performance

- Semantic HTML, ARIA labels, and visible focus states throughout
- Keyboard-navigable navbar, mobile menu, carousel, and forms
- Respects `prefers-reduced-motion`
- Route-based code splitting via `React.lazy`
- Lazy-loaded images with graceful fallbacks
- Custom cursor and particle background auto-disable on touch devices / reduced motion

---

## License

This project is provided as a personal portfolio template. Replace the sample content in `frontend/src/data/` with your own information before publishing.

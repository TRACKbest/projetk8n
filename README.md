# UserHub — Modern User Management Platform

A full-stack, production-ready user management application built with a
**MERN** stack (MongoDB, Express, React, Node.js), containerized with
**Docker** and deployable on **Kubernetes**.

<p align="center">
  <em>Clean architecture · REST API · Validation · Rate limiting · Modern UI · K8s-ready</em>
</p>

---

## ✨ Features

### Backend (Node.js + Express + MongoDB)
- Layered MVC architecture: `config`, `models`, `controllers`, `routes`, `middleware`, `utils`
- RESTful CRUD API with **pagination**, **search**, and **filtering** (role, status)
- Aggregated **stats endpoint** (`GET /api/users/stats`)
- Input validation via **express-validator** + Mongoose schema rules
- Centralized error handling (validation, cast, duplicate key)
- Security hardening: **helmet**, **CORS**, **rate limiting**, JSON body size limits
- Structured logging + **morgan** HTTP logs
- **Graceful shutdown** on `SIGTERM`/`SIGINT`
- Kubernetes-friendly **`/health`** and **`/ready`** probes
- Runs as **non-root** in a multi-stage Alpine image

### Frontend (React 18)
- Clean, modern dashboard UI — no UI library, pure CSS design system
- Stats cards, debounced search, role/status filters, pagination
- **Accessible modals** with focus trap, escape key, backdrop click
- **Toast notifications** for success / error feedback
- Client-side form validation with inline field errors
- Responsive layout (desktop, tablet, mobile)
- Avatars with initials, status & role badges
- Loading skeletons and empty states

### DevOps
- **Docker Compose** for local one-command start
- **Kubernetes** manifests with TLS ingress, self-signed issuer
- **Cloud Build** pipeline (`cloudbuild.yaml`) ready for GCP
- Nginx reverse proxy with gzip, long-term caching, security headers

---

## 🧱 Project Structure

```
projetk8n/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # MongoDB connection
│   │   ├── models/User.js          # Mongoose schema
│   │   ├── controllers/            # Request handlers
│   │   ├── routes/                 # API route definitions
│   │   ├── middleware/             # validate, errorHandler, notFound
│   │   ├── utils/logger.js         # Structured logger
│   │   └── app.js                  # Express app
│   ├── server.js                   # Entry point + graceful shutdown
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/userService.js      # Axios client
│   │   ├── components/             # Header, Toolbar, UserTable, Modal, …
│   │   ├── App.js                  # Main dashboard
│   │   ├── App.css                 # Design system
│   │   └── index.js
│   ├── nginx.conf                  # SPA + /api proxy + security headers
│   ├── Dockerfile
│   └── package.json
├── k8s/                            # Kubernetes manifests
├── docker-compose.yml
├── cloudbuild.yaml
└── README.md
```

---

## 🚀 Quick Start (Docker Compose)

```bash
# From the project root
docker compose up --build
```

Then open **http://localhost:3000**. The frontend (Nginx) proxies `/api/*`
calls to the backend over an internal network.

To stop and remove volumes:

```bash
docker compose down -v
```

---

## 🛠 Local Development (without Docker)

### 1. MongoDB
Run a local MongoDB (or use Docker):
```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev          # uses nodemon → http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
# Point the UI at the local backend
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
npm start            # http://localhost:3000
```

---

## 🔌 API Reference

All responses follow the envelope:
```json
{ "status": "success", "data": ... }
{ "status": "error",   "message": "…", "errors": [ { "field": "...", "message": "..." } ] }
```

| Method | Endpoint              | Description                                             |
| ------ | --------------------- | ------------------------------------------------------- |
| GET    | `/health`             | Liveness probe                                          |
| GET    | `/ready`              | Readiness probe                                         |
| GET    | `/api/users`          | List users — `?page`, `?limit`, `?search`, `?role`, `?status`, `?sort` |
| GET    | `/api/users/stats`    | Aggregated counts (total / active / inactive / by role) |
| GET    | `/api/users/:id`      | Get a user by id                                        |
| POST   | `/api/users`          | Create a user                                           |
| PUT    | `/api/users/:id`      | Update a user                                           |
| DELETE | `/api/users/:id`      | Delete a user                                           |

### User model

```json
{
  "id": "6553…",
  "firstName": "Jane",
  "lastName":  "Doe",
  "email":     "jane@example.com",
  "phone":     "+33 6 12 34 56 78",
  "department":"Engineering",
  "role":      "admin | manager | user",
  "status":    "active | inactive",
  "createdAt": "…",
  "updatedAt": "…"
}
```

### Example

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Jane","lastName":"Doe",
    "email":"jane@example.com","role":"admin"
  }'
```

---

## ⚙️ Configuration (Backend)

| Variable      | Default                            | Description                     |
| ------------- | ---------------------------------- | ------------------------------- |
| `NODE_ENV`    | `development`                      | `development` / `production`    |
| `PORT`        | `5000`                             | HTTP port                       |
| `MONGO_URI`   | `mongodb://mongo:27017/usersdb`    | MongoDB connection string       |
| `CORS_ORIGIN` | `*`                                | Comma-separated allowed origins |
| `LOG_LEVEL`   | `info`                             | `error` / `warn` / `info` / `debug` |

## ⚙️ Configuration (Frontend — build-time)

| Variable              | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `REACT_APP_API_URL`   | Base URL of the API. Leave empty to use same-origin (`/api`). |

---

## ☸️ Kubernetes

Manifests live under `k8s/`. Typical apply order:

```bash
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/clusterissuer-selfsigned.yaml
kubectl apply -f k8s/certificate.yaml
kubectl apply -f k8s/ingress-https.yaml
```

The backend advertises `/health` and `/ready` — wire them into
`livenessProbe` and `readinessProbe`.

---------------------------------------------------------------

## 🔒 Security Highlights

- Helmet sets strict HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, …)
- Rate limiting on `/api/*` (300 req / 15 min per IP)
- JSON body limit (`10 KB`)
- Mongoose schema validation + `express-validator` on every mutation route
- Centralized error handler strips stack traces in production
- Backend container runs as a **non-root** user

------------------------------

## 🧪 Scripts

```bash
# Backend
npm run dev      # nodemon
npm start        # production
npm test         # jest

# Frontend
npm start        # dev server
npm run build    # production build
npm test         # react-scripts test
```

---

## 📄 License

MIT

# HLD — PRAHARI

## 1. High-Level Overview

PRAHARI is a **two-tier web application** with a React frontend, a Node.js/Express backend API, and MongoDB Atlas as the data store. The system also integrates external services for maps (OpenStreetMap), AI summaries (Google Gemini), and voice input (Web Speech API).

### High-Level Architecture

```
┌─────────────────────┐
│   Browser (Client)  │
│  React + Tailwind   │
│  (Vite dev server)  │
└──────────┬──────────┘
           │ HTTP/REST (JSON + JWT)
           ▼
┌─────────────────────┐
│   Express API Server│
│  (Node.js)          │
├──────────┬──────────┤
│  MongoDB │  Gemini  │  OpenStreetMap
│  Atlas   │  API     │  Leaflet (client-side)
└──────────┴──────────┘
```

---

## 2. Architecture Components

### 2.1 Frontend (Client)
- **Framework:** React 19 with Vite build tool
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios with JWT token interceptor
- **Maps:** React Leaflet + Leaflet + OpenStreetMap tiles
- **UI Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Geospatial:** Geolib (distance calculations in browser)

### 2.2 Backend (API Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Responsibilities:**
  - Authentication (signup, login, JWT issuance)
  - Incident CRUD operations
  - Risk calculation engine (runs on each new incident)
  - Alert generation service
  - AI summary orchestration (Gemini + OpenAI fallback)
  - Route protection and role-based authorization

### 2.3 Database
- **System:** MongoDB Atlas (managed cloud)
- **ODM:** Mongoose
- **Collections:** `users`, `incidents`, `alerts`

### 2.4 External Services
| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| OpenStreetMap | Map tiles + geocoding | Frontend (Leaflet) |
| Google Gemini | AI incident summaries | Backend service |
| OpenAI | Fallback AI summaries | Backend service |
| Browser Geolocation API | GPS capture | Frontend |
| Web Speech API | Voice-to-text for descriptions | Frontend |

---

## 3. Data Flow

### 3.1 Incident Report Flow
1. Community user fills the report form (type, description, village, GPS location).
2. Browser captures GPS coordinates automatically (or user enters village manually).
3. Frontend sends `POST /api/incidents/report` with JWT.
4. Backend runs the **Risk Engine** to calculate score and level.
5. Incident record is created in MongoDB with risk score and level.
6. **Alert Service** checks if risk is HIGH; if so, creates an alert.
7. Response returned to frontend; user redirected to dashboard.

### 3.2 Dashboard Data Flow
1. Dashboard polls `GET /api/incidents/get` (every 10 seconds).
2. Dashboard polls `GET /api/alerts` (every 10 seconds).
3. Frontend filters incidents within 10 km of user's location (using Geolib).
4. Frontend computes local area risk level.
5. For officers: `GET /api/incidents/summary/:village` triggers AI summary generation.

### 3.3 Authentication Flow
1. User signs up or logs in via `POST /api/user/signup` or `POST /api/user/login`.
2. Backend hashes password (bcrypt) and issues JWT (7-day expiry).
3. JWT stored in browser localStorage.
4. All subsequent API requests include JWT in `Authorization: Bearer <token>` header.
5. Backend middleware verifies token and user role for protected routes.

---

## 4. Security Model

- All passwords hashed with bcrypt (10 rounds).
- JWT tokens expire after 7 days.
- Protected routes require valid JWT.
- Officer-only operations (verify, resolve, AI summary) require `role: officer`.
- Token injected automatically via Axios request interceptor.

---

## 5. Deployment Architecture

| Layer | Platform | Notes |
|-------|----------|-------|
| Frontend | Vercel | Static site hosting with global CDN |
| Backend API | Render | Node.js web service |
| Database | MongoDB Atlas | Managed MongoDB cluster |

### Environment Variables
- `PORT` — API server port
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — JWT signing key
- `GEMINI_API_KEY` — Google Gemini API key
- `OPENAI_API_KEY` — OpenAI API key (fallback)
- `VITE_API_URL` — Frontend config to point to backend URL

---

## 6. Monitoring & Observability (Planned)

- Console logging for key operations (incident reporting, risk calculation, alert generation)
- Error handling middleware on all API routes
- Client-side error toasts for failed API calls

# LLD — PRAHARI

## 1. Backend

### 1.1 Project Structure
```
backend/
├── config/
│   └── db.js                  — MongoDB connection
├── controllers/
│   ├── authController.js      — Signup, login
│   ├── incidentController.js  — Report, list, verify, resolve, summarize
│   └── alertController.js     — List alerts
├── middlewares/
│   ├── authMiddleware.js      — JWT verification
│   └── roleMiddleware.js      — Role-based access control
├── models/
│   ├── User.model.js          — User schema
│   ├── Incident.model.js      — Incident schema
│   └── Alert.model.js         — Alert schema
├── routes/
│   ├── authRoutes.js          — /api/user/signup, /api/user/login
│   ├── incidentRoutes.js      — /api/incidents/*
│   └── alertRoutes.js         — /api/alerts/*
├── services/
│   ├── riskEngine.js          — Risk score + level calculation
│   ├── alertService.js        — Alert creation on HIGH risk
│   ├── geminiServices.js      — Gemini AI summary (primary)
│   └── openaiServices.js      — OpenAI summary (fallback)
├── server.js                  — Express app entry point
└── .env                       — Environment variables
```

### 1.2 Entry Point: `server.js`
- Loads dotenv configuration.
- Initializes Express app with CORS and JSON body parsing.
- Connects to MongoDB via `connectDB()`.
- Mounts route routers:
  - `/api/user/` → `authRoutes`
  - `/api/incidents` → `incidentRoutes`
  - `/api/alerts` → `alertRoutes`
- Starts HTTP server on `PORT` (default 5000).

### 1.3 Database Connection: `config/db.js`
- Async function `connectDB()` connects to MongoDB Atlas using `mongoose.connect(process.env.MONGO_URI)`.
- On failure, logs error and exits process (`process.exit(1)`).
- Connected once at application startup.

### 1.4 Authentication Module

#### `models/User.model.js`
- Schema fields:
  - `name` (String, required)
  - `phone` (String, required, unique, 10-digit validation at controller)
  - `village` (String, required)
  - `role` (String, enum: `["community", "officer"]`, default: `community`)
  - `password` (String, required, hashed)

#### `controllers/authController.js`
- **`signup(req, res)`**:
  - Validates required fields (name, phone, village, password).
  - Validates phone is 10 digits.
  - Validates password >= 6 characters.
  - Checks for duplicate phone.
  - Hashes password with bcrypt (10 rounds).
  - Creates user in MongoDB.
  - Returns user object (without password).

- **`login(req, res)`**:
  - Validates phone and password provided.
  - Finds user by phone.
  - Compares password with bcrypt.
  - Signs JWT with `id` and `role` claims, 7-day expiry.
  - Returns token and user object.

#### `middlewares/authMiddleware.js`
- **`protect(req, res, next)`**:
  - Checks for `Authorization: Bearer <token>` header.
  - Verifies JWT using `JWT_SECRET`.
  - Attaches decoded `id` and `role` to `req.user`.
  - Returns 401 if token missing or invalid.

#### `middlewares/roleMiddleware.js`
- **`roleAccess(...allowedRoles)`**:
  - Factory function returning middleware that checks `req.user.role` against allowed roles.
  - Returns 403 if role not permitted.

### 1.5 Incident Module

#### `models/Incident.model.js`
- Schema fields:
  - `incidentType` (String, enum: `["sighting", "livestock_attack", "pugmark", "roar", "human_encounter"]`)
  - `description` (String, max 1000 chars)
  - `imageUrl` (String, URL validation for image formats)
  - `audioUrl` (String, URL validation for audio formats)
  - `location.lat` (Number, -90 to 90)
  - `location.lng` (Number, -180 to 180)
  - `village` (String, required)
  - `reporter` (ObjectId ref to User, required)
  - `riskScore` (Number, 0–100)
  - `riskLevel` (String, enum: `["LOW", "MEDIUM", "HIGH"]`)
  - `status` (String, enum: `["pending", "verified", "resolved", "dismissed"]`, default: `pending`)
  - Timestamps enabled (`createdAt`, `updatedAt`)

#### `controllers/incidentController.js`

- **`report(req, res)`**:
  - Validates required fields in `req.body`.
  - Calls `calculateRisk(req.body)` from riskEngine service.
  - Creates incident record with reporter from `req.user.id`, risk score, and risk level.
  - Calls `generateAlert(riskData, incident)` from alert service.
  - Returns 201 on success.

- **`getIncidents(req, res)`**:
  - Fetches all incidents sorted by `createdAt` descending.
  - Populates `reporter` field with `name`, `phone`, `village`.
  - Returns incident array.

- **`verifyIncidents(req, res)`**:
  - Finds incident by `req.params.id`.
  - Sets `status` to `verified`.
  - Returns updated incident.

- **`resolveIncidents(req, res)`**:
  - Finds incident by `req.params.id`.
  - Sets `status` to `resolved`.
  - Returns updated incident.

- **`summarizeVillageIncidents(req, res)`**:
  - Fetches all incidents for village from `req.params.village`.
  - Calls `summarizeIncidents(incidents)` from AI service.
  - Returns village, incident count, and AI summary text.

#### `routes/incidentRoutes.js`
| Method | Route | Middleware | Controller |
|--------|-------|------------|------------|
| POST | `/report` | `protect` | `report` |
| GET | `/get` | `protect` | `getIncidents` |
| GET | `/summary/:village` | `protect`, `roleAccess("officer")` | `summarizeVillageIncidents` |
| PATCH | `/:id/verify` | `protect`, `roleAccess("officer")` | `verifyIncidents` |
| PATCH | `/:id/resolve` | `protect`, `roleAccess("officer")` | `resolveIncidents` |

### 1.6 Alert Module

#### `models/Alert.model.js`
- Schema fields:
  - `title` (String, required, max 200 chars)
  - `message` (String, required, max 2000 chars)
  - `riskLevel` (String, enum: `["LOW", "MEDIUM", "HIGH"]`)
  - `affectedArea` (String, required)
  - `relatedIncidents` (Array of ObjectId refs to Incident)
  - Timestamps enabled

#### `controllers/alertController.js`
- **`getAlerts(req, res)`**:
  - Fetches all alerts sorted by `createdAt` descending.
  - Returns success flag, count, and alerts array.

#### `routes/alertRoutes.js`
- Contains `GET /` → `getAlerts` handler.

#### `services/alertService.js`
- **`generateAlert(riskData, incident)`** (default export):
  - If `riskData.level !== "HIGH"`, returns without creating alert.
  - Creates alert with title "High Risk Zone Detected", message referencing village and incidents.
  - Links the incident ID in `relatedIncidents`.
  - Returns the created alert document.
- Called automatically during the `report` controller flow.

### 1.7 Risk Engine: `services/riskEngine.js`

**`calculateRisk(newIncident)`** (exported function):

1. Computes a timestamp 7 days before current date.
2. Queries MongoDB for incidents where:
   - `createdAt >= 7 days ago`
   - `status != "resolved"`
3. For each recent incident, calculates distance between the new incident location and the existing incident location using `geolib.getDistance()`.
4. If distance <= 5000 meters (5 km):
   - Adds incident ID to `nearbyIncidents` array.
   - Adds its weight to `totalScore`.
5. Adds the weight of the new incident type to `totalScore`.
6. Determines risk level:
   - Score >= 20 → "HIGH"
   - Score >= 10 → "MEDIUM"
   - Else → "LOW"
7. Returns `{ score, level, nearbyIncidents }`.

**Incident Weights:**
| Type | Weight |
|------|--------|
| `sighting` | 10 |
| `human_encounter` | 10 |
| `livestock_attack` | 8 |
| `roar` | 5 |
| `pugmark` | 4 |

### 1.8 AI Summary Services

#### `services/geminiServices.js` (primary)
- **`summarizeIncidents(incidents)`**:
  - Initializes GoogleGenerativeAI with `GEMINI_API_KEY`.
  - Uses model `gemini-2.0-flash`.
  - Constructs prompt asking for concise officer briefing (80–100 words) with incident count, patterns, concern level.
  - Returns Gemini response text.
  - On HTTP 429 (quota exceeded), returns a static fallback message.
  - On other errors, returns a generic error message.

#### `services/openaiServices.js` (fallback)
- **`summarizeIncidents(incidents)`**:
  - Initializes OpenAI client with `OPENAI_API_KEY`.
  - Uses model `gpt-4o-mini`.
  - Same prompt structure as Gemini.
  - On any error, returns a rule-based template summary with incident count and types.

**Note:** The incident controller (`incidentController.js` line 4) imports `summarizeIncidents` from `openaiServices.js`, not `geminiServices.js`. The Gemini service is currently not wired into the summary endpoint.

### 1.9 Known Issues

1. **`alertRoutes.js` line 7:** `module.exports = getAlerts` exports the controller function instead of the Express router. The `/api/alerts` route will fail with `router is not a function` when mounted in `server.js`.
2. **Alert routes lack authentication:** `GET /api/alerts` has no `protect` middleware, allowing unauthenticated access.
3. **No offline sync implementation:** README mentions LocalStorage sync, but no such logic exists in the frontend code.

---

## 2. Frontend

### 2.1 Project Structure
```
frontend/src/
├── App.jsx              — Route definitions
├── main.jsx             — React entry point (BrowserRouter + AuthProvider)
├── index.css            — Tailwind base styles
├── assets/              — Static assets (logo, images)
├── components/
│   ├── Navbar.jsx       — Navigation bar with role-based links
│   ├── ProtectedRoute.jsx — Role-guarded route wrapper
│   ├── RiskMap.jsx      — Full-screen interactive map (all incidents)
│   ├── LocalRiskMap.jsx — Local map (user location + nearby incidents)
│   ├── DashboardCard.jsx — Reusable stat card
│   └── Logo.jsx         — SVG tiger logo component
├── context/
│   └── AuthContext.jsx  — Auth state management (localStorage-based)
├── services/
│   └── api.js           — Axios instance with JWT interceptor
├── hooks/               — Custom hooks
├── pages/
│   ├── LandingPage.jsx  — Public landing page
│   ├── Login.jsx        — Login form
│   ├── Signup.jsx       — Registration form
│   ├── CommunityDashboard.jsx — Community user dashboard
│   ├── OfficerDashboard.jsx   — Forest officer dashboard
│   ├── Report.jsx       — Incident report form
│   ├── Alerts.jsx       — Alerts list page
│   └── RiskMapPage.jsx  — Full-screen risk map page
└── utils/               — Utility functions
```

### 2.2 Entry Point: `main.jsx`
- Wraps app in `<BrowserRouter>` (React Router DOM v7).
- Wraps app in `<AuthProvider>` for auth context.
- Imports Leaflet CSS and Tailwind base styles.

### 2.3 API Client: `services/api.js`
- Creates Axios instance with `baseURL` from `VITE_API_URL` env var.
- Request interceptor reads JWT from `localStorage.getItem("token")` and sets `Authorization: Bearer <token>` header on every request.

### 2.4 Auth Context: `context/AuthContext.jsx`
- Creates React context for user state.
- `AuthProvider` component:
  - Reads `user` from localStorage on init.
  - `login(userData, token)`: stores user and token in localStorage, updates state.
  - `logout()`: clears localStorage, sets user to null.
- `useAuth()` hook: returns context for consuming components.

### 2.5 Routing: `App.jsx`
| Route | Component | Access |
|-------|-----------|--------|
| `/` | `LandingPage` | Public |
| `/login` | `Login` | Public |
| `/signup` | `Signup` | Public |
| `/community-dashboard` | `CommunityDashboard` | `community` role |
| `/officer-dashboard` | `OfficerDashboard` | `officer` role |
| `/report` | `ReportIncident` | `community` or `officer` |
| `/alerts` | `AlertsPage` | `community` or `officer` |
| `/risk-map` | `RiskMapPage` | Public (unprotected) |

### 2.6 ProtectedRoute Component
- Reads current user from `useAuth()`.
- Redirects to `/login` if no user is logged in.
- Redirects to `/` if user's role is not in `allowedRoles`.
- Renders children if all checks pass.

### 2.7 Page: LandingPage
- Public entry point with hero section.
- Shows value propositions: incident reporting, risk alerts, live maps, AI intelligence.
- Links to signup, login, and risk map.

### 2.8 Page: Login
- Phone number + password form.
- On submit: `POST /api/user/login`.
- Stores token and user via `login()` from AuthContext.
- Redirects to role-specific dashboard.

### 2.9 Page: Signup
- Form with: name, phone (10-digit validation), village, role (default: community), password (min 6 chars).
- Client-side validation with error messages per field.
- On submit: `POST /api/user/signup`.
- Redirects to login on success.

### 2.10 Page: Report
- Form with incident type dropdown, village text input, description textarea, and voice-to-text button.
- Captures GPS location via `navigator.geolocation.getCurrentPosition` on page load.
- Voice input uses Web Speech API (`SpeechRecognition`) with Indian English locale.
- On submit: `POST /api/incidents/report` with incident data and location.
- Redirects to community dashboard on success.

### 2.11 Page: CommunityDashboard
- Fetches incidents and alerts; polls both endpoints every 10 seconds.
- Shows toast notification when new alerts appear.
- Gets user's GPS location to filter nearby incidents (within 10 km using Geolib).
- Displays:
  - Summary cards (total reports, current risk, active alerts)
  - LocalRiskMap centered on user location
  - Nearby incidents count and safety advisory
  - Recent alerts list
  - Nearby incidents table
- Hides resolved incidents from community view.

### 2.12 Page: OfficerDashboard
- Similar data fetching and polling as CommunityDashboard.
- Shows AI intelligence summary: calls `GET /api/incidents/summary/:village` for the highest-risk village.
- Displays:
  - Summary cards (total incidents, high risk zones, pending verifications)
  - LocalRiskMap centered on officer's location
  - AI summary panel (Gemini-powered)
  - Incident table with verify/resolve action buttons for pending incidents

### 2.13 Page: Alerts
- Fetches and displays all alerts.
- Color-coded badges for risk level (red/yellow/green).
- Shows title, message, affected area, and creation timestamp.

### 2.14 Page: RiskMapPage
- Fetches all incidents and renders full-screen `RiskMap`.
- Publicly accessible (no authentication required).
- Map centered on India, zoom level 5.
- Each incident shown as a marker with popup and a 3 km risk-radius circle colored by risk level.

### 2.15 Component: RiskMap
- Leaflet map showing all incidents.
- Markers with popups showing incident type, village, description, and risk status.
- Color-coded circles (red=HIGH, yellow=MEDIUM, green=LOW) with 3 km radius.

### 2.16 Component: LocalRiskMap
- Leaflet map centered on the user's GPS location.
- Shows a 5 km radius circle colored by area risk level.
- Shows markers for nearby incidents with detailed popups.
- Uses `MapResizeHandler` hook to call `map.invalidateSize()` on window resize.
- Shows loading spinner while GPS coordinates are being fetched.

### 2.17 Component: Navbar
- Role-based navigation links (different for community vs officer).
- Mobile-responsive with hamburger menu toggle.
- Logout button that calls `logout()` from AuthContext.
- Current page indicator styling.

### 2.18 Component: DashboardCard
- Simple reusable card showing a title and numeric value.

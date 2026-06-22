# 🐅 PRAHARI

> **Community-Driven Early Warning System for Human-Wildlife Conflict**

PRAHARI is a community-powered early warning platform designed to reduce human-wildlife conflict in buffer regions and areas outside protected reserves (TOTR - Tigers Outside Tiger Reserves).

The platform enables villagers, forest guards, and wildlife officials to collaboratively report wildlife incidents, detect conflict hotspots, generate risk alerts, and support rapid response efforts.

---

## 🌟 Problem Statement

India hosts nearly **75% of the world's tiger population**, and an increasing number of tigers now live outside protected reserves.

Current reporting mechanisms are often:

* Delayed
* Fragmented
* Reactive
* Limited to word-of-mouth communication

As a result, both **human lives and wildlife are at risk**.

PRAHARI transforms isolated wildlife observations into **actionable early warnings**.

---

# 🚀 Key Features

## 👥 Authentication & Role-Based Access

* Secure JWT Authentication
* User Signup & Login
* Role-based authorization

Roles:

* **Community User**
* **Forest Officer**

---

## 📝 Incident Reporting

Users can report:

* Tiger Sighting
* Livestock Attack
* Pugmark Found
* Roaring Heard
* Human Encounter

Each report includes:

* Incident Type
* Description
* GPS Coordinates
* Village Name
* Timestamp
* Reporter Information

---

## 📍 Automatic GPS Capture

Uses browser Geolocation API to automatically capture user location.

Fallback:

* Manual village entry

---

## 🧠 Risk Engine

The core intelligence layer of PRAHARI.

### Workflow

1. Fetch incidents from last 7 days.
2. Identify incidents within 5 km radius.
3. Assign severity weights.
4. Aggregate cumulative score.
5. Classify area risk.

### Incident Weights

| Incident         | Weight |
| ---------------- | ------ |
| Tiger Sighting   | 10     |
| Human Encounter  | 10     |
| Livestock Attack | 8      |
| Roaring Heard    | 5      |
| Pugmark Found    | 4      |

### Risk Classification

| Score   | Risk Level |
| ------- | ---------- |
| < 10    | LOW        |
| 10 - 19 | MEDIUM     |
| ≥ 20    | HIGH       |

---

## 🚨 Alert Generation

Whenever an area's cumulative risk exceeds predefined thresholds:

* Alerts are automatically generated.
* Communities are notified.
* Forest officers receive updates.

---

## 🗺️ Interactive Risk Maps

Built using:

* Leaflet
* React Leaflet
* OpenStreetMap

Features:

* Incident markers
* Color-coded risk zones
* Interactive popups
* Local area risk visualization

---

## 🤖 AI-Assisted Summaries

PRAHARI uses **Google Gemini API** to generate concise wildlife intelligence summaries for forest officers.

Example:

> "Three tiger-related incidents including livestock attack and pugmark sightings were reported near Kokha village within the last 48 hours. Area classified as High Risk."

Fallback summaries are generated automatically if Gemini quota limits are exceeded.

---

## 📶 Offline-First Support

If internet connectivity is unavailable:

* Reports are stored locally using LocalStorage.
* Reports are automatically synchronized once connectivity is restored.

---

# 🏗️ System Architecture

```text
Community Users / Forest Officers
                ↓
         React Frontend
                ↓
         Express REST APIs
                ↓
          MongoDB Atlas
                ↓
           Risk Engine
                ↓
          Alert Service
                ↓
         Gemini AI Service
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* React Leaflet
* Leaflet

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT
* bcryptjs

## AI

* Google Gemini API

## Geospatial Utilities

* Geolib

## Deployment

Frontend:

* Vercel

Backend:

* Render

---

# 📂 Project Structure

## Frontend

```bash
src/
│
├── components/
├── pages/
├── context/
├── services/
├── hooks/
├── assets/
├── utils/
├── App.jsx
└── main.jsx
```

## Backend

```bash
backend/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── .env
├── server.js
└── package.json
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/prahari.git
```

```bash
cd prahari
```

---

# Backend Setup

## Install dependencies

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

Open new terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 API Endpoints

## Authentication

### Signup

```http
POST /api/user/signup
```

### Login

```http
POST /api/user/login
```

---

## Incidents

### Report Incident

```http
POST /api/incidents/report
```

### Get All Incidents

```http
GET /api/incidents/get
```

### Verify Incident

```http
PATCH /api/incidents/:id/verify
```

### Resolve Incident

```http
PATCH /api/incidents/:id/resolve
```

---

## AI Summary

```http
GET /api/incidents/summary/:village
```

---

# 👨‍💻 Application Navigation

## Community User

1. Signup/Login
2. Access Community Dashboard
3. Report Wildlife Incident
4. View Nearby Risk Zones
5. Check Alerts
6. Monitor Local Wildlife Activity

---

## Forest Officer

1. Login
2. Access Officer Dashboard
3. View All Incidents
4. Verify Reports
5. Resolve Incidents
6. Review AI Summaries
7. Monitor High Risk Zones

---

# 🧪 Demo Flow

```text
1. Login as Villager
2. Submit Tiger Sighting
3. Submit Livestock Attack
4. Submit Pugmark Report
5. Risk score increases
6. High Risk Zone generated
7. Alert generated
8. Officer logs in
9. Officer reviews AI summary
10. Officer verifies incident
```

---

# ⚠️ Common Issues & Solutions

## MongoDB Connection Error

### Error

```bash
MongoNetworkError
```

### Solution

* Verify MongoDB Atlas IP Whitelist.
* Ensure MONGO_URI is correct.

---

## JWT Authentication Failed

### Error

```bash
401 Unauthorized
```

### Solution

* Login again.
* Check token storage in localStorage.
* Verify JWT_SECRET.

---

## Geolocation Not Working

### Cause

Browser permission denied.

### Solution

* Enable location permissions.
* Use HTTPS or localhost.

---

## Gemini API Quota Exceeded

### Error

```bash
429 Too Many Requests
```

### Solution

* Generate a new API key.
* Wait for quota reset.
* Use fallback summary mechanism.

---

## Leaflet Map Not Displaying

### Solution

Ensure:

```bash
import 'leaflet/dist/leaflet.css'
```

is imported inside the application.

---

# 🔒 Security Features

* Password hashing using bcrypt.
* JWT Authentication.
* Role-based authorization.
* Protected API routes.
* Restricted officer functionalities.

---

# 🌍 Future Roadmap

* SMS & WhatsApp Alerts
* IVR-based Reporting
* AI-powered Wildlife Detection
* Wildlife Movement Prediction
* Camera Trap Integration
* IoT Sensor Integration
* Government System Integration

---

# 🤝 Contributors

## Sahaj Srivastava

Full Stack Developer

---

# 📜 License

This project was developed as part of a national-level hackathon prototype submission.

---

# ❤️ PRAHARI

**Protecting People. Conserving Wildlife. Empowering Communities.**

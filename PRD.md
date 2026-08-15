# PRD — PRAHARI

## 1. Product Overview

**Product Name:** PRAHARI (Community-Driven Early Warning System for Human-Wildlife Conflict)

**Purpose:** To reduce human-wildlife conflict in areas outside protected tiger reserves by enabling communities and forest officers to report incidents, detect risk hotspots, and receive real-time alerts.

**Context:** India is home to ~75% of the world's tiger population, with an increasing number living outside protected reserves. Current reporting relies on delayed, fragmented, word-of-mouth communication, endangering both people and wildlife.

---

## 2. Goals & Objectives

| Goal | Objective |
|------|-----------|
| Reduce response time | Report-to-alert cycle within minutes |
| Improve situational awareness | Real-time risk visualization on maps |
| Enable community participation | Simple incident reporting on mobile devices |
| Support officer decision-making | AI-generated intelligence summaries |
| Operate in low-connectivity areas | Store reports offline, sync when online |

---

## 3. User Personas

### 3.1 Community User
- **Background:** Village resident living near forest or reserve periphery.
- **Needs:** Report wildlife sightings quickly, check local risk level, receive warnings.
- **Pain Points:** Limited mobile data, difficult reporting channels, language barriers.

### 3.2 Forest Officer
- **Background:** Government wildlife/forest department staff.
- **Needs:** Dashboard overview of incidents, verify/resolve reports, AI summaries, monitor high-risk zones.
- **Pain Points:** Overwhelmed by volume of reports, no consolidated view of activity.

---

## 4. Functional Requirements

### 4.1 Authentication
- Users sign up with name, phone number (10-digit Indian format), village, role, and password.
- Passwords hashed with bcrypt before storage.
- JWT issued on login, stored in browser localStorage.
- Role-based access: `community` or `officer`.

### 4.2 Incident Reporting
- Users report incidents of the following types:
  - Tiger Sighting
  - Livestock Attack
  - Roaring Heard
  - Human Encounter
  - Pugmark Found
- Each report captures:
  - Incident type
  - Description (text, or voice-to-text input)
  - GPS coordinates (auto-captured via browser Geolocation API; manual village entry as fallback)
  - Village name
  - Timestamp (auto-recorded)
  - Reporter identity (linked to user)

### 4.3 Risk Engine
- Runs automatically when a new incident is reported.
- Looks back at incidents from the last 7 days (excluding resolved).
- Finds all incidents within a 5 km radius of the new incident.
- Applies severity weights:

| Incident Type | Weight |
|---------------|--------|
| Tiger Sighting | 10 |
| Human Encounter | 10 |
| Livestock Attack | 8 |
| Roaring Heard | 5 |
| Pugmark Found | 4 |

- Sums weights to produce a cumulative score.
- Classifies into risk levels:

| Score | Level |
|-------|-------|
| < 10 | LOW |
| 10 – 19 | MEDIUM |
| >= 20 | HIGH |

- The score and level are saved on the incident record.

### 4.4 Alert Generation
- When risk level reaches HIGH, an alert is automatically created.
- Alert includes: title, message referencing the village, risk level, affected area, and linked incidents.
- Alerts are viewable by both user roles.

### 4.5 Interactive Maps
- Nationwide map showing all incident markers with color-coded risk circles (red/yellow/green).
- Local map (centered on user's GPS) showing nearby incidents within 10 km and a 5 km risk-radius circle.
- Markers display popup details: incident type, village, risk level, description.

### 4.6 AI-Assisted Intelligence Summary
- Forest officers can request an AI summary for a specific village.
- Primary provider: Google Gemini 2.0 Flash.
- Fallback: OpenAI GPT-4o-mini, then a rule-based template if APIs are unavailable/quota-exceeded.
- Summary includes incident count, patterns, and recommended concern level.

### 4.7 Offline-First Support
- Incident reports are stored in browser LocalStorage when offline.
- Reports auto-sync to the server once connectivity is restored.

### 4.8 Role-Specific Dashboards
- **Community Dashboard:** Risk level for user's area, nearby incidents, recent alerts, safety advisory.
- **Officer Dashboard:** All incidents in the vicinity, AI intelligence summary, incident table with verify/resolve actions for pending reports.

### 4.9 Incident Lifecycle
- New incidents start as `pending`.
- Officers can mark incidents as `verified` or `resolved`.
- Resolved incidents are excluded from risk calculations.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Dashboard data refreshes every 10 seconds (polling) |
| Availability | Offline-first design for incident submission |
| Security | JWT tokens, bcrypt password hashing, protected routes |
| Scalability | Stateless REST API, MongoDB Atlas for horizontal scaling |
| Compatibility | Responsive design for mobile and desktop browsers |

---

## 6. Out of Scope (Future Roadmap)

- SMS and WhatsApp alert delivery
- IVR-based incident reporting
- Camera trap image analysis
- IoT sensor integration
- Predictive wildlife movement modeling
- Government system integration

---

## 7. Success Metrics

- Average time from incident report to alert generation
- Number of incidents reported per active user per week
- Reduction in human-wildlife conflict incidents in monitored areas
- Officer engagement rate with AI summaries
- Dashboard uptime and sync success rate

---

## 8. Constraints

- Targeted at regions with intermittent internet connectivity.
- Designed for Indian language context (voice input supports Indian English).
- Prototype-stage; not yet production-hardened for enterprise-scale deployment.

# 🛡️ BorderSync — Digital Border Management System

<div align="center">

![BorderSync](https://img.shields.io/badge/BorderSync-v1.0-6C5CE7?style=for-the-badge&logo=shield&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A full-stack digital platform for secure, efficient border checkpoint management, traveler registration, biometric verification, and humanitarian case coordination.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Demo Accounts](#-demo-accounts)
- [Modules In Detail](#-modules-in-detail)
- [OCR Integration](#-ocr-integration)
- [Biometric & Face Recognition](#-biometric--face-recognition)
- [NGO Humanitarian Panel](#-ngo-humanitarian-panel)
- [Analytics Dashboard](#-analytics-dashboard)
- [Security](#-security)
- [Known Limitations](#-known-limitations)

---

## 🌐 Overview

**BorderSync** is a comprehensive Digital Border Management System (DBMS) designed to modernize and digitize the operations of border checkpoints. It replaces paper-based and fragmented manual processes with a unified, secure, web-based platform that enables border officers, administrators, and NGO coordinators to collaborate in real time.

The system handles the complete lifecycle of a border crossing event — from the moment a traveler arrives at a checkpoint to document verification, biometric scanning, status assignment, case management, and humanitarian needs assessment. Every action is logged, traceable, and protected behind role-based authentication.

BorderSync is built with a focus on three core principles:

1. **Security** — JWT-based authentication, role guards on every route, encrypted sessions, and activity logging ensure that only authorized personnel can access sensitive traveler data.
2. **Efficiency** — OCR auto-fills traveler forms from scanned documents, biometric face matching reduces manual identity verification time, and the dashboard provides real-time statistics so supervisors always have situational awareness.
3. **Humanitarian Compliance** — NGO coordinators have a dedicated panel to assess and record the humanitarian needs of refugees, asylum seekers, and vulnerable travelers — ensuring proper support is allocated and tracked.

---

## 📸 Screenshots

### 🔐 Officer Sign In
The login page features a clean two-column layout. The left panel displays the BorderSync brand, system description, and feature highlights. The right panel contains the secure sign-in form. Sessions are encrypted using JWT tokens with an 8-hour expiry.

![Login Page](https://github.com/harshithKumar12/BorderSync/blob/main/screenshots/login.png)
> *Secure officer authentication with role-based access. Authorized personnel only.*

---

### 📊 Dashboard
The main dashboard gives administrators and border officers a real-time snapshot of checkpoint activity. Six stat cards display today's entries, pending verifications, approvals, flagged travelers, rejections, and open cases. The Recent Entries table shows the latest traveler registrations with clickable rows linking to full profiles.

![Dashboard](https://github.com/harshithKumar12/BorderSync/blob/main/screenshots/DashBoard.png)
> *Real-time statistics with today's entries, status breakdowns, and recent traveler activity.*

---

### 👤 Biometric Scan — Face Recognition
The Biometric Scan module contains two tabs. The Fingerprint tab simulates a 5-step scan protocol with animated scanner UI. The Face Recognition tab uses face-api.js running entirely in the browser to perform real facial detection and matching against registered traveler reference photos stored in MongoDB.

![Biometric Scan](https://github.com/harshithKumar12/BorderSync/blob/main/screenshots/%20Biometric%20Scan%20page%20with%20(face%20recognition).png)
> *Face Recognition tab powered by face-api.js — no server-side ML required.*

---

### 🛡️ Admin Panel
The Admin Panel is restricted to administrators only. It provides a form to register new officers with role assignment (Admin, Border Officer, NGO Coordinator) and lists all registered officers with the ability to activate or deactivate accounts in one click.

![Admin Panel](https://github.com/harshithKumar12/BorderSync/blob/main/screenshots/Admin%20Panel.png)
> *Officer management — register new accounts and control access in real time.*

---

## ✨ Features

### Core Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login with 8-hour token expiry, stored in localStorage |
| 👥 **Role-Based Access Control** | Three roles: Admin, Border Officer, NGO Coordinator — each with specific permissions |
| 🧳 **Traveler Registration** | Full form with document type, nationality, DOB, notes, and document image upload |
| 📋 **Traveler Management** | Paginated list with filters by status, nationality, and date range |
| 📁 **Case Management** | Open, assign, and update cases with priority levels and activity timeline |
| 📊 **Real-time Dashboard** | Live stats with today's entries, status counts, open cases, and recent entries table |
| 🛡️ **Admin Panel** | Register officers, assign roles, activate/deactivate accounts |
| 📈 **Analytics** | Visual breakdowns — donut charts, bar charts, nationality rankings, case type distribution |

### Advanced Features

| Feature | Description |
|---|---|
| 🔍 **OCR Text Recognition** | Tesseract.js scans uploaded document images and auto-fills form fields |
| 👁️ **Face Recognition** | face-api.js runs in-browser face detection and matching against traveler photos |
| 🖐️ **Biometric Simulation** | Animated 5-step fingerprint scan protocol with live scan log |
| 🏥 **Humanitarian Needs Panel** | NGO coordinators can assess and record 8 categories of traveler needs |
| 📝 **Activity Timeline** | Every case update, note, and needs assessment is logged with author and timestamp |
| 🔁 **Auto-redirect** | After submitting a new traveler entry, dashboard auto-refreshes with updated stats |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB 6.x with Mongoose ODM
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcryptjs for password hashing
- **File Upload:** Multer (for OCR document uploads)
- **OCR Engine:** Tesseract.js (runs server-side, processes uploaded images)
- **Middleware:** CORS, Morgan (HTTP logging), custom error handler, role guards

### Frontend
- **Architecture:** Single-page application — zero build step, pure HTML/CSS/JS
- **Fonts:** IBM Plex Sans, IBM Plex Mono, Syne (via Google Fonts)
- **Face Recognition:** face-api.js v0.22.2 (in-browser ML — TensorFlow.js backend)
- **Charts:** Native Canvas API (custom donut charts, bar charts)
- **HTTP:** Native Fetch API with JWT interceptor
- **Storage:** localStorage for token and user session

### Infrastructure
- **Dev Server:** Vite (for the React version) or Express static serve (`backend/public/`)
- **API Proxy:** Vite dev server proxies `/api` → `http://localhost:5000`
- **Database GUI:** MongoDB Compass (optional)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                     │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  index.html  │  │  face-api.js │  │  localStorage │  │
│  │  (SPA)       │  │  (In-browser │  │  (JWT Token)  │  │
│  │              │  │   ML)        │  │               │  │
│  └──────┬───────┘  └──────────────┘  └───────────────┘  │
│         │ Fetch API (/api/*)                             │
└─────────┼───────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS.JS API SERVER (:5000)               │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  /auth   │ │/travelers│ │  /cases  │ │/dashboard │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│  │  /admin  │ │  /ocr    │ │  JWT +   │                 │
│  │          │ │(Tesseract│ │  Role    │                 │
│  │          │ │  .js)    │ │  Guards  │                 │
│  └──────────┘ └──────────┘ └──────────┘                 │
└─────────────────────────┬───────────────────────────────┘
                          │ Mongoose ODM
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                       │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │
│  │  Officers │  │ Travelers │  │       Cases        │   │
│  │           │  │           │  │  (humanitarianNeeds│   │
│  │ name      │  │ name      │  │   shelter, medical │   │
│  │ email     │  │ nationality│  │   legalSupport...  │   │
│  │ role      │  │ docType   │  │   notes timeline)  │   │
│  │ badgeNum  │  │ status    │  │                    │   │
│  │ isActive  │  │ scannedDoc│  │                    │   │
│  └───────────┘  └───────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
BorderSync/
├── backend/
│   ├── controllers/
│   │   ├── authController.js         # Login, register, /me
│   │   ├── travelerController.js     # CRUD + delete travelers
│   │   ├── caseController.js         # Cases + humanitarian needs
│   │   └── dashboardController.js    # Stats + recent entries
│   ├── middleware/
│   │   ├── verifyToken.js            # JWT verification
│   │   ├── roleGuard.js              # Role-based route protection
│   │   └── errorHandler.js           # Global error handler
│   ├── models/
│   │   ├── Officer.js                # Officer schema (auth)
│   │   ├── Traveler.js               # Traveler schema
│   │   └── Case.js                   # Case schema + humanitarianNeeds
│   ├── routes/
│   │   ├── auth.js                   # POST /login, /register
│   │   ├── travelers.js              # GET/POST/PATCH/DELETE travelers
│   │   ├── cases.js                  # GET/POST/PATCH cases + /needs
│   │   ├── dashboard.js              # GET /stats
│   │   ├── admin.js                  # GET/PATCH officers
│   │   └── ocr.js                    # POST /scan (Tesseract.js)
│   ├── uploads/                      # Temp directory for OCR uploads
│   ├── public/
│   │   └── index.html                # Standalone SPA (served directly)
│   ├── seed.js                       # Database seeder
│   ├── server.js                     # Express app entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── models/                   # face-api.js ML model files
    │   │   ├── ssd_mobilenetv1_model*
    │   │   ├── face_landmark_68_model*
    │   │   └── face_recognition_model*
    │   └── index.html                # (Vite entry point)
    ├── src/                          # React/Vite source (alternative)
    ├── index.html                    # Main SPA entry
    ├── vite.config.js                # Vite + API proxy config
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB** v6 or higher — [Download](https://www.mongodb.com/try/download/community)
- **npm** v9 or higher (comes with Node.js)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/bordersync.git
cd bordersync
```

### Step 2 — Start MongoDB

**Windows:**
```powershell
net start MongoDB
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4 — Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bordersync
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Step 5 — Seed the Database

This creates 3 demo officers, 10 travelers, and 5 cases:

```bash
node seed.js
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👮 Created 3 officers
🧳 Created 10 travelers
📁 Created 5 cases

✅ Seed complete! Demo accounts:
   Admin:   admin@bordersync.io   / admin123
   Officer: officer@bordersync.io / officer123
   NGO:     ngo@bordersync.io     / ngo123
```

### Step 6 — Start the Backend

```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

### Step 7 — Start the Frontend (Optional — if using Vite)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

> **Note:** If you are using the standalone `index.html` directly served from `backend/public/`, you do not need to run the frontend dev server. Just open **http://localhost:5000** in your browser.

### Step 8 — Set Up Face Recognition Models (Optional)

To enable face recognition, download the model files and place them in `frontend/public/`:

1. Go to [https://github.com/justadudewhohacks/face-api.js/tree/master/weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
2. Download these files:
   - `ssd_mobilenetv1_model-weights_manifest.json` + `.bin` shard
   - `face_landmark_68_model-weights_manifest.json` + `.bin` shard
   - `face_recognition_model-weights_manifest.json` + `.bin` shard
3. Place all files inside `frontend/public/`

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `MONGODB_URI` | `mongodb://localhost:27017/bordersync` | MongoDB connection string |
| `JWT_SECRET` | `dev_secret` | Secret key for signing JWT tokens — **change in production** |

---

## 📡 API Reference

All routes are prefixed with `/api`. All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email + password |
| `POST` | `/api/auth/register` | Admin | Register a new officer |
| `GET` | `/api/auth/me` | All | Get current logged-in user |

### Travelers

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/travelers` | All | List travelers (paginated, filterable) |
| `POST` | `/api/travelers` | Officer, Admin | Create new traveler entry |
| `GET` | `/api/travelers/:id` | All | Get traveler detail + linked case |
| `PATCH` | `/api/travelers/:id` | Officer, Admin | Update traveler status or notes |
| `DELETE` | `/api/travelers/:id` | Admin | Delete traveler + all related cases |

**Query parameters for `GET /api/travelers`:**

| Param | Type | Description |
|---|---|---|
| `status` | `pending\|approved\|flagged\|rejected` | Filter by status |
| `nationality` | `string` | Filter by nationality |
| `startDate` | `ISO date` | Filter entries from this date |
| `endDate` | `ISO date` | Filter entries up to this date |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Results per page (default: 10) |

### Cases

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cases` | All | List cases (paginated, filterable) |
| `POST` | `/api/cases` | Officer, Admin | Open a new case for a traveler |
| `GET` | `/api/cases/:id` | All | Get case detail with traveler + officer |
| `PATCH` | `/api/cases/:id` | All | Update case status, priority, add note |
| `PATCH` | `/api/cases/:id/needs` | NGO, Admin | Update humanitarian needs assessment |

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | All | Get stats + recent entries |

**Response:**
```json
{
  "totalToday": 3,
  "pending": 4,
  "flagged": 2,
  "approved": 4,
  "rejected": 1,
  "openCases": 6,
  "recentEntries": [...]
}
```

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/officers` | Admin | List all officers |
| `PATCH` | `/api/admin/officers/:id/toggle` | Admin | Activate / deactivate officer |

### OCR

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ocr/scan` | Officer, Admin | Upload document image, get extracted fields |

**Form data:** `document` (image file — JPG/PNG/WEBP, max 10MB)

**Response:**
```json
{
  "success": true,
  "extracted": {
    "docNumber": "P938274",
    "name": "Ahmed Hassan",
    "nationality": "Egyptian",
    "dateOfBirth": "1985-03-22",
    "documentType": "passport"
  },
  "rawText": "Passport No: P938274\nName: Ahmed Hassan...",
  "confidence": 87
}
```

---

## 🔒 Role-Based Access Control

BorderSync implements three distinct roles, each with a specific set of permissions:

### 👑 Administrator (`admin`)

The Administrator has full system access. They can perform every operation across all modules.

- ✅ View Dashboard (full stats)
- ✅ Create, edit, and delete traveler entries
- ✅ Open, update, and close cases
- ✅ Update humanitarian needs assessments
- ✅ Access Analytics page
- ✅ Register new officers
- ✅ Activate / deactivate officer accounts
- ✅ Access Admin Panel
- ✅ Use Biometric Scan
- ✅ Delete travelers

### 🚔 Border Officer (`border_officer`)

Border Officers handle the day-to-day checkpoint operations. They can create and manage travelers and cases but cannot access system administration.

- ✅ View Dashboard (full stats)
- ✅ Create new traveler entries (with OCR)
- ✅ Update traveler status and notes
- ✅ Open and update cases
- ✅ Use Biometric Scan
- ❌ Cannot delete travelers
- ❌ No Admin Panel access
- ❌ No Analytics access

### 🏥 NGO Coordinator (`ngo_coordinator`)

NGO Coordinators have read access to traveler and case data and write access to humanitarian needs assessments only.

- ✅ View Dashboard (open cases + flagged only)
- ✅ Browse travelers (read-only)
- ✅ View case details
- ✅ Update humanitarian needs panels on cases
- ❌ Cannot create or modify traveler entries
- ❌ Cannot open or update cases (except needs)
- ❌ No Admin Panel
- ❌ No Biometric Scan

---

## 🔑 Demo Accounts

These accounts are created by running `node seed.js`:

| Role | Email | Password | Badge |
|---|---|---|---|
| Administrator | `admin@bordersync.io` | `admin123` | `#ADM-001` |
| Border Officer | `officer@bordersync.io` | `officer123` | `#OFF-042` |
| NGO Coordinator | `ngo@bordersync.io` | `ngo123` | `#NGO-007` |

---

## 🧩 Modules In Detail

### 1. Traveler Registration (New Entry)

The New Entry form allows border officers and admins to register a traveler at a checkpoint. Every field is validated before submission.

**Fields:**
- Full Name (required)
- Nationality (required)
- Document Type — Passport, Visa, or Refugee Card (required)
- Document Number (required)
- Date of Birth (required)
- Notes (optional)
- Document Scan — image upload (optional, stored as base64 in MongoDB)

When a document image is uploaded, the system automatically calls the OCR endpoint in the background. If Tesseract.js can extract text from the image, it auto-fills the document number, name, nationality, date of birth, and document type fields. A status indicator inside the upload zone shows `✓ Auto-filled: Doc Number, Name` on success or a warning message if extraction fails.

---

### 2. Traveler List & Detail

The Travelers page shows a paginated table (10 per page) with filters:

- **Status filter** — All, Pending, Approved, Flagged, Rejected
- **Nationality filter** — Free text search
- **Date range filter** — From/To date pickers

Clicking any row opens the Traveler Detail page, which shows:
- Full profile card with name, nationality, status badge, and unique ID
- Document details grid (type, number, DOB, entry time, exit time, assigned officer)
- Notes field
- Scanned document image preview (if uploaded)
- Update Record panel (status change + notes edit)
- Delete button (admin only)
- Linked Case card (click to open case detail)
- Open Case form (if no case linked yet)

---

### 3. Case Management

Cases track the investigation or processing status of a traveler beyond the initial checkpoint entry. Each case belongs to one traveler and is assigned to one officer.

**Case Types:** Regular, Refugee, Asylum, Flagged

**Statuses:** Open → In Progress → Resolved or Escalated

**Priority Levels:** Low, Medium, High

The Case Detail page includes:
- Case header with type, priority badge, and status badge
- Case metadata grid (assigned officer, badge number, opened date, last updated, note count)
- Linked Traveler Record card
- NGO Humanitarian Needs Panel (see below)
- Activity Timeline — all notes in reverse chronological order with author and timestamp
- Update Case panel — change status, priority, add notes

---

## 🏥 NGO Humanitarian Needs

Every case has a dedicated **Traveler Needs Assessment** panel visible to all roles. NGO Coordinators and Admins can edit it; Border Officers see it read-only.

The panel contains 8 need categories, each as a toggle checkbox:

| Need | Icon | Description |
|---|---|---|
| Shelter Required | 🏠 | Traveler needs temporary or permanent housing |
| Medical Attention | 🏥 | Requires medical examination or treatment |
| Legal Support | ⚖️ | Needs legal representation or advice |
| Child Protection | 👶 | Minor or unaccompanied child requiring safeguarding |
| Food & Water | 🍽️ | Basic nutrition and hydration needs |
| Psychosocial Support | 🧠 | Mental health or trauma support required |
| Family Tracing | 👨‍👩‍👧 | Separated from family, tracing required |
| Transportation | 🚌 | Needs transport to shelter, hospital, or repatriation |

Saving an assessment automatically logs an entry in the case's Activity Timeline:
> *"Humanitarian needs assessment updated by Sara NGO"*

The panel header shows a live count: `3 of 8 needs identified`

---

## 🔍 OCR Integration

The OCR module uses **Tesseract.js** running on the Node.js backend to extract text from uploaded document images.

### How It Works

1. Officer uploads a passport/ID scan image in the New Entry form
2. The image is sent via `multipart/form-data` to `POST /api/ocr/scan`
3. Tesseract.js processes the image (supports JPG, PNG, WEBP, BMP, TIFF)
4. The extracted raw text is parsed with a series of regex patterns and heuristics:
   - **MRZ lines** — the machine-readable zone at the bottom of passports is detected first (format: 30–44 character lines of `A-Z0-9<`)
   - **Label-based extraction** — lines containing `Passport No:`, `Name:`, `Nationality:`, `Date of Birth:` are parsed
   - **Generic fallback** — patterns like `[A-Z]{1,2}[0-9]{6,9}` catch document numbers not preceded by labels
5. The extracted fields are returned and used to auto-fill the New Entry form
6. The temp file is deleted from the server after processing

### Supported Extractions

- Document number (MRZ or label-based)
- Full name
- Nationality
- Date of birth (multiple formats: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY)
- Document type (inferred from keywords: "visa", "refugee", "UNHCR")

### Installation

```bash
cd backend
npm install tesseract.js multer
mkdir uploads
```

Add to `server.js`:
```js
const ocrRoutes = require('./routes/ocr');
app.use('/api/ocr', ocrRoutes);
```

---

## 👁️ Biometric & Face Recognition

The Biometric Scan page has two tabs:

### Tab 1 — Fingerprint Simulation

An animated fingerprint scanner UI that simulates a real 5-step biometric protocol:

1. **Device Initialization** — Connecting to biometric reader
2. **Finger Detection** — Waiting for finger placement on sensor
3. **Image Capture** — Capturing high-resolution fingerprint image
4. **Feature Extraction** — Extracting minutiae points and ridge patterns
5. **Database Matching** — Comparing against registered traveler records

Each step lights up sequentially with a scanning line animation. On completion, a biometric reference ID is generated (e.g., `BIO-A3F2-84921`). The officer then enters a traveler's document number and clicks **Verify Traveler** — the system searches MongoDB and shows a match result card.

### Tab 2 — Face Recognition

Real ML-powered face recognition running entirely in the browser using **face-api.js v0.22.2** (TensorFlow.js backend).

**How It Works:**
1. Officer uploads a photo of the person to identify
2. `faceapi.detectSingleFace()` runs with SsdMobilenetv1 detector to locate the face
3. A 128-dimensional face descriptor vector is extracted using FaceRecognitionNet
4. The system loads all travelers who have reference photos stored in MongoDB
5. Each reference photo is processed through the same pipeline
6. Euclidean distance is calculated between the probe descriptor and all reference descriptors
7. The closest match below the threshold (0.50) is reported as a confirmed identity

**Results:**
- ✅ **Green — Match Confirmed** — distance < 0.50, shows traveler name, doc number, status, and link to profile
- ⚠️ **Amber — Low Confidence** — distance 0.50–0.62, possible match, manual verification recommended
- ❌ **Red — No Match** — distance > 0.62, offers option to register new traveler

**Model Setup:**

Place these files in `frontend/public/`:
```
ssd_mobilenetv1_model-weights_manifest.json
ssd_mobilenetv1_model.bin
face_landmark_68_model-weights_manifest.json
face_landmark_68_model.bin
face_recognition_model-weights_manifest.json
face_recognition_model.bin
```

Download from: [https://github.com/justadudewhohacks/face-api.js/tree/master/weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

---

## 📈 Analytics Dashboard

The Analytics page (Admin only) provides visual breakdowns of all traveler and case data:

### Row 1 — Summary Cards
Six stat cards: Total Travelers, Approved, Pending, Flagged, Rejected, Total Cases

### Row 2 — Status & Document Breakdown
- **Traveler Status Donut** — Canvas-drawn donut chart with color-coded segments and animated progress bars for each status
- **Document Types Bar Chart** — Horizontal bar chart for Passport, Visa, Refugee Card with percentage labels

### Row 3 — Geographic & Case Status
- **Top Nationalities** — Ranked list of the 6 most frequent nationalities with gradient bars relative to the top entry
- **Case Status Donut** — Shows Open, In Progress, Resolved, Escalated distribution

### Row 4 — Case Types
Four big-number cards for Regular, Refugee, Asylum, and Flagged case types, each with a colored indicator bar proportional to the count.

All charts are drawn using the native Canvas API — no external charting library required.

---

## 🔐 Security

### Authentication
- Passwords are hashed using **bcryptjs** with salt rounds of 10 before storage — plain-text passwords are never stored
- JWT tokens are signed with `HS256` algorithm and expire after 8 hours
- The `verifyToken` middleware validates every token on every protected route
- `401 Unauthorized` responses automatically trigger a logout on the frontend

### Authorization
- Every route is protected by the `roleGuard` middleware which checks the decoded JWT role against the allowed roles array
- Role-specific UI elements are hidden client-side but the real enforcement is on the server
- The admin route (`/api/admin`) requires the `admin` role — officers and NGO coordinators cannot access it even if they discover the endpoint

### Data
- Document scans are stored as base64 strings in MongoDB — they are never written to the filesystem permanently (OCR temp files are deleted immediately after processing)
- All API responses strip the `passwordHash` field before sending officer data to the client

### Production Recommendations
- Set `JWT_SECRET` to a long random string (32+ characters) in production
- Use HTTPS in production
- Set MongoDB authentication and restrict connection to localhost or VPN
- Consider rate limiting the `/api/auth/login` endpoint to prevent brute force attacks
- Rotate JWT secrets periodically

---

## ⚠️ Known Limitations

- **Face Recognition** requires clear, frontal, well-lit face photos. Heavily obscured, low-resolution, or sideways photos may not detect. The `SsdMobilenetv1` model has a minimum confidence threshold of 0.3.
- **OCR accuracy** depends on image quality. Printed, clearly photographed documents work best. Handwritten text, low-resolution scans, or angled photos reduce accuracy.
- **Biometric Fingerprint** is a simulation only — no actual fingerprint hardware integration is implemented. It serves as a UI/UX placeholder for future hardware SDK integration.
- **Single-file SPA** — the `index.html` is a zero-dependency standalone app. It is not minified or code-split. For large-scale deployments, migrating to the Vite/React build is recommended.
- **No email notifications** — status changes and case updates do not trigger email or SMS alerts. This could be added with Nodemailer or Twilio.
- **No audit log collection** — while activity is logged within individual case timelines, there is no centralized audit log for system-wide officer actions.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 BorderSync

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Built with ❤️ for humanitarian border management operations.

**BorderSync v1.0** · Digital Border Management System

</div>

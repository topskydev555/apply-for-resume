# Reactive Resume

AI-powered resume builder that tailors your resume for any job with ATS (Applicant Tracking System) optimization.

---

## Project Architecture

```
resume-builder/
├── resume-builder-app/      # Frontend + Chrome extension
└── resume-builder-backend/  # PDF generation API
```

### Overview

| Part | Stack | Purpose |
|------|--------|---------|
| **resume-builder-app** | React 19, Vite 7, TypeScript | Web app + Chrome side-panel extension |
| **resume-builder-backend** | Node.js, Express, Puppeteer | HTML → PDF conversion |

---

## `resume-builder-app`

React SPA that runs as a web app or Chrome side-panel extension.

### Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** — dev server and build
- **IndexedDB** — local storage for resumes and sessions
- **OpenAI API** (gpt-4o-mini) — resume improvement and Q&A
- **pdfjs-dist** — PDF text extraction
- **mammoth** — DOCX text extraction

### Structure

```
resume-builder-app/
├── src/
│   ├── components/       # UI components
│   │   ├── ApiKeySettings, ChatPanel, ConfirmModal
│   │   ├── CreateSessionModal, RegenerateModal, ResultModal
│   │   ├── ResultBadges, SettingsModal, TemplateSelector
│   │   └── Icons
│   ├── services/
│   │   ├── openai.ts     # API key storage, connection test
│   │   ├── pdf.ts        # PDF generation via backend
│   │   ├── resume.ts     # AI improve/update, Q&A helpers
│   │   └── storage.ts    # IndexedDB (resumes, sessions)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── extension/            # Chrome extension files
│   ├── manifest.json
│   └── background.js
├── scripts/
│   └── copy-extension.mjs
├── vite.config.ts        # Web build
└── vite.config.extension.ts  # Extension build
```

### Features

1. **Resume upload** — PDF, DOCX, TXT
2. **Apply sessions** — one session per job application
3. **ATS optimization** — AI improves resume for a job description
4. **Templates** — classic, modern, minimal, professional
5. **Regenerate** — edit existing result with natural language
6. **Job application Q&A** — AI suggests questions and answers
7. **PDF export** — via backend API

### Builds

| Command | Output |
|---------|--------|
| `npm run dev` | Dev server (web) |
| `npm run build` | Web build → `dist/` |
| `npm run build:extension` | Extension build → `dist-extension/` |

---

## `resume-builder-backend`

Express API that converts HTML to PDF with Puppeteer.

### Tech Stack

- **Express** — HTTP server
- **Puppeteer** — headless Chrome for PDF generation
- **CORS** — cross-origin requests

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/pdf` | `{ html }` → returns base64 PDF |
| GET | `/health` | Health check |

### Configuration

- **Port**: `PORT` env var or `3000`
- **Request limit**: 2MB JSON body

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  resume-builder-app (Browser / Extension)                    │
│                                                             │
│  Upload resume → IndexedDB (resumes)                        │
│  Create session → IndexedDB (sessions)                      │
│  AI improve → OpenAI API (resume text → HTML)                │
│  PDF export → Backend /api/pdf (HTML → PDF)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  resume-builder-backend                                      │
│                                                             │
│  POST /api/pdf → Puppeteer → A4 PDF (base64)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup

### Prerequisites

- Node.js 18+
- Chrome (for extension)

### 1. Backend

```bash
cd resume-builder-backend
npm install
npm run dev
```

Runs on **http://localhost:3000** (or `PORT`).

### 2. Frontend (Web)

```bash
cd resume-builder-app
npm install
npm run dev
```

Vite proxy: `/api` → backend. OpenAI API key must be set in Settings.

### 3. Extension

```bash
cd resume-builder-app
npm run build:extension
```

In Chrome: `chrome://extensions` → Load unpacked → select `resume-builder-app/dist-extension`.

**Extension note**: manifest uses `http://213.139.77.241:5555/*` for PDF API. Adjust `host_permissions` if using another backend URL.

---

## Environment

| Variable | Where | Purpose |
|----------|-------|---------|
| `PORT` | Backend | Server port (default 3000) |
| `VITE_API_URL` | App (extension build) | Backend URL for PDF API |

---

## External Services

- **OpenAI API** — resume improvement, Q&A (user API key)
- **Fonts** — Google Fonts (extension only)

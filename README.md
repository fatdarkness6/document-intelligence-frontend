# 📄 DocIntel — AI Document Intelligence Frontend

DocIntel is a responsive document-intelligence application for uploading files, generating AI summaries, chatting with document content, analyzing spreadsheets, organizing a document library, and downloading reports.

This repository contains the frontend, built with **Nuxt 4, Vue 3, TypeScript, Quasar, and Pinia**. It communicates with a separate **FastAPI** backend.

## ✨ Features

### Authentication and security

- Registration and login
- JWT bearer authentication
- Persistent authentication using cookies
- Protected and guest-only routes
- Automatic user restoration through `/auth/me`
- Password changes from the settings page
- Automatic logout and redirection when authentication expires

### Document management

Supported formats:

- PDF
- DOCX
- TXT
- CSV
- XLSX

The current maximum upload size is **20 MB**.

Users can:

- Upload, search, rename, and delete documents
- Paginate and filter the document library
- Mark documents as favorites
- Organize documents with folders and tags
- Reprocess completed or failed documents
- Download generated PDF reports
- See processing, completed, and failed states
- Receive real-time processing stage, message, and progress updates

### Real-time processing status

Document processing uses authenticated Server-Sent Events instead of repeatedly polling the document-detail endpoint.

- One shared SSE connection per active document
- Bearer token sent through the `Authorization` header
- Immediate durable status snapshot after connecting
- Support for `status`, `completed`, `failed`, and `ping` events
- `Last-Event-ID` reconnection and duplicate-event protection
- Bounded exponential reconnection with offline recovery
- One document-detail request as a fallback when the stream fails
- Automatic cleanup when pages unmount or the user logs out

See [Real-Time Document Processing](#-real-time-document-processing) for the endpoint contract.

### AI summaries and document chat

- AI-generated summaries
- Question and answer history
- Immediate display of newly sent questions
- Smooth, scrollable Quasar chat interface
- Conversational follow-up questions
- Semantic document retrieval
- Source previews and PDF page citations
- Loading and error states

The backend uses a RAG pipeline with pgvector to retrieve relevant chunks before generating a grounded answer.

```text
Question
   ↓
Embedding
   ↓
pgvector semantic search
   ↓
Relevant document chunks
   ↓
LLM
   ↓
Grounded answer with sources
```

### Spreadsheet intelligence

CSV and XLSX documents can display:

- Row and column counts
- Column names and data types
- Missing values
- Mean and standard deviation
- Minimum, maximum, and quartiles
- AI-generated spreadsheet insights

Spreadsheet analysis is performed by the backend using Pandas.

### Folders, tags, and favorites

- Create, rename, and delete folders
- Move documents into or out of folders
- Create, rename, and delete tags
- Assign multiple tags to a document
- Filter by folder, tag, or favorite status

### Dashboard

The responsive dashboard summarizes:

- Total documents
- PDF, DOCX, text, and spreadsheet documents
- Processing and failed documents
- Total questions asked
- Recent workspace activity

### Settings and appearance

- Account information
- Password change form using the shared form builder and Yup validation
- Persistent light and dark modes powered by Quasar
- Compact navigation preference
- Session and logout controls

### Public pages and metadata

- Responsive public landing page
- Login and registration pages linked to each other
- Per-page titles and descriptions
- Open Graph site metadata
- Theme and color-scheme metadata
- SVG favicon and web app manifest
- Smooth landing-page navigation powered by Lenis

## 🛠️ Tech Stack

### Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Quasar 2 and Material Icons
- Pinia
- vee-validate and Yup
- Nuxt `$fetch`
- Fetch Streams API for authenticated SSE
- Lenis
- SCSS
- Inter and Vazirmatn variable fonts

### Backend integration

The separate backend uses technologies including:

- Python and FastAPI
- PostgreSQL, SQLAlchemy, and Alembic
- pgvector
- Pandas
- OpenAI API
- ReportLab

## 🧠 Application Workflow

```text
Document Upload
      ↓
FastAPI processing pipeline
      ↓
Text extraction / spreadsheet analysis
      ↓
Chunking and embedding generation
      ↓
PostgreSQL + pgvector
      ↓
Summary, insights, and grounded answers
      ↓
Nuxt frontend
```

Normal API requests follow a centralized path:

```text
Pages / Components
        ↓
Feature composables
        ↓
useApi()
        ↓
Configured $fetch client
        ↓
FastAPI
```

Long-running processing updates use:

```text
Document list / detail page
            ↓
useDocumentProcessingStore()
            ↓
useDocumentStatusStream()
            ↓
Authenticated fetch + SSE parser
            ↓
GET /documents/{id}/events
```

The Pinia processing store reference-counts page subscribers, allowing multiple views to share one connection for a document. API URLs, authorization logic, stream parsing, and reconnection behavior remain outside UI components.

## 📂 Project Structure

```text
app/
├── assets/
│   └── styles/
├── components/
│   ├── auth/
│   ├── common/
│   ├── dashboard/
│   ├── documents/
│   ├── folders/
│   ├── landing/
│   ├── settings/
│   └── tags/
├── composables/
│   ├── useApi.ts
│   ├── useAppFeedback.ts
│   ├── useAppPreferences.ts
│   ├── useAuthSecurity.ts
│   ├── useDocumentAnalysis.ts
│   ├── useDocumentChat.ts
│   ├── useDocuments.ts
│   ├── useDocumentStatusStream.ts
│   ├── useFolders.ts
│   ├── usePageSeo.ts
│   └── useTags.ts
├── layouts/
│   ├── auth.vue
│   ├── default.vue
│   └── public.vue
├── middleware/
│   ├── auth.ts
│   └── guest.ts
├── pages/
│   ├── documents/
│   │   ├── [id].vue
│   │   └── index.vue
│   ├── dashboard.vue
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   └── settings.vue
├── plugins/
│   ├── api.ts
│   ├── auth-init.ts
│   ├── lenis.client.ts
│   └── theme.ts
├── schemas/
│   ├── auth.schema.ts
│   └── security.schema.ts
├── stores/
│   ├── auth.ts
│   └── documentProcessing.ts
├── types/
└── utils/
    ├── normalizeApiError.ts
    └── parseSseStream.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A running DocIntel backend

### 1. Clone the repository

```bash
git clone https://github.com/fatdarkness6/docintel-frontend.git
cd document-intelligence-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create a `.env` file in the project root:

```env
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api/v1
```

The API base must include the backend version prefix, such as `/api/v1`.

### 4. Start development

```bash
npm run dev
```

The application is normally available at [http://localhost:3000](http://localhost:3000).

### 5. Build and preview

```bash
npm run build
npm run preview
```

Other available command:

```bash
npm run generate
```

## 🔌 Backend API

Default development URLs:

```text
API:     http://127.0.0.1:8000/api/v1
Swagger: http://127.0.0.1:8000/docs
```

Protected requests automatically include:

```http
Authorization: Bearer ACCESS_TOKEN
```

Login uses FastAPI's OAuth2 form format:

```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded
```

The email is sent in the `username` field. After login, the frontend stores the access token, retrieves the user through `GET /auth/me`, and redirects to the dashboard.

Password changes use:

```http
POST /auth/change-password
Content-Type: application/json
```

```json
{
  "current_password": "current password",
  "new_password": "new password"
}
```

## 📡 Real-Time Document Processing

While a document is processing, the frontend subscribes to:

```http
GET /documents/{document_id}/events
Accept: text/event-stream
Authorization: Bearer ACCESS_TOKEN
```

Native `EventSource` is not used because it cannot attach the required bearer header. The dependency-free client uses `fetch`, `ReadableStream`, and a small SSE frame parser.

Supported events:

- `status` — queued or in-progress state
- `completed` — successful terminal state; the server closes the stream
- `failed` — safe terminal failure state; the server closes the stream
- `ping` — heartbeat ignored by the UI

Status payloads contain:

```json
{
  "document_id": 42,
  "status": "processing",
  "stage": "generating_summary",
  "progress": 70,
  "message": "Generating document summary",
  "updated_at": "2026-08-15T10:30:00Z"
}
```

On reconnect, the client sends `Last-Event-ID` when available and ignores events it has already handled. If the stream cannot be established, one document-detail request is used as a fallback; the former continuous three-second polling loop has been removed.

## 📱 UI and Responsive Design

The app follows a Quasar-first approach:

```text
Quasar components
       +
Quasar grid and responsive utilities
       +
Application design tokens
       +
Small custom SCSS layer
```

Commonly used Quasar building blocks include `QLayout`, `QHeader`, `QDrawer`, `QPage`, `QCard`, `QDialog`, `QChatMessage`, `QFile`, `QSelect`, and `QPagination`.

Application colors and surfaces are exposed through reusable CSS variables, including:

```css
--app-background
--app-surface
--app-surface-alt
--app-text
--app-text-secondary
--app-border
--app-radius-sm
--app-radius-md
--app-radius-lg
```

## 🔒 Security Notes

- Protected frontend routes require authentication.
- Protected API and SSE requests send bearer authorization headers.
- The SSE token is never placed in the URL.
- Invalid authentication clears the frontend session.
- The backend is responsible for ownership validation and returns safe authorization errors.
- Inaccessible and unknown document streams should both return `404` to avoid leaking document existence.

## 🚧 Possible Future Improvements

- Multi-document knowledge bases
- Streaming AI answer tokens
- Advanced RAG and reranking
- Cloud or object storage
- Redis caching
- Advanced spreadsheet visualizations
- Saved or shared AI conversations
- Shared workspaces
- More advanced document search
- Automated unit and end-to-end tests

## 🎯 Project Goal

DocIntel demonstrates a complete workflow that combines modern frontend engineering, Python backend development, document processing, relational and vector databases, AI-assisted analysis, and responsive product design.

## 📸 Screenshots

Screenshots can be added for:

- Landing page
- Login and registration
- Dashboard
- Document library
- Document detail and AI chat
- Spreadsheet analysis
- Settings and dark mode

## 📄 License

This project is currently intended for educational, portfolio, and development purposes.

## 👨‍💻 Author

**Arsam**

Full-stack Engineer focused on modern web development, Python backend engineering, and AI-powered applications.

GitHub: [fatdarkness6](https://github.com/fatdarkness6)

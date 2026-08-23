# Fraud Detection & Money Mule Network Tracker

## Overview

**Fraud Detection & Money Mule Network Tracker** (brand: **FraudNet Tracker**) is a full-stack, graph-powered fraud investigation platform designed to investigate complex fraud topologies, circular fund routing, shared device/phone/address clusters, fan-in / smurfing patterns, and connected account networks.

The platform integrates a high-performance **Node.js + Express** backend, a **CognoDB Cloud** graph database running over the Bolt protocol (`bolt+s://`), a **Cypher fraud detection engine**, stateless **JWT authentication**, and an interactive **React + Vite + Tailwind CSS + Cytoscape.js** investigation workspace.

---

## Current Status

**Current State:** `Backend + Authentication + Authenticated Investigation Workspace`

### Implemented Capabilities

#### 1. Backend & Graph Database
- Node.js + Express backend in ES modules mode with security headers (`helmet`), compression (`compression`), and CORS support.
- CognoDB Cloud connectivity layer using `neo4j-driver` over Bolt protocol (`bolt+s://`).
- Shared singleton database driver with automated configuration validation, error isolation, and graceful shutdown lifecycle management.
- Real liveness & database-aware health check endpoint at `GET /api/health` returning `200 OK` when connected and `503 Service Unavailable` when degraded.
- Graph domain model definition and idempotent uniqueness constraints initialized and verified in CognoDB Cloud (`Person.id`, `Account.id`, `Device.id`, `PhoneNumber.id`, `Address.id`, `User.id`, `User.email`).
- Deterministic synthetic dataset (24 Persons, 28 Accounts, 10 Devices, 10 PhoneNumbers, 10 Addresses, 140 Transfers) generated and verified in CognoDB.
- Parameterized Cypher fraud detection engine (`fraudDetectionService.js`) implementing bounded graph algorithms (circular transfer, shared device, shared phone, shared address, fan-in / dispersal smurfing, multi-signal investigation).
- Transparent rule-based heuristic risk scoring (weights: Circular Transfer: 40, Smurfing: 30, Shared Device: 15, Shared Phone: 10, Shared Address: 5; bands: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

#### 2. Authentication Layer
- Application User model (`:User`) decoupled from fraud-domain `(:Person)` entities.
- Password hashing using `bcryptjs` with work factor 12 (passwords and hashes are never logged, returned, or exposed).
- Stateless JWT authentication (`jsonwebtoken`) with configurable expiration (`JWT_EXPIRES_IN=1h`) and minimal payload (`sub`, `email`, `role`).
- Authentication endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- Authentication middleware (`authMiddleware.js`) enforcing valid JWT Bearer tokens across all `/api/fraud/*` endpoints.

#### 3. Public Frontend Experience
- Responsive public pages designed with a warm beige (`#FAF7F2`) and deep teal (`#0E4D45`) aesthetic.
- **Landing Page (`/`):** Hero section with animated relationship graph, 5 fraud detection capability cards, 5-step process walkthrough, illustrative interactive preview, and value propositions.
- **Login Page (`/login`):** Client-side validation, secure credential submission, show/hide password toggle, and JWT storage.
- **Register Page (`/register`):** User onboarding with client-side password validation and default investigator role assignment.

#### 4. Authenticated Investigation Workspace
- Responsive authenticated application shell (`AppShell`) with protected routing (`ProtectedRoute`), mobile sidebar drawer, and breadcrumb navigation.
- **Dashboard (`/dashboard`):** Prominent account search, five detection pattern preview cards, conceptual graph intelligence preview, 4-step investigation workflow, session-only recent investigations table, live database/API status check from `/api/health`, and authenticated investigator profile from `/api/auth/me`.
- **Investigate Account (`/investigate`, `/investigate/:id`):** On-demand multi-signal investigation report rendering backend-driven risk score (0–100), risk level badge, detected signal cards with severity tags, mini network overview, conditional inbound/outbound transaction evidence, conditional connected entity tabs, and investigation details.
- **Network Graph (`/graph`, `/graph/:id`):** Interactive Cytoscape.js canvas driven strictly by real API evidence records, featuring primary account visual dominance (larger size, emerald ring, distinct labeling), node visual hierarchy, label contrast outlines, tuned dense CoSE layout, directional transfer arrows, zoom/pan/fit/lock controls, in-graph node search, layout switching (`cose`, `concentric`, `breadthfirst`), selected entity inspector sidebar, and graph legend.
- **Detection Patterns (`/patterns`):** Educational documentation for all five supported Cypher detection algorithms with conceptual diagrams, signal descriptions, and direct investigation CTAs.
- **Recent Investigations (`/recent`):** Session-only investigation history stored in browser `sessionStorage` with relative local timestamps, quick search, and session reset capability.
- **Settings (`/settings`):** Live investigator profile from `/api/auth/me`, database connection status from `/api/health` with "Test Connection" trigger, detection engine algorithm reference, and application metadata.

### Planned / Future Scope (Not Yet Implemented)
- **Path Explorer:** Multi-hop shortest path and arbitrary graph traversal explorer between any two arbitrary accounts *(Future Scope / Not Yet Implemented)*.
- **API Test Automation:** Dedicated automated Postman/Newman end-to-end regression collection.
- **Production Deployment:** Cloud deployment to Vercel (frontend), Render (backend), and CognoDB Cloud production clusters.

---

## Public Application

The public interface provides an entry point for investigators and stakeholders:

- **Landing Page (`/`):** Outlines graph-based fraud detection capabilities, the 5 core detection patterns, and architectural advantages over traditional tabular monitoring.
- **Sign In (`/login`):** Authenticates investigator credentials via `POST /api/auth/login` and initializes stateless JWT session storage.
- **Register (`/register`):** Creates an investigator account with secure password hashing and uniqueness enforcement.

---

## Authenticated Investigation Workspace

Once authenticated, investigators have access to six protected workspace views:

```
Protected Workspace
├── Dashboard (/dashboard)
├── Investigate Account (/investigate/:id)
├── Network Graph (/graph/:id)
├── Detection Patterns (/patterns)
├── Recent Investigations (/recent)
└── Settings (/settings)
```

### 1. Dashboard
- **Investigate an Account:** Account investigation search input accepting account IDs (e.g. `ACC-010`, `ACC-001`) and routing to in-depth analysis.
- **Detection Patterns:** Quick-access overview of the 5 Cypher detection algorithms.
- **Graph Intelligence Preview:** Conceptual topology preview with "Explore Network →" CTA.
- **Investigation Workflow:** 4-step guide detailing on-demand graph query execution.
- **Recent Investigations:** Session table displaying accounts analyzed during the current browser session.
- **Live System Status:** Health check card backed by `GET /api/health` indicating CognoDB Cloud and API operational status.

### 2. Investigate Account
- **Account Risk Summary:** Rule-based heuristic risk score (0–100), risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), top detected signal, and account metadata.
- **Risk Signals Detected:** Dynamic list of detected signals with severity tags (`HIGH`, `MEDIUM`, `LOW`) and descriptions.
- **Network Overview:** Interactive mini preview diagram linking to the full interactive graph canvas.
- **Transaction Evidence:** Inbound and outbound transfer tabs detailing transaction IDs, amounts, timestamps, and counterparties from actual API evidence.
- **Connected Entities:** Categorized tabs for Persons, Devices, Phones, and Addresses extracted from relationship traversals.
- **Investigation Details:** Evaluator email from JWT, evaluation timestamp from backend `evaluatedAt`, and completion status.

### 3. Network Graph
- **Cytoscape.js Canvas:** Interactive graph visualization constructed defensively from actual investigation evidence.
- **Visual Hierarchy & Primary Dominance:** The investigated primary account is rendered larger with an emerald border ring (`#10B981`) and explicit `Primary Account` labeling.
- **Entity Node Categories:** Color-coded node types (Primary Account: Deep Teal, Connected Accounts: Royal Blue, Devices: Amber, Phone Numbers: Seafoam Teal, Addresses: Emerald Green, Persons: Indigo).
- **Directional Transfer Edges:** Directional transfer relationships use distinct inbound/outbound styling, while detected circular-transfer relationships receive visual emphasis. Ownership and metadata relationships use separate distinct styling.
- **Canvas Controls:** Interactive Zoom In (`+`), Zoom Out (`-`), Fit View (`Fit`), Lock Node Positions (`Lock Nodes`), and Layout Switching (`CoSE`, `Concentric Rings`, `Flow Hierarchy`).
- **In-Graph Node Search:** Instantly highlights, centers, and selects matching nodes.
- **Selected Entity Inspector:** Displays entity ID, entity type, connection information, and risk information when available for the investigated account.

> [!NOTE]
> The Network Graph is generated strictly from relationships explicitly represented in backend API evidence. The frontend does not fabricate graph nodes or relationships.

### 4. Detection Patterns
- Detailed documentation of all 5 supported detection patterns:
  1. **Fan-in / Smurfing:** High inbound concentration in narrow windows followed by rapid outbound dispersal.
  2. **Circular Transfer:** Closed 2-to-5 hop circular fund routing loops.
  3. **Shared Device:** Hardware devices or digital fingerprints shared across disparate accounts.
  4. **Shared Phone:** Contact phone numbers shared across multiple customer identities.
  5. **Shared Address:** Physical residential addresses or mail drops shared across multiple customer identities.
- Conceptual architecture diagrams illustrating canonical graph traversals.

### 5. Recent Investigations
- **Session-Only History:** Tracks accounts investigated during the current browser session using `sessionStorage` (`fraudnet_recent_investigations`).
- **Investigation Metrics:** Displays Account ID, Risk Score, Risk Level, Top Signal, Summary, relative client timestamp (`Just now`, `2 mins ago`), and action links (`View Details`, `Open Graph`).
- **Session Reset:** "Clear Session History" action to purge local session state.

> [!IMPORTANT]
> Investigation results are generated on demand from CognoDB Cloud and are not permanently stored through a backend investigation history API.

### 6. Settings
- **Account Information:** Live profile details from `GET /api/auth/me` (Email, Role, User ID, JWT status).
- **Database Status:** Live status from `GET /api/health` with a "Test Connection" button.
- **Detection Engine Reference:** Informational table detailing the 5 Cypher detection algorithms, traversal bounds, and heuristic scoring model.
- **Application Information:** Platform version, stack details (Node.js, Express, CognoDB Cloud, Bolt, React, Vite, Tailwind CSS, Cytoscape.js).

---

## Architecture

```
Browser (React + Vite + Tailwind CSS + Cytoscape.js)
  │
  ├── Public Pages: Landing (/), Login (/login), Register (/register)
  └── Protected Workspace: Dashboard, Investigate, Graph, Patterns, Recent, Settings
  │
  ▼ [HTTPS / REST API + JWT Bearer Auth]
Node.js + Express API Server
  │
  ├── Security & Middleware: helmet, compression, cors, authMiddleware
  ├── Authentication: bcryptjs (factor 12), jsonwebtoken (HS256)
  └── Fraud Detection Engine: fraudDetectionService.js
  │
  ▼ [Parameterized Cypher Queries / neo4j-driver]
CognoDB Cloud (Bolt Protocol: bolt+s://)
```

---

## Graph Domain Model & Schema

The graph schema models money mule and fraud topologies with canonical node labels, relationship types, and identifier uniqueness constraints.

### Canonical Node Labels

- `(:Person)` — Individual entity or customer profile (`id` unique)
- `(:Account)` — Financial/bank account (`id` unique)
- `(:Device)` — Hardware device or digital fingerprint used for access (`id` unique)
- `(:PhoneNumber)` — Contact phone number associated with accounts/persons (`id` unique)
- `(:Address)` — Physical or residential address (`id` unique)
- `(:User)` — Application investigator account (`id` unique, `email` unique)

### Canonical Relationship Types

- `(:Person)-[:OWNS]->(:Account)`
- `(:Person)-[:REGISTERED_WITH]->(:PhoneNumber)`
- `(:Person)-[:LIVES_AT]->(:Address)`
- `(:Account)-[:USED_DEVICE]->(:Device)`
- `(:Account)-[:TRANSFERRED_TO]->(:Account)`

### Uniqueness Constraints

| Constraint Name | Target Node Label | Target Property | Constraint Type |
|---|---|---|---|
| `constraint_person_id` | `Person` | `id` | `UNIQUE` |
| `constraint_account_id` | `Account` | `id` | `UNIQUE` |
| `constraint_device_id` | `Device` | `id` | `UNIQUE` |
| `constraint_phonenumber_id` | `PhoneNumber` | `id` | `UNIQUE` |
| `constraint_address_id` | `Address` | `id` | `UNIQUE` |
| `constraint_user_id` | `User` | `id` | `UNIQUE` |
| `constraint_user_email` | `User` | `email` | `UNIQUE` |

### Initializing Graph Schema

To apply and verify the schema constraints against CognoDB Cloud idempotently:

```bash
cd backend
npm run db:schema
```

---

## Synthetic Dataset & Ground-Truth Scenarios

The project includes a realistic, deterministic synthetic dataset created with parameterized Cypher batches and MERGE idempotency.

### Dataset Volume
- **Persons:** 24 nodes (`P-001` to `P-024`)
- **Accounts:** 28 nodes (`ACC-001` to `ACC-028`)
- **Devices:** 10 nodes (`DEV-001` to `DEV-010`)
- **PhoneNumbers:** 10 nodes (`PH-001` to `PH-010`)
- **Addresses:** 10 nodes (`ADDR-001` to `ADDR-010`)
- **Transfers:** Exactly 140 `TRANSFERRED_TO` relationships (`TXN-0001` to `TXN-0140`)

### Embedded Ground-Truth Scenarios
1. **Circular Transfer Ring (`RING_01`):** A 4-hop circular fund routing cycle (`ACC-001 → ACC-002 → ACC-003 → ACC-004 → ACC-001`) with high-value transfers ($13.6k–$14.5k) within a tight time window.
2. **Shared Device Cluster (`SHARED_DEVICE_01`):** Device `DEV-001` shared across 4 distinct accounts (`ACC-005`, `ACC-006`, `ACC-007`, `ACC-008`).
3. **Shared Phone Cluster (`SHARED_PHONE_01`):** Phone `PH-001` shared across 3 individuals (`P-005`, `P-006`, `P-007`).
4. **Shared Address Cluster (`SHARED_ADDRESS_01`):** Address `ADDR-001` shared across 3 individuals (`P-008`, `P-009`, `P-010`).
5. **Fan-In / Smurfing & Outbound Dispersal (`SMURFING_01`):** Aggregator account `ACC-010` receiving 5 inbound synthetic deposits ($9,200–$9,800) from mule accounts (`ACC-011` to `ACC-015`) during morning hours, followed by rapid outbound dispersals to `ACC-016` and `ACC-017` in the afternoon. *(Note: Synthetic deposits are modeled for behavioral pattern demonstration, not regulatory compliance determinations.)*
6. **Normal Control Accounts (`NORMAL_01`):** Standard accounts (`ACC-020` to `ACC-023`) with isolated identifiers, low risk scores (< 20), and normal day-to-day transaction patterns.
7. **Low-Connectivity Account (`LOW_ACTIVITY_01`):** Account `ACC-028` with exactly 1 historical transfer.

### Seeding the Database

To seed and verify the synthetic dataset idempotently:

```bash
cd backend
npm run db:seed
```

---

## Fraud Detection Engine & Risk Scoring

### Parameterized Cypher Detectors

The backend evaluates accounts using five parameterized Cypher graph algorithms:

1. **Cycle Detector (`detectCycles`):** Traverses variable-length circular paths `(:Account)-[:TRANSFERRED_TO*2..5]->(:Account)` and verifies chronological timestamp sequence within a 24-hour detection window.
2. **Shared Device Detector (`detectSharedDevice`):** Traverses `(:Account)-[:USED_DEVICE]->(:Device)<-[:USED_DEVICE]-(:Account)` to identify hardware multi-accounting.
3. **Shared Phone Detector (`detectSharedPhone`):** Traverses `(:Account)<-[:OWNS]-(:Person)-[:REGISTERED_WITH]->(:PhoneNumber)<-[:REGISTERED_WITH]-(:Person)` to identify accounts/persons sharing the same registered phone number.
4. **Shared Address Detector (`detectSharedAddress`):** Traverses `(:Account)<-[:OWNS]-(:Person)-[:LIVES_AT]->(:Address)<-[:LIVES_AT]-(:Person)` to identify accounts/persons sharing the same registered physical address.
5. **Fan-In / Smurfing Detector (`detectSmurfing`):** Analyzes inbound deposit concentration within a 24-hour window combined with rapid outbound fund dispersal within 48 hours.

### Explainable Risk Scoring Model

> [!NOTE]
> The risk score is a transparent rule-based demonstration heuristic designed for investigative triage and visualization, not a statistical probability of fraud or a regulatory compliance determination.

| Signal | Heuristic Weight | Severity Band | Description |
|---|---|---|---|
| `CIRCULAR_TRANSFER` | `40` | `HIGH` | Bounded circular transfer ring completed within a concentrated time window |
| `FAN_IN_DISPERSAL` | `30` | `HIGH` | Rapid fan-in deposits followed by rapid outbound fund dispersals |
| `SHARED_DEVICE` | `15` | `MEDIUM` | Multiple independent accounts accessing from the same device/fingerprint |
| `SHARED_PHONE` | `10` | `MEDIUM` | Multiple registered customer identities sharing the same phone number |
| `SHARED_ADDRESS` | `5` | `LOW` | Multiple registered customer identities sharing the same physical address |

#### Aggregate Risk Level Bands
- **`0 – 19`:** `LOW` (Control accounts, typical commercial activity, baseline overlaps)
- **`20 – 49`:** `MEDIUM` (Multiple shared identity attributes or single elevated patterns)
- **`50 – 74`:** `HIGH` (Multiple or high-weight fraud signals producing an aggregate score of 50–74)
- **`75 – 100`:** `CRITICAL` (Multiple high-severity fraud signals producing an aggregate score of 75–100)

---

## API Documentation

### Public Health Endpoint

- **Endpoint:** `GET /api/health`
- **Access:** Public
- **Description:** Verifies Express API server liveness and active CognoDB Cloud connectivity over Bolt.

```json
{
  "status": "healthy",
  "service": "fraud-network-tracker-api",
  "database": "connected"
}
```

---

### Authentication Endpoints

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Registers a new application investigator user (normalized email, bcrypt hash work factor 12) |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns stateless JWT token (`HS256`, 1h expiration) |
| `/api/auth/me` | `GET` | Protected (`Bearer <JWT>`) | Returns authenticated investigator profile (`id`, `email`, `role`, `createdAt`) |

---

### Fraud Detection & Analytical Endpoints

*All fraud analytical endpoints require authentication: `Authorization: Bearer <JWT>`.*

| Endpoint | Method | Access | Description | Primary Query Traversal |
|---|---|---|---|---|
| `/api/fraud/detect-cycles/:id` | `GET` | Protected | Bounded circular transfer cycle detection | `(:Account)-[:TRANSFERRED_TO]->()-[:TRANSFERRED_TO*2..5]->(:Account)` |
| `/api/fraud/shared-device/:id` | `GET` | Protected | Shared hardware device clusters | `(:Account)-[:USED_DEVICE]->(:Device)<-[:USED_DEVICE]-(:Account)` |
| `/api/fraud/shared-phone/:id` | `GET` | Protected | Shared phone number registrations | `(:Account)<-[:OWNS]-(:Person)-[:REGISTERED_WITH]->(:PhoneNumber)<-[:REGISTERED_WITH]-(:Person)` |
| `/api/fraud/shared-address/:id` | `GET` | Protected | Shared physical address residency | `(:Account)<-[:OWNS]-(:Person)-[:LIVES_AT]->(:Address)<-[:LIVES_AT]-(:Person)` |
| `/api/fraud/smurfing/:id` | `GET` | Protected | Inbound fan-in deposits & rapid dispersal | Multi-source inbound concentration + outbound fund flow analysis |
| `/api/fraud/investigate/:id` | `GET` | Protected | Multi-signal investigative risk evaluation | Aggregation of all 5 detectors with explainable risk score & level |

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- CognoDB Cloud instance (or Neo4j-compatible instance)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your CognoDB connection credentials (`COGNODB_URI`, `COGNODB_USER`, `COGNODB_PASSWORD`, `JWT_SECRET`).

3. Install dependencies:
   ```bash
   npm install
   ```

4. Initialize graph schema and seed synthetic data:
   ```bash
   npm run db:schema
   npm run db:seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```

The backend server runs on `http://localhost:5000` by default.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

The frontend application runs on `http://localhost:5173` by default.

---

### Root Convenience Scripts

From the repository root, you can run:
```bash
npm run dev:backend    # Starts backend development server (Port 5000)
npm run dev:frontend   # Starts frontend development server (Port 5173)
npm run start:backend  # Starts backend production server
npm run db:schema      # Initializes & verifies CognoDB graph schema constraints
npm run db:seed        # Seeds & verifies the deterministic synthetic fraud dataset
```

---

## Environment Variables Reference

Defined in `backend/.env.example` and `.env.example`:

| Variable | Description | Default / Required |
|---|---|---|
| `PORT` | HTTP port for the Express backend server | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin for frontend client requests | `http://localhost:5173` |
| `COGNODB_URI` | Bolt connection URI for CognoDB Cloud (`bolt+s://...`) | *Required in `.env`* |
| `COGNODB_USER` | Database username | `cognodb` |
| `COGNODB_PASSWORD` | Database password | *Required in `.env`* |
| `JWT_SECRET` | Secret key for JWT signing & verification | *Required in `.env`* |
| `JWT_EXPIRES_IN` | JWT token expiration duration string | `1h` |

---

## Project Structure

```
fraud-network-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # CognoDB Bolt driver singleton & lifecycle
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, and profile controllers
│   │   │   └── fraudController.js   # Fraud analytical endpoint controllers
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT Bearer authentication verification
│   │   │   ├── errorHandler.js      # Global sanitized error handler
│   │   │   └── notFoundHandler.js   # 404 route handler
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes
│   │   │   ├── fraudRoutes.js       # /api/fraud routes
│   │   │   └── healthRoutes.js      # /api/health route
│   │   ├── services/
│   │   │   ├── authService.js       # User creation, bcrypt validation, JWT generation
│   │   │   └── fraudDetectionService.js # Cypher fraud detection algorithms & scoring
│   │   └── server.js                # Express app initialization & shutdown hooks
│   ├── scripts/
│   │   ├── initSchema.js            # CognoDB schema constraint initialization
│   │   └── seedData.js              # Deterministic synthetic dataset seed engine
│   ├── tests/                       # Automated backend test suites (51 passing tests)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            # Centralized API client with JWT header injection
│   │   ├── components/
│   │   │   ├── FeedbackStates.jsx   # LoadingState, ErrorState, EmptyState
│   │   │   ├── HeroDiagram.jsx      # Animated landing hero relationship diagram
│   │   │   ├── Icons.jsx            # Precision SVG icons
│   │   │   ├── ProtectedRoute.jsx   # Client-side route guard
│   │   │   ├── RiskBadge.jsx        # Standardized color-coded risk badge
│   │   │   └── StatusBadge.jsx      # Connection and operational status badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth provider with token persistence & bootstrapping
│   │   ├── layout/
│   │   │   ├── AppShell.jsx         # Authenticated application layout shell
│   │   │   ├── Header.jsx           # Breadcrumb navigation & investigator user pill
│   │   │   └── Sidebar.jsx          # Nav sidebar with active teal indicator pills
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Authenticated dashboard with search & live health
│   │   │   ├── DetectionPatterns.jsx # 5 fraud detection pattern explainer cards
│   │   │   ├── InvestigateAccount.jsx # Multi-signal investigation workspace
│   │   │   ├── Landing.jsx          # Public product landing page
│   │   │   ├── Login.jsx            # Public login page
│   │   │   ├── NetworkGraph.jsx     # Interactive Cytoscape.js graph canvas
│   │   │   ├── RecentInvestigations.jsx # Session investigation history
│   │   │   ├── Register.jsx         # Public registration page
│   │   │   └── Settings.jsx         # Account details, DB test & engine documentation
│   │   ├── utils/
│   │   │   ├── graphTransform.js    # Defensive Cytoscape element transformer
│   │   │   └── sessionHistory.js    # Client sessionStorage investigation manager
│   │   ├── App.jsx                  # Main router configuration
│   │   ├── index.css                # Typography & Tailwind styling
│   │   └── main.jsx                 # React root entry point
│   ├── vite.config.js               # Vite config with /api proxy to localhost:5000
│   └── package.json
│
├── README.md                        # Master project documentation
└── package.json                     # Root convenience script runner
```

---

## Testing & Verification

The platform has been verified across all layers:

- **Backend Test Suites:** Automated backend test suites covering connectivity, schema constraints, deterministic dataset counts, Cypher detectors, heuristic scoring, and JWT authentication.
- **Frontend Production Build:** Built with Vite in < 500ms with zero errors.
- **Investigation Verification:** Verified on ground-truth accounts:
  - `ACC-010`: Fan-in / Smurfing detected with 5 inbound and 2 outbound transfers.
  - `ACC-001`: Circular Transfer 4-hop ring detected with chronological timestamp verification.
  - `ACC-005`: Shared Device and Shared Phone clusters identified.
  - `ACC-008`: Shared Address cluster identified.
  - `ACC-020`: Control account verified with low risk score.
  - `ACC-028`: Low-activity account verified.
  - `ACC-999`: 404 Account Not Found handled with clean error state.
- **Interactive Graph Canvas:** Verified Cytoscape rendering, node selection, in-graph search, zoom/pan/fit controls, lock node positions, and layout switching.
- **Responsive Viewport Testing:** Verified desktop and 375px mobile viewport layouts, collapsible drawer navigation, and zero horizontal overflow.

---

## Security & Prototype Boundaries

- **Security Headers:** Enforced via `helmet`.
- **Compression:** Active gzip/deflate via `compression`.
- **CORS Protection:** Enforces configured `CLIENT_ORIGIN`.
- **Injection Safety:** All Cypher queries use parameterized inputs (`$accountId`, `$windowHours`, etc.).
- **Credential Protection:** Database connection strings, passwords, and JWT secrets are never exposed in API responses or health checks.
- **Prototype Boundaries:** OAuth, Google social login, refresh-token rotation, server-side session stores, MFA, and automated password reset are intentionally out of prototype scope.

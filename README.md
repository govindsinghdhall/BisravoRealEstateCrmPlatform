# RealEstate CRM

Production-grade Real Estate CRM — React frontend + Node.js/MongoDB backend in one monorepo.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Material UI, React Query, Zustand, React Router  
**Backend:** Express, TypeScript, Mongoose, MongoDB, JWT (multi-tenant SaaS)

## Quick Start

```bash
npm run setup      # install deps, env files, MongoDB, demo seed
npm run dev:all    # API (:3000) + CRM (:5173)
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Login

- **Email:** `admin@realestatecrm.com`
- **Password:** `Admin@123`

## Monorepo Layout

```
RealEstateCRM/
├── src/                    # CRM admin frontend (React)
├── RealEstateBackend/      # API server (Express + MongoDB)
├── RealEstateWebsite/      # Public website (optional)
├── docker-compose.yml      # MongoDB + Mongo Express
└── ARCHITECTURE.md         # System design
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | CRM frontend only (:5173) |
| `npm run dev:api` | Backend API only (:3000) |
| `npm run dev:all` | Frontend + backend together |
| `npm run setup` | Full first-time setup |
| `npm run db:up` | Start MongoDB containers |
| `npm run db:down` | Stop MongoDB containers |
| `npm run db:reset` | Wipe DB and restart |
| `npm run seed` | Seed demo organization |
| `npm run build` | Production frontend build |
| `npm run build:api` | Compile backend to `dist/` |

## Database

MongoDB runs via Docker:

```bash
npm run db:up
```

Browse data at [http://localhost:8081](http://localhost:8081) (Mongo Express).

Connection string (backend `.env`):

```
MONGODB_URI=mongodb://127.0.0.1:27017/realestate_crm
```

## API Integration

In dev, the frontend uses a relative API URL and Vite proxies requests:

```
VITE_API_BASE_URL=/api/v1
```

Signup creates a **new organization** per tenant (SaaS). See `ARCHITECTURE.md` for the full data flow.

## Modules

| Module | Route | Status |
|--------|-------|--------|
| Login / Signup | `/login`, `/signup` | Connected to API |
| Dashboard | `/dashboard` | Frontend ready |
| Leads | `/leads` | Frontend ready |
| Contacts | `/contacts` | Frontend ready |
| Properties | `/properties` | Frontend ready |
| Users | `/users` | Connected to API |
| Settings | `/settings` | Org profile connected |

Backend modules (leads, properties, etc.) are added incrementally on top of the auth/org foundation in `RealEstateBackend/`.

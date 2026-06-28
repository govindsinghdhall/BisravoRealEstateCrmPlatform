# Multi-Project Architecture

This monorepo contains the CRM admin UI, backend API, and (optionally) a public website — all manageable from one workspace.

## Projects

| Project | Folder | Purpose | Port |
|---------|--------|---------|------|
| **Backend API** | `RealEstateBackend/` | Multi-tenant SaaS API (MongoDB) | 3000 |
| **CRM Admin UI** | `./` (root) | Internal sales & management dashboard | 5173 |
| **Public Website** | `RealEstateWebsite/` | Consumer-facing listings & lead capture | 5175 |
| **MongoDB** | `docker-compose.yml` | Database | 27017 |
| **Mongo Express** | `docker-compose.yml` | DB admin UI | 8081 |

## Data Flow

### Website → CRM (Feeder)
1. Visitor submits inquiry on `RealEstateWebsite`
2. `POST /api/v1/public/inquiries` creates a lead
3. Lead appears in CRM with source **Website**
4. Sales team manages lead in CRM admin UI

### CRM → Website (Receiver)
1. Agent adds property in CRM (status: AVAILABLE)
2. Website fetches `GET /api/v1/public/properties`
3. Property appears on public website automatically

### Signup → New Organization (SaaS)
1. User signs up on CRM (`POST /api/v1/auth/register`)
2. Backend creates a new **Organization** tenant
3. Default roles & lead sources are seeded
4. User becomes org **admin**; JWT scopes all data to that org

## API Surfaces

| Consumer | Auth | Endpoints |
|----------|------|-----------|
| CRM Admin | JWT (`/auth/login`) | `/leads`, `/properties`, `/users`, etc. |
| Public Website | None (optional API key for POST) | `/public/properties`, `/public/inquiries` |

## Running Everything

```bash
# One-time setup (install deps, env files, MongoDB, demo seed)
npm run setup

# Dev — frontend + API together
npm run dev:all

# Or separately:
npm run dev:api    # Backend on :3000
npm run dev        # CRM on :5173 (proxies /api → backend)
```

### Database management

```bash
npm run db:up      # Start MongoDB (+ Mongo Express UI)
npm run db:down    # Stop containers
npm run db:reset   # Wipe data and restart MongoDB
npm run seed       # Re-seed demo org (admin@realestatecrm.com)
```

Mongo Express: [http://localhost:8081](http://localhost:8081)

## Environment

| File | Purpose |
|------|---------|
| `.env` | Frontend — `VITE_API_BASE_URL=/api/v1` (Vite proxy in dev) |
| `RealEstateBackend/.env` | Backend — Mongo URI, JWT secret, CORS |

## Future: Separate Git Repos

Each folder can become its own repository:

```
github.com/yourorg/realestate-crm-backend    → RealEstateBackend/
github.com/yourorg/realestate-crm-admin      → root CRM frontend
github.com/yourorg/realestate-website        → RealEstateWebsite/
```

All repos point to the same deployed backend via environment variables.

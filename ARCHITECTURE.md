# Multi-Project Architecture

This monorepo contains three independently deployable projects sharing one backend.

## Projects

| Project | Folder | Purpose | Port |
|---------|--------|---------|------|
| **Backend API** | `RealEstateCRMBackend/` | Shared API for all frontends | 3000 |
| **CRM Admin UI** | `./` (root) | Internal sales & management dashboard | 5173 |
| **Public Website** | `RealEstateWebsite/` | Consumer-facing listings & lead capture | 5175 |

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

## API Surfaces

| Consumer | Auth | Endpoints |
|----------|------|-----------|
| CRM Admin | JWT (`/auth/login`) | `/leads`, `/properties`, `/users`, etc. |
| Public Website | None (optional API key for POST) | `/public/properties`, `/public/inquiries` |

## Future: Separate Git Repos

Each folder can become its own repository:

```
github.com/yourorg/realestate-crm-backend    → RealEstateCRMBackend/
github.com/yourorg/realestate-crm-admin      → root CRM frontend
github.com/yourorg/realestate-website        → RealEstateWebsite/
```

All repos point to the same deployed backend via environment variables.

## Running Everything

```bash
# Terminal 1 — Backend
cd RealEstateCRMBackend && npm run dev

# Terminal 2 — CRM Admin
npm run dev

# Terminal 3 — Public Website
cd RealEstateWebsite && npm run dev
```

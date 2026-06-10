# RealEstate CRM

Production-grade Real Estate CRM frontend built with React 19, TypeScript, Material UI, React Query, Zustand, and React Router.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Material UI v6** — enterprise UI components
- **TanStack React Query** — server state & caching
- **Zustand** — client state (auth, theme, sidebar)
- **React Router v7** — routing with lazy-loaded pages
- **AG Grid** — data tables
- **React Hook Form** + **Zod** — forms & validation
- **Recharts** — dashboard & report charts
- **Axios** — HTTP client

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Login (after backend seed)

- **Email:** `admin@realestatecrm.com`
- **Password:** `Admin@123`

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with auth interceptors
│   ├── endpoints.ts       # API route constants
│   ├── mockData.ts        # Mock data (fallback when API unavailable)
│   └── services/          # Domain service layer
├── components/
│   ├── common/            # Reusable UI (DataTable, StatCard, etc.)
│   ├── forms/             # Form field wrappers (RHF + MUI)
│   └── layout/            # AppLayout, Sidebar, TopNavbar
├── pages/
│   ├── auth/              # Login
│   ├── dashboard/         # Dashboard
│   ├── leads/             # Leads CRUD
│   ├── properties/        # Properties CRUD
│   ├── siteVisits/        # Site Visits CRUD
│   ├── bookings/          # Bookings CRUD
│   ├── users/             # Users CRUD
│   └── reports/           # Analytics & reports
├── routes/                # Router config & protected routes
├── schemas/               # Zod validation schemas
├── store/                 # Zustand stores
├── theme/                 # MUI theme (light/dark)
├── types/                 # TypeScript type definitions
└── utils/                 # Constants & formatters
```

## Modules

| Module       | Route           | Features                              |
|-------------|-----------------|---------------------------------------|
| Login       | `/login`        | Sign in with email & password         |
| Signup      | `/signup`       | Self-registration with validation     |
| Dashboard   | `/dashboard`    | KPIs, charts, recent activity         |
| Leads       | `/leads`        | AG Grid table, CRUD dialogs           |
| Properties  | `/properties`   | Listings management                   |
| Site Visits | `/site-visits`  | Visit scheduling                      |
| Bookings    | `/bookings`     | Booking management                    |
| Users       | `/users`        | Team & role management                |
| Reports     | `/reports`      | Sales charts, agent performance       |

## Backend Integration

The frontend is wired to `RealEstateCRMBackend`. Set your API URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Start the full stack

```bash
# Terminal 1 — Backend (from RealEstateCRMBackend/)
npm run dev

# Terminal 2 — Frontend
npm run dev
```

### What's connected

- Auth (login, signup/register, logout, token refresh)
- Leads, Properties, Site Visits, Bookings, Users (CRUD)
- Dashboard (aggregated from leads, properties, reports APIs)
- Reports (lead-conversion, sales, agent-performance)
- Lead Sources & Roles dropdowns in forms

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Features

- Responsive sidebar navigation (collapsible on desktop, drawer on mobile)
- Top navbar with search, notifications, dark mode toggle
- Dark/light theme with persistence
- Protected routes with auth guard
- Lazy-loaded pages for code splitting
- Reusable AG Grid DataTable component
- Form validation with Zod schemas
- Enterprise-grade UI design
# BisravoRealEstateCrmPlatform

# Subler Reverse Marketplace — PRD v2

## What Is This App

Reverse Marketplace is a demand-side matching layer built for **Subler**, a facility rental platform. Renters post space requirements and verified hosts browse and send proposals. Once a host sends a proposal, the renter clicks through to the host's Subler listing to complete tours, agreements, and payments. All transactions happen on Subler — this app only handles discovery and matching.

---

## The Problem This Solves

Subler's team is overwhelmed with an influx of renters reaching out manually to find spaces. Matching renters to hosts one by one is not scalable. This app gives renters a structured place to post requirements and gives hosts a live feed of high-intent renters to pitch directly.

---

## Goal

Build a fast, minimal, and seamless matching layer between renters and hosts. Every interaction should feel instant. The app funnels users toward Subler — it is an on-ramp, not a destination.

**Success looks like:**

- A renter posts a request in under 2 minutes
- A host browses requests and sends a proposal in under 1 minute
- The renter receives the proposal, clicks the Subler link, and continues on the main platform
- Zero unnecessary page loads, zero janky transitions, zero delays

---

## User Roles

### Renter (default)

- Every new user starts as a renter
- Can post space requests with structured requirements
- Can view proposals received on their requests
- Clicks through to Subler to complete the booking

### Host

- Must request a role upgrade from renter → host
- Upgrade requires admin approval
- Can browse all open renter requests
- Can send proposals containing a Subler listing link and a short pitch
- Cannot send proposals on requests they created themselves

### Admin

- Full visibility into all requests and proposals
- Approves or rejects host upgrade requests
- Can update request statuses
- Accessed via `/admin`

> One email can hold both a renter and host account simultaneously. Role is stored as a string field on the User model.

---

## Identity & Privacy Model

User IDs are the backbone of all ownership and permission logic — but they are **never surfaced in the UI**.

- Every request and proposal has a `userId` attached in the database
- This is used for: ownership checks, self-proposal blocking, "my requests" / "my proposals" filtering
- **No names, no emails, no avatars appear on any request or proposal card**
- The only place a user's identity appears in the UI is their own settings page

### Settings Page

The settings page contains exactly:

- Their email address (read-only)
- Sign out button
- Delete account button

Nothing else. No profile editing, no name fields.

---

## Core User Flows

### Renter Flow

1. Lands on `/` — sees value prop, clicks "Post a Request"
2. Redirected to `/login` if not authenticated
3. Enters email → magic link sent via Resend → clicks link → lands on `/dashboard`
4. Clicks "Post a Request" → `/requests/new` (4-step wizard)
5. Request goes live, visible to all approved hosts
6. Renter visits `/requests/my` to see their requests and incoming proposals
7. Clicks "View on Subler" on a proposal → navigates to Subler to complete booking

### Host Flow

1. Logs in as renter, requests host access from dashboard
2. Admin approves → host sees "Host Dashboard" in sidebar
3. Browses `/host/dashboard` — live feed of open renter requests (no renter identity shown)
4. Clicks "Send Proposal" → modal opens → enters Subler listing URL + pitch
5. Proposal delivered to renter
6. Views sent proposals at `/host/proposals`

### Admin Flow

1. Logs in, navigates to `/admin`
2. Reviews pending host upgrade requests → approves or rejects
3. Views all platform requests and their statuses

---

## Proposal Rules

- Every proposal **must** include a valid Subler listing URL
- The URL is validated server-side: hostname must be `app.getsubler.com` or end with `.subler.com`
- Non-Subler links are **blocked at the route handler level** — not just frontend validation
- Hosts cannot send proposals on requests they created themselves (enforced via `userId` comparison server-side)
- Pitch text: minimum 10 characters, maximum 500 characters

---

## Tech Stack

### Framework

- **Next.js** (App Router, TypeScript)
- Client components where interactivity is required
- Server components for page shells and layouts

### API Layer

- **Next.js Route Handlers** for all data fetching and mutations (`/api/...`)
- **Drizzle ORM** inside route handlers for all database access
- **Zod** for all input validation — both client-side (forms) and server-side (route handlers)
- Every route handler that mutates data validates its input with a Zod schema before touching the database
- No server actions — all mutations go through REST endpoints

### Data Fetching

- **TanStack Query** (`@tanstack/react-query`) for all client-side data fetching and caching
- All queries and mutations defined in `hooks/` — one file per resource
- `useQuery` for reads, `useMutation` + `queryClient.invalidateQueries` for writes
- No `useEffect` for data fetching

### Auth

- **Auth.js v5** (NextAuth) with the **Resend email provider** (magic link)
- No passwords, no OAuth, no name collection
- Email is the only user identifier
- Magic links sent via Resend's first-party Auth.js provider — no SMTP config required
- Auth.js middleware protects all `/dashboard`, `/requests`, `/host`, and `/admin` routes
- Session available via `auth()` in route handlers and server components
- No onboarding page — magic link lands directly on `/dashboard`

### Email

- **Resend** via the Auth.js Resend provider
- Magic link is the only email sent by the app
- In development: magic link logged to the console
- In production: sent to the actual user address

### Database

- **Drizzle ORM** with **PostgreSQL** (both development and production)
- **Docker** for local Postgres (`postgres:16` image)
- **Neon** for production Postgres (serverless, connection pooling via Neon's pooler URL)
- Never use raw SQL with user input — always use the Drizzle query builder
- Migrations managed via `drizzle-kit`

### Rate Limiting

- **Arcjet** for rate limiting and bot protection
- Applied on the magic link send endpoint and all mutation route handlers
- Keeps database load and Resend usage cheap under abuse

### URL / Filter State

- **nuqs** for all filter and tab state (status filters, role tabs, etc.)
- Filter state lives in the URL as search params — shareable and back-button-aware
- No `useState` for filter or tab switching

### UI

- **shadcn/ui** for all components
- **Tailwind CSS** for styling
- **CSS design tokens only** — no hardcoded hex values anywhere in the codebase
- **Lucide React** for icons
- **Sonner** for toast notifications

---

## Design System

### Fonts

- **General Sans** (local woff2) — display font, `--font-display`, used for all headings
- **Inter** (Google) — body/UI font, `--font-sans`
- **JetBrains Mono** (Google) — monospace, `--font-mono`

### Color Tokens

- `--color-primary` / `bg-primary` — Deep Navy (`#1e2d8c`)
- `--color-primary-foreground` — white text on primary backgrounds
- `--color-background` — page background (`#fafafc`)
- `--color-foreground` — primary text (`#0e1442`)
- `--color-muted-foreground` — secondary text
- `--color-border` — borders and dividers
- `--color-card` — card backgrounds
- `--color-accent-peach-500` — CTA accent (`#ffb13d`)

### Type Scale Utilities

- `text-display` — 56px, General Sans, weight 700
- `text-h1` — 40px
- `text-h2` — 30px
- `text-h3` — 22px
- `text-body-lg` — 18px, Inter
- `text-body` — 16px
- `text-body-sm` — 14px
- `text-caption` — 12px, weight 500

### Component Conventions

- Buttons: `rounded-full` style
- Cards: `bg-card border border-border rounded-2xl shadow-sm`
- Active nav: `bg-primary/10 text-primary font-medium`
- Inactive nav: `text-muted-foreground hover:bg-neutral-100`

---

## Project Structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # Landing page
│   │   └── login/page.tsx                # Magic link login (email input)
│   ├── (auth)/
│   │   ├── layout.tsx                    # Sidebar layout shell
│   │   ├── dashboard/page.tsx            # Renter home
│   │   ├── settings/page.tsx             # Email, sign out, delete account
│   │   ├── requests/
│   │   │   ├── new/page.tsx              # 4-step request wizard
│   │   │   └── my/page.tsx              # Renter's posted requests
│   │   └── proposals/
│   │       └── [requestId]/page.tsx      # Proposals on a request
│   ├── (host)/
│   │   └── host/
│   │       ├── dashboard/page.tsx        # Host request browser
│   │       └── proposals/page.tsx        # Proposals host has sent
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx                  # Admin overview
│   │       ├── requests/page.tsx         # All requests table
│   │       └── host-approvals/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # Auth.js handler
│   │   ├── requests/
│   │   │   ├── route.ts                  # GET (open), POST (create)
│   │   │   └── [id]/route.ts             # GET, PATCH, DELETE
│   │   ├── requests/my/
│   │   │   └── route.ts                  # GET current user's requests
│   │   ├── proposals/
│   │   │   ├── route.ts                  # POST (create)
│   │   │   └── [id]/route.ts             # PATCH
│   │   ├── proposals/request/
│   │   │   └── [requestId]/route.ts      # GET proposals for a request
│   │   ├── host/
│   │   │   ├── proposals/route.ts        # GET proposals sent by host
│   │   │   └── upgrade/route.ts          # POST request host upgrade
│   │   └── admin/
│   │       ├── requests/route.ts         # GET all, PATCH status
│   │       └── upgrades/route.ts         # GET pending, POST approve/reject
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx                     # TanStack Query provider + ThemeProvider
├── components/
│   ├── ui/                               # shadcn components
│   └── shared/                           # RequestCard, ProposalCard, Sidebar, etc.
├── hooks/
│   ├── use-requests.ts
│   ├── use-proposals.ts
│   └── use-host.ts
├── lib/
│   ├── db.ts                             # Drizzle client singleton
│   └── auth.ts                           # Auth.js config
├── db/
│   ├── schema.ts                         # Drizzle schema
│   └── migrations/                       # drizzle-kit generated migrations
├── types/
│   └── index.ts                          # Zod schemas and inferred types
├── middleware.ts                          # Auth.js middleware (route protection)
├── drizzle.config.ts
├── public/fonts/GeneralSans-Variable.woff2
└── .env.example
```

---

## Data Models

### User

- `id` — uuid (generated, used as session user ID)
- `email` — unique text
- `emailVerified` — timestamp (set by Auth.js on first magic link verification)
- `role` — text, default `"renter"` (`"renter"` | `"admin"`)
- `hostStatus` — nullable text (`null` | `"pending"` | `"approved"` | `"rejected"`)
- `createdAt` — timestamp

### Auth.js Required Tables

Auth.js adapter requires these alongside User:

- `accounts` — OAuth accounts (unused but required by adapter)
- `sessions` — active sessions
- `verificationTokens` — magic link tokens

### RentalRequest

- `id` — uuid
- `eventType` — text (`athletic`, `conference`, `film_production`, `event`, `rehearsal`, `meeting`, `other`)
- `spaceType` — text (`studio`, `warehouse`, `event_hall`, `outdoor`, `gym`, `classroom`, `office`, `other`)
- `startDate` / `endDate` — timestamp
- `budget` — numeric
- `headcount` — integer
- `amenities` — text (comma-separated)
- `locationPreference` — text
- `notes` — nullable text
- `status` — text, default `"open"` (`open`, `closed`, `fulfilled`)
- `userId` — foreign key → User.id
- `createdAt` — timestamp

### Proposal

- `id` — uuid
- `requestId` — foreign key → RentalRequest.id
- `userId` — foreign key → User.id (the host who sent it)
- `sublerLink` — text (validated: hostname must be `app.getsubler.com` or end with `.subler.com`)
- `pitch` — text (10–500 chars)
- `status` — text, default `"pending"`
- `createdAt` — timestamp

---

## API Routes

### Requests

| Method | Route                | Auth   | Description                                  |
| ------ | -------------------- | ------ | -------------------------------------------- |
| GET    | `/api/requests`      | Public | All open requests — no user identity exposed |
| POST   | `/api/requests`      | Renter | Create a new rental request                  |
| GET    | `/api/requests/my`   | Renter | Current user's requests                      |
| GET    | `/api/requests/[id]` | Public | Single request by ID                         |
| PATCH  | `/api/requests/[id]` | Owner  | Close or update a request                    |
| DELETE | `/api/requests/[id]` | Owner  | Delete a request                             |

### Proposals

| Method | Route                                | Auth          | Description                                                      |
| ------ | ------------------------------------ | ------------- | ---------------------------------------------------------------- |
| POST   | `/api/proposals`                     | Approved host | Create a proposal — validates Subler URL + blocks self-proposals |
| GET    | `/api/proposals/request/[requestId]` | Request owner | All proposals on a request                                       |
| GET    | `/api/host/proposals`                | Approved host | All proposals sent by current host                               |
| PATCH  | `/api/proposals/[id]`                | Admin         | Update proposal status                                           |

### Host

| Method | Route               | Auth   | Description               |
| ------ | ------------------- | ------ | ------------------------- |
| POST   | `/api/host/upgrade` | Renter | Request host role upgrade |

### Admin

| Method | Route                 | Auth  | Description                   |
| ------ | --------------------- | ----- | ----------------------------- |
| GET    | `/api/admin/requests` | Admin | All requests                  |
| PATCH  | `/api/admin/requests` | Admin | Update request status         |
| GET    | `/api/admin/upgrades` | Admin | Pending host upgrade requests |
| POST   | `/api/admin/upgrades` | Admin | Approve or reject upgrade     |

---

## Route Handler Pattern

```ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // ownership or role check before any mutation
  // drizzle query
  // return NextResponse.json(result)
}
```

---

## TanStack Query Pattern

```ts
// hooks/use-requests.ts
export function useRequests(status?: string) {
  return useQuery({
    queryKey: ["requests", status],
    queryFn: () =>
      fetch(`/api/requests?status=${status ?? "all"}`).then((r) => r.json()),
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequestInput) =>
      fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
```

Filter tabs use `nuqs` — never `useState`:

```ts
const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
const { data } = useRequests(status);
```

---

## Security Requirements

- **Auth.js middleware** protects all authenticated routes
- **Arcjet** rate limiting on the magic link send endpoint and all mutation route handlers — keeps Resend usage and DB load cheap under abuse
- **Subler URL validation** server-side: parse URL, check `hostname === 'app.getsubler.com' || hostname.endsWith('.subler.com')` — not a string match
- **Self-proposal block** server-side: compare `request.userId === session.user.id` before allowing proposal creation
- **Ownership checks** on every mutation: fetch the record, verify ownership, then mutate
- **Role checks** in route handlers: admin routes verify `user.role === 'admin'`, host routes verify `user.hostStatus === 'approved'`
- **Security headers** in `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`
- Never trust client-provided user IDs — always derive identity from `auth()` in the route handler
- Email is the only PII stored — no names, no phone numbers, no profile data

---

## Environment Variables

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/subler_reverse

# Auth.js
AUTH_SECRET=
AUTH_RESEND_KEY=

# Resend
RESEND_FROM=onboarding@resend.dev

# Arcjet
ARCJET_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
```

---

## What This App Is NOT

- Not a messaging platform — there is no in-app chat
- Not a payment platform — all payments happen on Subler
- Not a contract platform — agreements happen on Subler
- Not a calendar or scheduling tool
- Not a profile platform — no user profiles, no names, no public identity
- Not a standalone product — it is an on-ramp to Subler

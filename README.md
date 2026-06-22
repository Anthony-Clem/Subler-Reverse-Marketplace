# Subler Reverse Marketplace

Welcome to the **Subler Reverse Marketplace**, a high-performance demand-side space matching layer operated by **Subler, Inc.** 

This application functions as an on-ramp subdivision web app built on top of Subler's main platform. Renters post their space rental requirements, and approved hosts pitch matching listings by providing valid Subler listing URLs. 

All actual transactions, final bookings, tours, security deposits, and contracts occur exclusively on [Subler's main platform](https://getsubler.com) and are governed by Subler's main Terms of Service.

---

## ⚡️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/) with passwordless Magic Links via [Resend](https://resend.com/)
*   **Database**: Serverless PostgreSQL via [Neon](https://neon.tech/)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Security & Protection**: [Arcjet](https://arcjet.com/) (Intrusion prevention, rate limiting, and bot protection)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔑 Key Features

### 1. Demand-Side Space Requests
Renters can specify and publish event hosting requirements, detailing:
*   Event Type & Space Type
*   Specific Date and Time selections (via customized Calendars block scheduling)
*   Hourly budget limit, headcount capacity, location, custom amenities, and notes.

### 2. Verified Host Proposals
Hosts can apply for verified Host status. Once approved by platform administrators, hosts can submit proposals that match open renter requests, linking back to their listings on the main Subler domain.

### 3. User Data Export (GDPR / Privacy Control)
Aligned with minimal data practices, users can download/export their data as a clean JSON file directly in their Settings page. This exports:
*   User Profile metadata
*   Submitted Space Requests
*   Submitted Proposals

### 4. Direct Privacy & Terms Policy Pages
Contains responsive static legal pages addressing Delaware-governed policies and precise disclosures regarding our minimal collection scope (email, requests, and proposals only).

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   PostgreSQL database or [Neon Database Account](https://neon.tech/)
*   [Resend Account](https://resend.com/) for mail API keys

### 2. Environment Setup
Clone the `.env.example` file and configure your credentials:

```bash
cp .env.example .env
```

Make sure to specify:
*   `DATABASE_URL` (Neon Postgres Connection string)
*   `AUTH_SECRET` (Secret generated for NextAuth, e.g. via `npx auth secret`)
*   `RESEND_API_KEY` (Your Resend API Key)
*   `NEXT_PUBLIC_APP_URL` (Local development URL, e.g., `http://localhost:3000`)
*   `ARCJET_KEY` (Arcjet license key for protection)

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Schema Setup

Compile Drizzle migrations and push them to your database instance:

```bash
# Generate database schema snapshot
npx drizzle-kit generate

# Run migrations on database
npx drizzle-kit migrate
```

Alternatively, to quickly sync schemas during local testing, you can use:
```bash
npx drizzle-kit push
```

### 5. Run the Application

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 6. Build for Production

To verify TypeScript compilations, route optimization, and build production pages:

```bash
npm run build
npm start
```

---

## 📄 License & Contact

Operated by **Subler, Inc.** For queries related to reverse-marketplace operations, contact us at [info@getsubler.com](mailto:info@getsubler.com).

# ⛄ Snowball Coach — Debt Snowball Calculator

A friendly, mobile-friendly **Debt Snowball / Avalanche** web app built for people with low financial literacy. Includes a calculator, charts, an Excel tracker download, and a saved tracker backed by **Supabase** (auth + Postgres + RLS).

> Educational tool. Not financial advice.

---

## ✨ Features

- **Landing page** — plain-English explanation, friendly hero, call to action
- **Interactive calculator** — add debts, see payoff order, total interest, savings from extra payments
- **Snowball *and* Avalanche** strategies (toggle)
- **Charts** — stacked area balance-over-time, debt pie, payoff timeline
- **Excel download** — pre-built tracker template + export your computed plan (SheetJS)
- **Education** — short, jargon-free Q&A
- **Auth + Saved Tracker** — Supabase email/password login; debts & payment history stored per-user with Row Level Security

---

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — warm, encouraging design system
- **Recharts** — area + pie charts
- **SheetJS (`xlsx`)** — Excel template + plan export
- **Supabase** — Postgres, Auth, Row Level Security via `@supabase/ssr`

---

## 🚀 Quick start

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. In **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates `debts` and `payment_history` tables with RLS policies.
3. In **Authentication → Providers**, make sure **Email** is enabled. For local dev you can disable “Confirm email” to skip the verification step.
4. Copy your project URL and **anon** public key from **Project Settings → API**.

### 3. Configure env

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

---

## 📁 File structure

```
app/
  layout.tsx              Root layout (Navbar + Footer)
  page.tsx                Landing page
  globals.css             Tailwind + design tokens
  calculator/page.tsx     Public calculator
  education/page.tsx      Learn section
  download/page.tsx       Excel tracker download
  login/page.tsx          Sign in / sign up (Supabase)
  dashboard/
    page.tsx              Server component — fetches user’s debts
    DashboardClient.tsx   Interactive tracker UI
components/
  Navbar.tsx
  Footer.tsx
  SnowballIllustration.tsx
  PayoffChart.tsx         Recharts stacked area
  DebtPie.tsx             Recharts pie
  Timeline.tsx            Payoff order timeline
lib/
  snowball.ts             Calculator logic (snowball + avalanche)
  excel.ts                SheetJS export
  supabase/
    client.ts             Browser Supabase client
    server.ts             Server Supabase client
    middleware.ts         Session refresh + route protection
middleware.ts             Wires Supabase session into requests
supabase/
  schema.sql              Database schema + RLS policies
```

---

## 🗄️ Database schema

Created by [`supabase/schema.sql`](supabase/schema.sql):

**`debts`**
| column | type | notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | `auth.users.id`, default `auth.uid()` |
| `name` | `text` | |
| `balance` | `numeric(12,2)` | |
| `min_payment` | `numeric(12,2)` | |
| `interest_rate` | `numeric(6,3)` | APR % |
| `created_at` / `updated_at` | `timestamptz` | |

**`payment_history`**
| column | type | notes |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | |
| `debt_id` | `uuid` | FK → `debts.id` |
| `amount` | `numeric(12,2)` | |
| `remaining_balance` | `numeric(12,2)` | |
| `paid_on` | `date` | |
| `note` | `text` | |

RLS policies restrict every row to `auth.uid() = user_id`.

---

## 🧮 Calculator logic (`lib/snowball.ts`)

Month-by-month simulation:

1. Accrue monthly interest = `balance × (APR / 12)`
2. Pick a *focus* debt: smallest balance (snowball) or highest rate (avalanche)
3. Pay minimums on all other debts
4. Throw remaining pool (minimums of paid-off debts + user extra) at the focus debt
5. Cascade any leftover to the next focus debt
6. Stop when all balances ≤ 0 (cap 600 months)

Returns total months, total interest, total paid, and per-debt month-by-month balances for charting.

---

## 📊 Excel export (`lib/excel.ts`)

Two flows:

- **`downloadTrackerTemplate()`** — blank 3-sheet workbook (My Debts, Monthly Tracker, My Wins) for users who prefer spreadsheets.
- **`downloadPlan(debts, plan)`** — exports the user’s computed plan: summary sheet + month-by-month schedule.

Powered by [SheetJS](https://sheetjs.com).

---

## 🔐 Auth flow

- Email + password via Supabase Auth.
- `middleware.ts` refreshes the session on every request and redirects unauthenticated users away from `/dashboard`.
- Server components use `lib/supabase/server.ts`; client components use `lib/supabase/client.ts`.
- All reads/writes go through RLS — users can only see their own rows.

---

## 🎨 Design principles

- Warm green + cream palette, big rounded buttons, generous spacing
- Plain-language labels (“Extra money I can pay each month”), helper microcopy
- Empty states everywhere (`Add at least one debt above to see your plan`)
- Mobile-first responsive grid
- Big numeric “stat” cards so wins feel visible

---

## 🛣 Recommended next improvements

- Replace the in-memory calculator state with optional URL/share links
- Add **password reset** + **magic link** sign-in (Supabase one-liners)
- Add a **goals/milestones** table and confetti when a debt hits $0
- Add **email reminders** (Supabase scheduled function + Resend)
- Replace `text` notes with a richer `journal` table for motivation tracking
- Add **PDF export** alongside Excel
- Internationalize (i18n) — translations + locale-aware currency
- Accessibility audit (focus rings, aria-live for result updates) — basics are in place

---

## 📦 Deploy

Works out of the box on **Vercel**. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel dashboard and deploy.

---

## License

MIT — use it, fork it, help someone get out of debt.

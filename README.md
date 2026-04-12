# CNC DAO — Carbon Nature Chain

Environmental NFT Marketplace on Solana. Verify, mint, and trade carbon credit and nature-based NFT assets, powered by community validators.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Privy (email + Solana wallet + Google)
- **Blockchain**: Solana
- **Validation**: Zod
- **Session**: JWT in httpOnly cookies (jose)

## Brand Colors

| Name   | Hex       |
|--------|-----------|
| Yellow | `#FEC107` |
| Black  | `#000000` |
| White  | `#FFFFFF` |

## Project Structure

```
cncdao/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── layout.tsx                ← Root layout + fonts
│   ├── globals.css
│   ├── middleware.ts             ← Edge auth guard
│   ├── marketplace/page.tsx      ← Browse all NFTs
│   ├── validators/
│   │   ├── page.tsx              ← Validator portal
│   │   └── apply/page.tsx        ← KYC application
│   ├── dashboard/page.tsx        ← Protected user dashboard
│   └── api/
│       ├── auth/route.ts         ← Login / logout
│       ├── kyc/route.ts          ← KYC application
│       ├── validators/
│       │   └── action/route.ts   ← Approve / reject campaigns
│       └── nft/route.ts          ← NFT listings
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx         ← Privy provider
│   └── ui/
│       ├── HeroSection.tsx
│       ├── StatsBar.tsx
│       ├── FeaturedNFTs.tsx
│       ├── HowItWorks.tsx
│       ├── ValidatorCTA.tsx
│       ├── TrustBar.tsx
│       ├── MarketplaceGrid.tsx
│       ├── ValidatorPortal.tsx
│       ├── KYCForm.tsx
│       └── UserDashboard.tsx
└── lib/
    ├── auth.ts                   ← JWT sign/verify, session helpers
    ├── rate-limit.ts             ← In-memory rate limiter
    ├── validate.ts               ← Zod schemas
    └── api.ts                    ← Consistent response helpers
```

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-org/cncdao.git
cd cncdao
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Privy — get from https://privy.io (free tier available)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# JWT secret — generate with:  openssl rand -base64 32
JWT_SECRET=your_jwt_secret_here

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Privy Setup

1. Go to [privy.io](https://privy.io) → Create app → copy App ID and Secret
2. In Privy dashboard → Appearance: set accent color to `#FEC107`
3. In Privy dashboard → Login methods: enable Email, Wallets, Google
4. In Privy dashboard → Wallets → Solana: enable Phantom, Solflare, Backpack

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

## Security Checklist ✅

- [x] JWT tokens in `httpOnly` cookies — never localStorage
- [x] Tokens expire (7 days), logout invalidates session
- [x] Every protected route server-side auth check (`middleware.ts` + page-level)
- [x] User cannot access other users' data (scoped by `session.userId`)
- [x] All inputs validated with Zod before processing
- [x] No raw user input hits DB or logic
- [x] API responses never expose internals or stack traces
- [x] Consistent `{ success, data/error }` response format
- [x] No API keys in frontend (`PRIVY_APP_SECRET` never exposed)
- [x] No secrets in repo (`.env` in `.gitignore`)
- [x] CORS not set to `*`
- [x] Rate limiting on all auth + submission endpoints
- [x] Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- [x] No default passwords or test credentials

## Adding a Database

The app is wired for any database. Recommended: **Supabase** (free tier, Postgres).

```bash
npm install @supabase/supabase-js
```

Then replace the `// TODO: Save to database` comments in `app/api/kyc/route.ts` and `app/api/validators/action/route.ts` with your Supabase queries.

## Validator Role Flow

1. User submits KYC via `/validators/apply`
2. Admin reviews → updates user role to `validator` in DB
3. Next time user logs in, session token includes `role: 'validator'`
4. Validator can now access `/validators` portal and take actions

## Deployment

```bash
# Vercel (recommended)
npx vercel

# Or build locally
npm run build
npm start
```

Set all environment variables in Vercel dashboard → Settings → Environment Variables.

> ⚠️ For production: replace the in-memory rate limiter (`lib/rate-limit.ts`) with Redis (Upstash free tier recommended).

# MediBot — Brief Overview

MediBot is an AI-powered health assistant built with Next.js and Firebase. It provides conversational AI features, medication management, reminders, notifications, and integrations with payment and messaging providers. This brief README summarizes the most important information to get started.

**Project:** MediBot (web + PWA)
**Tech:** Next.js, TypeScript, Tailwind CSS, Firebase (Auth, Firestore, Storage), Resend / Nodemailer for email, Stripe / Razorpay for payments, AI integrations (Gemini, OpenAI, Anthropic, GROQ), Twilio for SMS (optional)

**Quick Start**
- Clone the repo and install dependencies:

```
git clone <repo-url>
cd medibot-main
npm install
```

- Copy environment template and populate secrets:

```
cp .env .env.local
# or create .env.local and paste values
```

- Start dev server:

```
npm run dev
```

**Important environment variables (most-used)**
- Firebase (client):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

- Firebase (server / admin):
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`  (replace newlines with `\n`)

- Email (Resend recommended):
  - `RESEND_API_KEY` (server-side)
  - Fallback (Gmail SMTP): `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` (use App Password)

- AI / Models:
  - `NEXT_PUBLIC_GROQ_API_KEY` (for GROQ models)
  - `NEXT_PUBLIC_GEMINI_API_KEY` (Gemini)
  - `NEXT_PUBLIC_OPENAI_API_KEY` (OpenAI)
  - `NEXT_PUBLIC_ANTHROPIC_API_KEY` (Anthropic)

- Payments / SMS:
  - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (optional)

- Other:
  - `NODE_ENV` (development/production)

**Dev notes & troubleshooting**
- If AI models complain about missing keys (e.g., `GROQ API key is not configured`), add the corresponding `NEXT_PUBLIC_*` key and restart the dev server.
- If `/api/send-email` returns HTML or a 500, check terminal logs for `app/api/send-email/route.ts` — the route logs errors for Resend and Gmail fallbacks.
- For push notifications: ensure the client saves `fcmToken` to the user document in Firestore and that Admin SDK env vars (`FIREBASE_PRIVATE_KEY`, etc.) are configured for `/api/send-push`.
- For Gmail SMTP: use an App Password, not your Google account password.

**Files & locations of interest**
- Firebase client: `lib/firebase.ts`
- Firebase admin / server usage: `app/api/send-push/route.ts`, `scripts/sendRemindersCron.js`
- Email API: `app/api/send-email/route.ts`
- AI/premium features: `app/premium-features/page.tsx`
- Medications: `app/medications/page.tsx`

**Recommended next steps**
- Create `.env.local` for local secrets (already ignored by `.gitignore`).
- Create `.env.example` with placeholder values for repository reference.
- Add setup docs for service accounts (Firebase Admin) and mailing service (Resend or Gmail App Password).

**Support / Contact**
- Repo owner/maintainer: `Reshmasudeepa` (see repository settings)

**License**
- See `LICENSE` in the repository root.

---

If you'd like, I can:
- Replace the top-level `README.md` with this brief version, or
- Create a `.env.example` from the current `.env` template (safe to commit), or
- Add a setup guide for Firebase Admin/Resend with step-by-step screenshots.

Tell me which follow-up you'd like.
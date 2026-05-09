# AHEA Strategic Messaging Tool (Frontend)

This repository is the **frontend-only** Strategic Messaging Tool for AHEA.

## Architecture
- Next.js App Router + TypeScript + Tailwind CSS frontend.
- Shared backend: `https://api.americanhealthequity.org`.
- Backend handles authentication/session, usage tracking, rate limiting, paywall decisions, OpenAI calls, and generation logging.

## Backend endpoints used
- `GET /api/me` for auth, access state, and usage/paywall status.
- `POST /api/generate` for strategic messaging generation requests.

Every generation request sends:
- `toolId: "strategic-messaging"`
- `input` payload for message/audience/mode/context/follow-up.

## Environment variables
Required:
- `NEXT_PUBLIC_AHEA_BACKEND_URL=https://api.americanhealthequity.org`

Remove old frontend env vars from Vercel for this repo:
- `OPENAI_API_KEY`
- `APP_ACCESS_CODE`

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example`.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build check:
   ```bash
   npm run build
   ```

## Access and complimentary usage
- Verified users receive **2 complimentary generations total across all AHEA tools** (enforced by shared backend).
- Squarespace can link/embed this app, but Squarespace itself does **not** directly decide AI generation access.

## Notes
- This app preserves current UI/UX and embedding support.
- Do not enter confidential patient information or protected health information (PHI).
- This tool provides communication support and not legal/compliance/policy advice.

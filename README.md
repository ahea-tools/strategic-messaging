# AHEA Strategic Messaging Tool


Focused, cost-efficient strategic rewrite support for American Health Equity Association members.

## Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Server-side OpenAI Responses API with Structured Outputs
- No database, no user accounts, no saved history, no analytics in v1

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and add values.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build check:
   ```bash
   npm run build
   ```

## Environment variables
- `OPENAI_API_KEY` (required)
- `APP_ACCESS_CODE` (optional lightweight gate)

Reminder: add `OPENAI_API_KEY` in Vercel Project Settings → Environment Variables.

## Deployment notes (Vercel)
- This app is Vercel-ready and does not require a database or background worker.
- Intended to be embedded (iframe) or linked from a Squarespace members-only page.
- Important: Squarespace paywalling protects the Squarespace page, not necessarily direct access to the Vercel URL.

## Optional APP_ACCESS_CODE behavior
- If set, users must enter a matching access code before using the tool.
- Stored only in browser `sessionStorage`.
- This is a lightweight gate for v1 and **not** true authentication.

## Cost-control notes
- Message input capped at 3,000 characters.
- One API call per Generate click.
- One API call per follow-up click.
- Concise schema and concise default output.
- Central config for model, temperature, character limit, and token limit.

## Privacy and disclaimer
- Do not enter confidential patient information or protected health information (PHI).
- This tool provides communication support and does not provide legal, compliance, or policy advice.

## Sample test inputs
1. “Our health equity initiative is designed to address systemic barriers and reduce disparities among marginalized communities by centering community voice in program design.”
2. “We are centering lived experience and prioritizing historically excluded residents to guide our outreach and resource allocation strategy.”
3. “This program provides targeted outreach to vulnerable populations experiencing social determinants of health that limit equitable access to care.”

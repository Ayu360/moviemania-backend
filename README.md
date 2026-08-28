# MovieMania Backend

Auth server for the MovieMania mobile app. Verifies Firebase Google sign-in tokens, issues app-owned JWTs, stores users in MongoDB.

## Stack

- Node.js + Express + TypeScript
- MongoDB via Mongoose
- `firebase-admin` for token verification
- `jsonwebtoken` for app-issued tokens (30-day expiry)

## Routes

| Method | Path              | Auth        | Purpose |
|--------|-------------------|-------------|---------|
| GET    | `/health`         | none        | Healthcheck |
| POST   | `/auth/firebase`  | none        | Verify Firebase ID token, upsert user by email, return `{ appUid, appToken, user }` |
| GET    | `/me`             | Bearer JWT  | Return the current user record |

## Local development

Prerequisites: Node 20+, yarn, a Firebase project, a MongoDB URI.

```bash
yarn install
cp .env.example .env       # fill in MONGODB_URI, JWT_SECRET
# Place your Firebase Admin service account key at ./service-account.json
yarn dev                   # tsx watch — restarts on save
```

Server runs on `http://localhost:4000`.

### Firebase credentials

Two ways to provide the service account:

- **Local (default):** place `service-account.json` at the project root. Ignored by git.
- **Deployed (Render, etc.):** set `FIREBASE_SERVICE_ACCOUNT_JSON` env var to the entire JSON contents as a single string. Takes precedence over the file.

## Deploy to Render

1. Push this repo to GitHub.
2. On Render: **New → Web Service**, connect the repo.
3. Build command: `yarn install && yarn build`
4. Start command: `yarn start`
5. Environment variables:
   - `MONGODB_URI` — your Atlas URI (Render's IP range must be whitelisted in Atlas, or set `0.0.0.0/0`)
   - `JWT_SECRET` — long random string
   - `FIREBASE_SERVICE_ACCOUNT_JSON` — paste the entire `service-account.json` contents
   - `PORT` — Render sets automatically; leave the default in code

## Files

```
src/
  index.ts              Express bootstrap, mounts routes
  db.ts                 Mongoose connect
  firebase.ts           firebase-admin init (env var or file)
  models/User.ts        Mongoose user schema
  routes/auth.ts        POST /auth/firebase
  routes/me.ts          GET /me
  middleware/auth.ts    JWT bearer verify
  lib/jwt.ts            Sign/verify helpers
```

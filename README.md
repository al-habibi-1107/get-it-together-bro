# Meridian

Personal command centre. Eisenhower priority matrix + daily habit tracking + consistency streak graph + AI summary.

Built for one user, used daily.

## Stack

| | |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Auth | Firebase Auth (Google OAuth + email/password) |
| Database | Cloud Firestore |
| Backend | Firebase Cloud Functions (Node.js) |
| AI | Anthropic API — `claude-sonnet-4-6` |
| Email | Resend |
| Hosting | Vercel |

## Local setup

```bash
git clone <repo-url>
cd meridian
npm install
cp .env.example .env
```

Fill in `.env` with your Firebase project values from **Firebase Console → Project Settings → Your apps → SDK setup**.

```bash
npm run dev
```

## Firebase setup

1. Enable **Authentication** → Sign-in methods → Google + Email/Password
2. Add `http://localhost:5173` and your Vercel domain to **Authentication → Settings → Authorized domains**
3. Create a **Firestore** database in production mode, then set these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Commands

```bash
npm run dev       # start dev server
npm run build     # type-check + build for production
npm run preview   # preview production build locally
```

## Build phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Login, task matrix, habit checklist, streak graph, manual AI export | ✅ Done |
| 2 | Anthropic API via Cloud Function, live AI summary panel | ⬜ Upcoming |
| 3 | Nightly email (Resend), PWA | ⬜ Upcoming |

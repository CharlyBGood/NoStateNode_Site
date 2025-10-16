# AI Agent Instructions for NoStateNode

This repo is a React 18 + Firebase v9 app created with CRA. It manages personal notes (“tasks”) that can be shared read-only via a public route. Use these conventions to move fast without breaking the project’s patterns.

## Architecture at a glance
- Routing (React Router v6): `src/App.js` declares routes. Authenticated home at `/`, public routes include `/Login`, `/Register`, `/Welcome`, and shared lists at `/shared/:userId` (component `components/SharedTasksPage.js`).
- Auth: `src/context/AuthContext.js` wraps the app and exposes `useAuth()` with `{ user, loading, login, signup, logout, loginWithGoogle, resetPassword }` using Firebase Auth.
- Data: Firestore (modular v9) is initialized in `src/firebase.js` and exported as `db` and `auth`. Notes live in collection `notes` with fields like `{ text, complete, userId, shareWith[], createdAt, updatedAt }`.
- Tasks UI: Owner CRUD in `formPages/TaskList.js` and `formPages/TaskForm.js`. Read-only rendering is via `formPages/Task.js` when used in `SharedTasksPage`.
- Sharing: `components/ShareButton.js` generates a link `/shared/:userId`. `components/ShareModal.js` attempts Web Share API first, with copy-to-clipboard fallback. Shared list display lives in `components/SharedTasksPage.js`.

## Key data flows
- Owner session -> `TaskList` subscribes to `notes` where `userId == user.uid` via `onSnapshot`. Deletes and toggles completion update the same docs.
- Add note -> `TaskForm` writes a new doc with `userId`, `shareWith` (emails), and timestamps.
- Shared view -> `SharedTasksPage` reads from `notes` for `:userId`. When viewer is not the owner, query filters by `array-contains` `shareWith` for `user.email`.

## Important patterns & conventions
- Auth first, then data: Components guard on `useAuth().loading` and `user`. Navigation redirects happen in `useEffect` (not during render) to avoid side-effects while rendering.
- Firestore v9 modular API: Always import specific methods (e.g., `collection`, `query`, `where`, `onSnapshot`, `doc`, `updateDoc`, `deleteDoc`).
- Subscriptions cleanup: Hold the function returned by `onSnapshot` and unsubscribe in the effect cleanup. Also clear prior subscriptions if auth state changes.
- Timestamps: Prefer `serverTimestamp()` for `createdAt`/`updatedAt` when writing notes. Some files still use `new Date()`; align new code to server timestamps.
- Sharing link builder: Use `const link = `${window.location.origin}/shared/${user?.uid || ''}`;` or a small helper so the same pattern is reused.
- Web Share API usage: Feature-detect `navigator.share`. Fallback opens a modal with copy-to-clipboard (`navigator.clipboard.writeText`) if unavailable.

## External dependencies
- React 18, react-router-dom v6
- Firebase v9 (Auth + Firestore)
- Tailwind CSS (with additional hand-written CSS in `src/stylesheets/*`)

## Developer workflows
- Install & run:
  - `npm install`
  - `npm start`
- Build: `npm run build`
- Environment: `.env` must define `REACT_APP_FIREBASE_*` keys referenced in `src/firebase.js`. Do not hard-code secrets.
- Firestore rules (expected model): owner can read/write own notes; shared viewers (by email in `shareWith`) can read. Prepare a composite index for queries on `userId` + `array-contains shareWith`.

## Cross-component interactions
- `TaskForm` (owner) writes docs with `shareWith` emails; `SharedUserPicker` and `AddUserForm` assist in selecting/adding emails.
- `ShareButton` provides the share link and opens `ShareModal`; modal can call Web Share or copy link.
- `ProtectedRoute` ensures private routes are gated by `useAuth()`.

## Common pitfalls to avoid
- Don’t navigate during render. Use `useEffect` when redirecting after auth changes.
- Ensure `user` is available before reading `user.uid` or `user.email`.
- When changing Firestore queries that combine `where('userId','==',...)` and `array-contains`, create the suggested composite index.
- Remember to unsubscribe listeners when auth state changes to avoid memory leaks or duplicate updates.

## Examples from this repo
- Owner tasks query: `query(collection(db,'notes'), where('userId','==', user.uid))` (`formPages/TaskList.js`).
- Shared tasks query: `query(collection(db,'notes'), where('userId','==', userId), where('shareWith','array-contains', user.email))` (`components/SharedTasksPage.js`). Consider bypassing `shareWith` when `user.uid === userId` so owners can view their own shared page.
- Web Share call: `navigator.share({ title: 'NoStateNode', text: 'Mira mi lista de recursos en NoStateNode', url: link })` with fallback to clipboard.

## Where to put new code
- New data logic for tasks/sharing: keep close to existing files under `formPages/` or `components/` following current patterns, or create a small helper in `src/` (e.g., `src/utils/share.js`) if reused in multiple places.
- Auth-related views/logic: under `src/components/*` along with `AuthContext` and `ProtectedRoute`.

If any of these patterns conflict with new code you’re writing, prefer consistency with the files mentioned above. Ask for clarification if manipulating Firestore rules or adding new collections.

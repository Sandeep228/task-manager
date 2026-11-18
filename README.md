# Task Manager (MERN)

MongoDB + Express + React (Vite) + Node. Create, edit, complete, delete, filter and search tasks.

## Prerequisites
Node 18+ and MongoDB running locally (or a free MongoDB Atlas URI).

## Run it
```bash
npm run install:all                      # installs root, server and client
cp server/.env.example server/.env       # edit MONGO_URI if you use Atlas
npm run dev                              # API on :5000, web app on :5173
```
Open http://localhost:5173. Server tests: `npm test`. Production build: `npm run build`.

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/tasks?status=all\|active\|done&q=text` | List and filter tasks |
| POST | `/api/tasks` | Create `{title, priority, due}` |
| PATCH | `/api/tasks/:id` | Update any of `title, priority, due, done` |
| DELETE | `/api/tasks/:id` | Delete one task |
| DELETE | `/api/tasks?completed=true` | Clear completed tasks |
| GET | `/api/health` | Health check |

## Structure
```
server/src/models/Task.js    Mongoose schema + validation (single source of truth)
server/src/routes/tasks.js   REST routes, id checks, field whitelist
server/src/app.js            Express app, CORS, central error handler
server/src/index.js          Connects to MongoDB and starts the server
server/test/                 Model validation tests (node:test, no DB needed)
client/src/api.js            All fetch calls in one place
client/src/App.jsx           State, loading/error handling, filtering
client/src/components/       TaskForm, TaskItem
```

---

## The three most important decisions (for your video)
1. **Validation lives in the Mongoose schema, and the API is thin REST.** Rules like "title required, max 120 chars, priority enum" are defined once on the server, so no client can bypass them. Routes whitelist fields (no mass assignment), validate ids, and a central error handler turns failures into clear `400/404` messages the UI displays.
2. **A clean client/server boundary.** React talks to the API only through `api.js`. In development Vite proxies `/api` to Express, so there are no hard-coded URLs or CORS headaches, and in production the base URL is one env variable.
3. **Good states, not just the happy path.** The UI has loading, empty and error states, a debounced search so it doesn't hit the API on every keystroke, and server-side filtering. Escaped regex in search prevents regex injection. Open tasks sort by priority then due date so the most urgent work is on top.

## Three things I chose not to implement
1. **Authentication and multi-user accounts.** It would add sign-up, password hashing, JWTs and per-user data rules that are bigger than the task logic itself. This version is a single shared list.
2. **Drag-and-drop ordering, subtasks and tags.** Each complicates the data model and accessibility. Automatic priority/due-date sorting meets the need for much less code.
3. **Real-time sync and reminders (WebSockets, email, push).** Needs extra infrastructure and permissions. The visible overdue flag gives most of the value for now.

## One limitation I'd fix with one more day
**There are no integration tests for the API routes.** I tested the schema and the non-database error paths, but the full create/update/delete flow against a real database isn't covered automatically. With a day I'd add Supertest tests using `mongodb-memory-server`, so every route and edge case runs in CI. Related: the list has no pagination, which I'd add alongside it.

---

## Video script (about 90 seconds, speak to camera)
"Hi, I'm [name]. Here are the three decisions behind my MERN task manager.
First, validation lives in the Mongoose schema. The rules are defined once on the server, so nothing the client sends can break them, and the API returns clear error messages that the UI shows to the user.
Second, I kept a clean boundary between front end and back end. React only talks to the API through one file, and Vite proxies requests in development, so there's no hard-coded URL or CORS pain.
Third, I handled the unhappy paths: loading, empty and error states, debounced search, and safe handling of ids and search input.
I chose not to build authentication, drag-and-drop or real-time reminders, to keep the scope on a solid core. My biggest limitation is missing API integration tests, which I'd add first with an in-memory MongoDB. Thanks for watching."

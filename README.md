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



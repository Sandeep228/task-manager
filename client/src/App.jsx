import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { useDebounced } from "./hooks.js";
import { sortTasks } from "./utils.js";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";

const FILTERS = [["all", "All"], ["active", "To do"], ["done", "Done"]];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const q = useDebounced(search);

  const load = useCallback(async () => {
    try {
      setTasks(await api.list({ status, q }));
      setError("");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [status, q]);

  useEffect(() => { load(); }, [load]);

  // Run an API action; surface any error in the banner instead of crashing.
  const run = async fn => {
    try { await fn(); setError(""); return true; }
    catch (e) { setError(e.message); return false; }
  };

  const save = data =>
    run(async () => {
      if (editing) {
        const t = await api.update(editing._id, data);
        setTasks(ts => ts.map(x => (x._id === t._id ? t : x)));
        setEditing(null);
      } else {
        await api.create(data);
        await load();
      }
    });

  const toggle = t => run(async () => {
    const u = await api.update(t._id, { done: !t.done });
    await load(); // refresh so the active/done filter stays accurate
    return u;
  });
  const remove = t => run(async () => { await api.remove(t._id); setTasks(ts => ts.filter(x => x._id !== t._id)); });
  const clearDone = () => run(async () => { await api.clearDone(); await load(); });

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);
  const open = tasks.filter(t => !t.done).length;

  return (
    <main>
      <header>
        <h1>Tasks</h1>
        {status === "all" && !q && tasks.length > 0 && <p aria-live="polite">{open} to do, {tasks.length - open} done</p>}
      </header>

      <TaskForm key={editing?._id ?? "new"} editing={editing} onSave={save} onCancel={() => setEditing(null)} />

      {error && <p className="banner" role="alert">{error}</p>}

      <nav className="tools">
        <div role="group" aria-label="Filter tasks">
          {FILTERS.map(([value, label]) => (
            <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>
          ))}
        </div>
        <input type="search" placeholder="Search tasks" aria-label="Search tasks" value={search} onChange={e => setSearch(e.target.value)} />
      </nav>

      <ul>
        {loading ? <li className="empty">Loading tasks…</li>
          : sorted.length === 0 ? <li className="empty">{status === "all" && !q ? "No tasks yet. Add your first one above." : "No tasks match this view."}</li>
          : sorted.map(t => <TaskItem key={t._id} task={t} onToggle={toggle} onEdit={setEditing} onDelete={remove} />)}
      </ul>

      {tasks.some(t => t.done) && <button className="link" onClick={clearDone}>Clear completed tasks</button>}
    </main>
  );
}

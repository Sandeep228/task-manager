import { useState } from "react";

export default function TaskForm({ editing, onSave, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [priority, setPriority] = useState(editing?.priority ?? "medium");
  const [due, setDue] = useState(editing?.due ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!title.trim()) return setError("Enter a task title.");
    setBusy(true);
    const ok = await onSave({ title, priority, due });
    setBusy(false);
    if (ok && !editing) { setTitle(""); setDue(""); setError(""); }
  };

  return (
    <form onSubmit={submit} autoComplete="off">
      <input type="text" placeholder="What needs doing?" aria-label="Task title" maxLength={120}
        value={title} onChange={e => { setTitle(e.target.value); setError(""); }} autoFocus={!!editing} />
      <div className="row">
        <select aria-label="Priority" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
        </select>
        <input type="date" aria-label="Due date" value={due} onChange={e => setDue(e.target.value)} />
        <button type="submit" disabled={busy}>{editing ? "Save changes" : "Add task"}</button>
        {editing && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
      <p className="form-error" role="alert">{error}</p>
    </form>
  );
}

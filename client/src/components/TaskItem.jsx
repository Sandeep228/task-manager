import { isOverdue } from "../utils.js";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  return (
    <li className={`task p-${task.priority}${task.done ? " done" : ""}`}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.done ? "not done" : "done"}`} />
      <div className="text">
        <span className="title">{task.title}</span>
        <span className={`meta${overdue ? " overdue" : ""}`}>
          {task.priority}{task.due && ` · due ${task.due}`}{overdue && " · overdue"}
        </span>
      </div>
      <button className="link" onClick={() => onEdit(task)} aria-label={`Edit "${task.title}"`}>Edit</button>
      <button className="link danger" onClick={() => onDelete(task)} aria-label={`Delete "${task.title}"`}>Delete</button>
    </li>
  );
}

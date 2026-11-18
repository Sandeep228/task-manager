const RANK = { high: 0, medium: 1, low: 2 };

// Open tasks first, then by priority, then earliest due date, then newest.
export const sortTasks = tasks =>
  [...tasks].sort(
    (a, b) =>
      a.done - b.done ||
      RANK[a.priority] - RANK[b.priority] ||
      (a.due || "9999").localeCompare(b.due || "9999") ||
      b.createdAt.localeCompare(a.createdAt)
  );

export const isOverdue = (t, today = new Date().toISOString().slice(0, 10)) => !t.done && !!t.due && t.due < today;

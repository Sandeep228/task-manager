const BASE = import.meta.env.VITE_API_URL ?? "/api";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the API is running.");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export const api = {
  list: ({ status = "all", q = "" } = {}) => request(`/tasks?${new URLSearchParams({ status, q })}`),
  create: task => request("/tasks", { method: "POST", body: JSON.stringify(task) }),
  update: (id, changes) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(changes) }),
  remove: id => request(`/tasks/${id}`, { method: "DELETE" }),
  clearDone: () => request("/tasks?completed=true", { method: "DELETE" }),
};

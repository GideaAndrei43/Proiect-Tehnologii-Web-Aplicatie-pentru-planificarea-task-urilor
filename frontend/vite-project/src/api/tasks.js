import { API } from "../api";

// helper pentru headers cu token
function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-auth-token": token } : {}),
  };
}

// GET ALL TASKS
export async function getTasks() {
  const res = await fetch(`${API}/tasks`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// GET TASK BY ID
export async function getTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// CREATE TASK (manager)
export async function createTask(data) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ASSIGN MULTI (manager)
export async function assignTask(taskId, userIds) {
  const res = await fetch(`${API}/tasks/assign-multi/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ userIds }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// COMPLETE TASK (executant)
export async function completeTask(taskId) {
  const res = await fetch(`${API}/tasks/complete/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// CLOSE TASK (manager/executant)
export async function closeTask(taskId) {
  const res = await fetch(`${API}/tasks/close/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// UPDATE TASK (admin)
export async function updateTask(taskId, data) {
  const res = await fetch(`${API}/tasks/${taskId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

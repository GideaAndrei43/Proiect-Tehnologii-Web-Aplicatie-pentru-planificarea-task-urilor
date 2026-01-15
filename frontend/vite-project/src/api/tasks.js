import { API, getHeaders } from "../api.js";

async function parseResponse(res) {
  if (res.ok) return res.json();
  // fallback dacă nu e JSON
  const err = await res.json().catch(() => res.text().then(text => ({ msg: text })));
  throw new Error(err.msg || "Request failed");
}

// GET ALL TASKS
export async function getTasks() {
  const res = await fetch(`${API}/tasks`, { headers: getHeaders() });
  return parseResponse(res);
}

// GET TASK BY ID
export async function getTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, { headers: getHeaders() });
  return parseResponse(res);
}

// CREATE TASK
export async function createTask(data) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

// ASSIGN MULTI
export async function assignTask(taskId, userIds) {
  const res = await fetch(`${API}/tasks/assign-multi/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ userIds }),
  });
  return parseResponse(res);
}

// COMPLETE TASK
export async function completeTask(taskId) {
  const res = await fetch(`${API}/tasks/complete/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return parseResponse(res);
}

// CLOSE TASK
export async function closeTask(taskId) {
  const res = await fetch(`${API}/tasks/close/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  return parseResponse(res);
}

// UPDATE TASK
export async function updateTask(taskId, data) {
  const res = await fetch(`${API}/tasks/${taskId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

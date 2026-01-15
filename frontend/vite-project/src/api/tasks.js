import { API } from "../api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("token")
  };
}

// LISTARE TASKURI
export async function getTasks() {
  const res = await fetch(API, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// CREARE TASK (manager)
export async function createTask(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ASIGN TASK MULTI (manager)
export async function assignTask(taskId, userIds) {
  const res = await fetch(`${API}/assign-multi/${taskId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ userIds })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// COMPLETARE TASK (executant)
export async function completeTask(taskId) {
  const res = await fetch(`${API}/complete/${taskId}`, {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// INCHIDERE TASK (manager)
export async function closeTask(taskId) {
  const res = await fetch(`${API}/close/${taskId}`, {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// UPDATE TASK (admin)
export async function updateTask(taskId, data) {
  const res = await fetch(`${API}/${taskId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error updating task");
  return res.json();
}

// GET TASK BY ID
export async function getTask(id) {
  const res = await fetch(`${API}/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

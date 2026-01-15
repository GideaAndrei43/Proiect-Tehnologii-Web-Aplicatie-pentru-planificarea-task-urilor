import { API } from "../api";

// helper pentru headers cu token
function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-auth-token": token } : {}),
  };
}

// GET ALL USERS
export async function getUsers() {
  const res = await fetch(`${API}/users`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// GET USER BY ID
export async function getUser(id) {
  const res = await fetch(`${API}/users/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ADD USER (ADMIN)
export async function addUser(data) {
  if (!data.name || !data.email || !data.password || !data.role)
    throw new Error("Name, email, password, and role are required");

  if (data.managerId) data.managerId = parseInt(data.managerId);

  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// UPDATE USER (ADMIN)
export async function updateUser(id, data) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// DELETE USER (ADMIN)
export async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

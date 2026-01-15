import { API } from "../api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("token"),
  };
}

export async function getUsers() {
  const res = await fetch(API, { headers: getHeaders() });
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${API}/${id}`, { headers: getHeaders() });
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating user");
  return res.json();
}

// **NOU**: addUser
export async function addUser(data) {
  // Verificăm că există câmpurile obligatorii
  if (!data.name || !data.email || !data.password || !data.role) {
    throw new Error("Name, email, password, and role are required");
  }

  // Convertim managerId la integer dacă există
  if (data.managerId) data.managerId = parseInt(data.managerId);

  const res = await fetch(API, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error adding user");
  }

  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}



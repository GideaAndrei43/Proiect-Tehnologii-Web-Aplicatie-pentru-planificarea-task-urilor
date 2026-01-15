async function parseResponse(res) {
  if (res.ok) return res.json();
  const err = await res.json().catch(() => res.text().then(text => ({ msg: text })));
  throw new Error(err.msg || "Request failed");
}

// GET ALL USERS
export async function getUsers() {
  const res = await fetch(`${API}/users`, { headers: getHeaders() });
  return parseResponse(res);
}

// GET USER BY ID
export async function getUser(id) {
  const res = await fetch(`${API}/users/${id}`, { headers: getHeaders() });
  return parseResponse(res);
}

// ADD USER
export async function addUser(data) {
  if (!data.name || !data.email || !data.password || !data.role)
    throw new Error("Name, email, password, and role are required");

  if (data.managerId) data.managerId = parseInt(data.managerId);

  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

// UPDATE USER
export async function updateUser(id, data) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

// DELETE USER
export async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return parseResponse(res);
}

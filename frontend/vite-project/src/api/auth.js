import { API } from "../api";

// REGISTER
export async function register(data) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // fallback fără await în callback
    const err = await res.json().catch(() => res.text().then(text => ({ msg: text })));
    throw new Error(err.msg || "Eroare la register");
  }

  return res.json();
}

// LOGIN
export async function login(data) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => res.text().then(text => ({ msg: text })));
    throw new Error(err.msg || "Eroare la login");
  }

  return res.json();
}

// api.js
export const API = "https://proiect-tehnologii-web-aplicatie-pentru-79ku.onrender.com/api";


export function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

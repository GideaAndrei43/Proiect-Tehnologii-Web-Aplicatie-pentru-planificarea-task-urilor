const API = "http://localhost:5000/api/users";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("token")
  };
}


// LISTĂ UTILIZATORI
export async function getUsers() {
  const res = await fetch(API, {
    headers: getHeaders()
  });

  return res.json();
}

// GET USER BY ID
export async function getUser(id) {
  const res = await fetch(`${API}/${id}`, {
    headers: getHeaders()
  });

  return res.json();
}
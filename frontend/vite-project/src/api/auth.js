const API="http://localhost:5000/api"

export async function register(data){
  const res=await fetch(`${API}/auth/register`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });
  if(!res.ok) throw new Error("Eroare la register");
  return res.json();
}


///functie login

export async function login(data){
  const res=await fetch(`{API}/auth/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  });
  if(!res.ok) throw new Error("Eroare la Login");
  return res.json()
}
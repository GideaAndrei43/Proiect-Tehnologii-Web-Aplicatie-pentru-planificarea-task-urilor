const API="http://localhost:5000/api/tasks";

function getHeaders(){
  return {
    "Content-Type":"application/json",
    "x-auth-token":localStorage.getItem("token")
  };
}

//listare taskuri

export async function getTasks(){
  const res=await fetch(API,{
    headers:getHeaders()
  });
  return res.json();
}

//creare task(manageri)

export async function createTask(data){
  const res=await fetch(API,{
    method:"POST",
    headers:getHeaders(),
    body:JSON.stringify(data)
  });
  return res.json();
}

//asign task
export async function asignTask(taskId,userId){
  const res=await fetch(`${API}/assign/${taskId}`,{
    method:"POST",
    headers:getHeaders(),
    body:JSON.stringify({userId})
  })
  return res.json();
}

//completare task

export async function completeTask(taskId){
  const res=await fetch(`${API}/complete/${taskId}`,{
    method:"POST",
    headers:getHeaders(),
    
  })
  return res.json();
}

// MANAGER ÎNCHIDE TASK
export async function closeTask(taskId) {
  const res = await fetch(`${API}/close/${taskId}`, {
    method: "POST",
    headers: getHeaders()
  });

  return res.json();
}




import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  assignTask,
  completeTask,
  closeTask,
  updateTask
} from "../api/tasks";
import { getUsers, addUser, updateUser, deleteUser } from "../api/users";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const userId = parseInt(localStorage.getItem("userId"));

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Manager – filter by executant
  const [selectedExecutantId, setSelectedExecutantId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Task editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({ title: "", description: "", assignedToIds: [] });

  // Admin – User management
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "executant", managerId: null });

  // === LOAD TASKS & USERS ===
  const load = async () => {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);

      if (role !== "executant") setUsers(await getUsers());

      if (role === "manager" && selectedExecutantId) filterExecutantTasks(selectedExecutantId, allTasks);
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter tasks for manager by selected executant
  const filterExecutantTasks = (execId, taskList = tasks) => {
    const filtered = taskList.filter(t => t.assignedTo?.some(u => Number(u.id) === Number(execId)));
    setFilteredTasks(filtered);
  };

  const handleExecutantChange = (id) => {
    setSelectedExecutantId(id);
    filterExecutantTasks(id);
  };

  // === TASK HANDLERS ===
  const handleTaskEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTask({
      title: task.title,
      description: task.description,
      assignedToIds: task.assignedTo?.map(u => u.id) || []
    });
  };

  const handleTaskChange = (field, value) => setEditingTask({ ...editingTask, [field]: value });

  const handleTaskSave = async () => {
    try {
      await updateTask(editingTaskId, editingTask);
      setEditingTaskId(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignTask = async (taskId, selectedIds) => {
    try {
      await assignTask(taskId, selectedIds);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try { await completeTask(taskId); load(); } 
    catch (err) { alert(err.message); }
  };

  const handleCloseTask = async (taskId) => {
    try { await closeTask(taskId); load(); } 
    catch (err) { alert(err.message); }
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return alert("Title is required");
    if (!description.trim() || description.trim().length < 10) return alert("Description must be at least 10 characters");

    const task = await createTask({ title, description });
    if (editingTask.assignedToIds.length) await assignTask(task.id, editingTask.assignedToIds);

    setTitle(""); setDescription(""); setEditingTask({ title: "", description: "", assignedToIds: [] });
    load();
  };

  // === ADMIN HANDLERS ===
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) return alert("All fields required");
    if (newUser.password.length < 6) return alert("Password must be at least 6 chars");
    try {
      await addUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "executant", managerId: null });
      load();
    } catch (err) { alert(err.message); }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      await updateUser(id, data);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      load();
    } catch (err) { alert(err.message); }
  };

  useEffect(() => { load(); }, []);

  // === STYLES ===
  const glassStyle = { background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", borderRadius: "12px", padding: "15px", margin: "10px 0", boxShadow: "0 4px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.3)" };
  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.5)", marginRight: "10px", width: "250px", outline: "none", background: "rgba(255,255,255,0.1)", color: "white" };
  const buttonStyle = { padding: "8px 15px", borderRadius: "8px", border: "none", background: "rgba(255,255,255,0.25)", color: "white", cursor: "pointer", marginLeft: "10px", transition: "0.2s" };
  const taskContainerStyle = (active) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", ...glassStyle, borderLeft: active ? "5px solid #ff6b6b" : "1px solid rgba(255,255,255,0.3)" });
  const activeStatuses = ["OPEN", "PENDING"];
  const finalizedStatuses = ["COMPLETED", "CLOSED"];

  // === RENDER ===
  const visibleTasks = role === "manager" && selectedExecutantId ? filteredTasks : 
                        role === "executant" ? tasks.filter(t => t.assignedTo?.some(u => u.id === userId)) : tasks;

  const activeTasks = visibleTasks.filter(t => activeStatuses.includes(t.status));
  const finalizedTasks = visibleTasks.filter(t => finalizedStatuses.includes(t.status));

  return (
    <div style={{ padding: "20px", fontFamily: "Helvetica, Arial, sans-serif", color: "white", minHeight: "100vh", background: "linear-gradient(135deg, #1e1e2f, #3b3b58)" }}>
      <h2>Dashboard – {role.toUpperCase()}</h2>

      {/* MANAGER CREATE TASK */}
      {role === "manager" && (
        <div style={glassStyle}>
          <h3>Create & Assign Task</h3>
          <input style={inputStyle} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} placeholder="Description (min 10 chars)" value={description} onChange={e => setDescription(e.target.value)} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", margin: "5px 0" }}>
            {users.filter(u => u.role === "executant").map(u => (
              <label key={u.id} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.1)", padding: "2px 5px", borderRadius: "5px" }}>
                <input type="checkbox" checked={editingTask.assignedToIds.includes(u.id)} onChange={e => {
                  let newIds = [...editingTask.assignedToIds];
                  if(e.target.checked) newIds.push(u.id);
                  else newIds = newIds.filter(id => id !== u.id);
                  setEditingTask({...editingTask, assignedToIds: newIds});
                }} />
                {u.name}
              </label>
            ))}
          </div>
          <button style={buttonStyle} onClick={handleCreateTask}>Create Task</button>
        </div>
      )}

      {/* TASKS ACTIVE */}
      <h3>Active Tasks</h3>
      {activeTasks.map(t => (
        <div key={t.id} style={taskContainerStyle(true)}>
          <div>
            <b>{t.title}</b> – <i>{t.status}</i><br />
            <span style={{ fontSize: "0.9em" }}>Assigned to: {t.assignedTo?.map(u => u.name).join(", ") || "None"} | Created by: {t.createdBy?.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {/* Manager assign */}
            {role === "manager" && t.status === "OPEN" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {users.filter(u => u.role === "executant").map(u => (
                  <label key={u.id} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.1)", padding: "2px 5px", borderRadius: "5px" }}>
                    <input type="checkbox" checked={t.assignedTo?.some(a => a.id === u.id)} onChange={e => {
                      let newAssigned = t.assignedTo?.map(a => a.id) || [];
                      if(e.target.checked) newAssigned.push(u.id);
                      else newAssigned = newAssigned.filter(id => id !== u.id);
                      handleAssignTask(t.id, newAssigned);
                    }} />
                    {u.name}
                  </label>
                ))}
              </div>
            )}

            {/* Complete/Close */}
            {role === "executant" && t.assignedTo?.some(a => a.id === userId) && t.status === "PENDING" && (
              <button style={buttonStyle} onClick={() => handleCompleteTask(t.id)}>Complete</button>
            )}
            {(role === "executant" && t.assignedTo?.some(a => a.id === userId) && t.status === "COMPLETED") ||
             (role === "manager" && t.status === "COMPLETED") ? (
              <button style={buttonStyle} onClick={() => handleCloseTask(t.id)}>Close</button>
            ) : null}
          </div>
        </div>
      ))}

      {/* TASKS FINALIZED */}
      <h3>Finalized Tasks</h3>
      {finalizedTasks.map(t => (
        <div key={t.id} style={taskContainerStyle(false)}>
          <div>
            <b>{t.title}</b> – <i>{t.status}</i><br />
            <span style={{ fontSize: "0.9em" }}>Assigned to: {t.assignedTo?.map(u => u.name).join(", ") || "None"} | Created by: {t.createdBy?.name}</span>
          </div>
        </div>
      ))}

      {/* ADMIN – Manage Users */}
      {role === "admin" && (
        <div style={{ marginTop: "30px", ...glassStyle }}>
          <h3>User Management</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            <input style={inputStyle} placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input style={inputStyle} placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <input style={inputStyle} placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <select style={inputStyle} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
              <option value="executant">Executant</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button style={buttonStyle} onClick={handleAddUser}>Add User</button>
          </div>

          <h4>Existing Users</h4>
          {users.map(u => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span>{u.name} ({u.role})</span>
              <div>
                <button style={buttonStyle} onClick={() => handleDeleteUser(u.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

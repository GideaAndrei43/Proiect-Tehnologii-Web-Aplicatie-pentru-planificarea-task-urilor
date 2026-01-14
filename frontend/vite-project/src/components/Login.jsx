import { useState } from "react";
import { login, register } from "../api/auth";

export default function Login({ setToken, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roleType, setRoleType] = useState("executant");
  const [tab, setTab] = useState("login"); // "login" sau "register"

  const handleLogin = async () => {
    if (!email || !password) return alert("Please enter email and password");
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.userId);
      setToken(res.token);
      setRole(res.role);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return alert("All fields are required");
    try {
      await register({ name, email, password, role: roleType });
      alert("User created!");
      // Optional: switch to login tab
      setTab("login");
    } catch (err) {
      alert(err.message);
    }
  };

  // === STYLES ===
  const glassStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "25px",
    width: "350px",
    margin: "20px auto",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
  };

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.5)",
    margin: "10px 0",
    width: "100%",
    outline: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "1em"
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.25)",
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
    fontSize: "1em",
    transition: "0.2s",
  };

  const tabStyle = (active) => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom: active ? "2px solid white" : "2px solid transparent",
    fontWeight: active ? "bold" : "normal",
    transition: "0.2s",
  });

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e1e2f, #3b3b58)",
      fontFamily: "Helvetica, Arial, sans-serif"
    }}>
      <div style={glassStyle}>
        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <div style={tabStyle(tab === "login")} onClick={() => setTab("login")}>Login</div>
          <div style={tabStyle(tab === "register")} onClick={() => setTab("register")}>Register</div>
        </div>

        {/* LOGIN */}
        {tab === "login" && (
          <>
            <input
              style={inputStyle}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button style={buttonStyle} onClick={handleLogin}>Login</button>
          </>
        )}

        {/* REGISTER */}
        {tab === "register" && (
          <>
            <input
              style={inputStyle}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              style={inputStyle}
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
            >
              <option value="executant">Executant</option>
              <option value="manager">Manager</option>
             
            </select>
            <button style={buttonStyle} onClick={handleRegister}>Register</button>
          </>
        )}
      </div>
    </div>
  );
}

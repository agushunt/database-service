import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  function submit(e) {
    e.preventDefault();

    if (user === "admin" && pass === "admin123") {
      localStorage.setItem("admin", "1");
      nav("/");
    } else {
      alert("Username atau password salah");
    }
  }

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: '20px'}}>
      <div style={{background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 6px rgba(8,15,20,0.03)'}}>
        <h2 style={{marginBottom: '20px'}}>Login Admin</h2>

        <form onSubmit={submit} style={{textAlign: 'left'}}>
          <div style={{marginBottom: '10px'}}>
            <label style={{display: 'block', fontSize: '13px', marginBottom: '6px', color: '#64748b'}}>Username</label>
            <input
              className="input"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div style={{marginBottom: '10px'}}>
            <label style={{display: 'block', fontSize: '13px', marginBottom: '6px', color: '#64748b'}}>Password</label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" style={{width: '100%', marginTop: '12px'}}>Login</button>
        </form>

        
      </div>
    </div>
  );
}

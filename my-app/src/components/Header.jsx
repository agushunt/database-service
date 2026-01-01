import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Header() {
const [q, setQ] = useState("");
const nav = useNavigate();

const isLoggedIn = localStorage.getItem("admin") === "1";

function logout() {
  localStorage.removeItem("admin");
  nav("/");
}


return (
<header className="header">
<div className="brand">
  <img src="/logo192.png" alt="Logo" height="36" />
  <h1>Kioratech Service Track</h1>
</div>
<style>{`
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
`}</style>


<form onSubmit={e => { e.preventDefault(); if (q) nav(`/view/${q}`); }}>
<input className="input" placeholder="No Service" value={q} onChange={e => setQ(e.target.value)} />
</form>
<nav>
<button onClick={() => nav("/")} style={{
  background: '#007bff',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  marginRight: '10px',
  transition: 'background-color 0.3s'
}}>Home</button>

<button onClick={() => nav("/admin")} style={{
  background: '#007bff',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  marginRight: '10px',
  transition: 'background-color 0.3s'
}}>Login</button>


{isLoggedIn && <Link to="/admin">Admin</Link>}
{isLoggedIn && <button onClick={logout} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>Logout</button>}
</nav>
</header>
);
}

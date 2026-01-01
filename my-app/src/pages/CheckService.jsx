// ===============================
// src/pages/CheckService.jsx
// ===============================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecords } from "../utils/storage";

export default function CheckService() {
  const [id, setId] = useState("");
  const nav = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (loadRecords().find(r => r.id === id)) nav(`/view/${id}`);
    else alert("Nomor service tidak ditemukan");
  }

  return (
    <form onSubmit={submit} className="public-card">
      <input className="input" placeholder="Nomor Service" value={id} onChange={e => setId(e.target.value)} />
      <button className="btn btn-primary">Cek</button>
    </form>
  );
}
